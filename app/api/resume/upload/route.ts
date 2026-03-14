import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(request: NextRequest) {
    try {
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

        // Security check: Size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json(
                { error: "File size exceeds 5MB limit" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Path to the public resume folder
        const resumeDir = join(process.cwd(), "public", "resume");
        const path = join(resumeDir, "current_resume.pdf");

        // Ensure directory exists (just in case)
        await mkdir(resumeDir, { recursive: true });

        // Write the file (overwrite)
        await writeFile(path, buffer);

        console.log(`Resume updated successfully at ${path}`);

        return NextResponse.json({ success: true, message: "Resume updated successfully" });
    } catch (error) {
        console.error("Resume Upload Error:", error);
        return NextResponse.json(
            { error: "Internal server error during upload" },
            { status: 500 }
        );
    }
}
