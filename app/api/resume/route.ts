import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { join } from "path";
import { list } from "@vercel/blob";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const asJson = searchParams.get("json") === "true";

    let resumeBlobUrl: string | null = null;

    // Check Vercel Blob first (for production)
    if (process.env.BLOB_READ_WRITE_TOKEN) {
        try {
            const { blobs } = await list({ prefix: "resumes/" });
            if (blobs && blobs.length > 0) {
                const sorted = [...blobs].sort(
                    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
                );
                if (sorted[0]?.url) {
                    resumeBlobUrl = sorted[0].url;
                }
            }
        } catch (err) {
            console.error("Vercel Blob list error:", err);
        }
    }

    if (asJson) {
        return NextResponse.json({ url: resumeBlobUrl || "/resume/current_resume.pdf" });
    }

    try {
        if (resumeBlobUrl) {
            // Fetch from cloud blob and stream directly
            const blobRes = await fetch(resumeBlobUrl);
            const blobBuffer = await blobRes.arrayBuffer();
            return new NextResponse(blobBuffer, {
                headers: {
                    "Content-Type": "application/pdf",
                    "Content-Disposition": 'inline; filename="Shourya_Singh_Resume.pdf"',
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                },
            });
        }

        // Local fallback: stream file directly from local disk
        const localPath = join(process.cwd(), "public", "resume", "current_resume.pdf");
        const fileBuffer = await readFile(localPath);

        return new NextResponse(fileBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'inline; filename="Shourya_Singh_Resume.pdf"',
                "Cache-Control": "no-cache, no-store, must-revalidate",
            },
        });
    } catch (err) {
        console.error("Failed to serve resume PDF:", err);
        return new NextResponse("Resume file not found", { status: 404 });
    }
}
