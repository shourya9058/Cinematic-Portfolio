import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { put } from "@vercel/blob";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        // 1. Authenticate request via session cookie or authorization header
        const sessionCookie = request.cookies.get("admin_session")?.value;
        const authHeader = request.headers.get("authorization")?.replace("Bearer ", "");
        const token = sessionCookie || authHeader;

        if (!token || !verifyToken(token)) {
            return NextResponse.json(
                { error: "Unauthorized. Please log in to the admin panel." },
                { status: 401 }
            );
        }

        // 2. Extract and validate file
        const formData = await request.formData();
        const file = formData.get("resume") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file uploaded" },
                { status: 400 }
            );
        }

        // Security check: Only PDF
        if (file.type !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF files are allowed" },
                { status: 400 }
            );
        }

        // Security check: Size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // 3. Persistent Storage Strategy
        // If Vercel Blob is configured (recommended for production deployments like Vercel):
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                const filename = `resumes/resume_${Date.now()}.pdf`;
                const blob = await put(filename, buffer, {
                    access: "public",
                    contentType: "application/pdf",
                });

                console.log(`Resume uploaded to Vercel Blob: ${blob.url}`);
                return NextResponse.json({
                    success: true,
                    message: "Resume updated successfully in persistent cloud storage.",
                    url: blob.url,
                    storage: "vercel-blob",
                });
            } catch (blobError) {
                console.error("Vercel Blob upload failed:", blobError);
                return NextResponse.json(
                    { error: "Cloud storage upload failed. Check your BLOB_READ_WRITE_TOKEN configuration." },
                    { status: 500 }
                );
            }
        }

        // 4. Local Filesystem Strategy (for local development or self-hosted writable servers)
        try {
            const resumeDir = join(process.cwd(), "public", "resume");
            const localPath = join(resumeDir, "current_resume.pdf");

            await mkdir(resumeDir, { recursive: true });
            await writeFile(localPath, buffer);

            console.log(`Resume updated locally at ${localPath}`);
            return NextResponse.json({
                success: true,
                message: "Resume updated successfully on local disk.",
                url: "/resume/current_resume.pdf",
                storage: "local",
            });
        } catch (fsError: any) {
            console.error("Local file write error:", fsError);

            if (fsError.code === "EROFS" || fsError.message?.includes("read-only")) {
                return NextResponse.json(
                    {
                        error: "Server filesystem is read-only. To persist resume uploads after deployment, please enable Vercel Blob storage in your project settings and configure BLOB_READ_WRITE_TOKEN.",
                    },
                    { status: 500 }
                );
            }

            return NextResponse.json(
                { error: "Failed to save resume file." },
                { status: 500 }
            );
        }
    } catch (error) {
        console.error("Resume Upload Handler Error:", error);
        return NextResponse.json(
            { error: "Internal server error during upload" },
            { status: 500 }
        );
    }
}
