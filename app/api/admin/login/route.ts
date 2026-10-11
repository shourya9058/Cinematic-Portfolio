import { NextRequest, NextResponse } from "next/server";
import { generateToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { username, password } = body;

        const expectedUser = process.env.ADMIN_USERNAME || process.env.NEXT_PUBLIC_ADMIN_USERNAME || "admin";
        const expectedPass = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "shourya2026";

        if (username === expectedUser && password === expectedPass) {
            const token = generateToken("admin");
            const response = NextResponse.json({ success: true, message: "Authorized" });
            
            response.cookies.set("admin_session", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 7 * 24 * 60 * 60, // 7 days
            });

            return response;
        }

        return NextResponse.json(
            { error: "Unauthorized access. Invalid credentials." },
            { status: 401 }
        );
    } catch {
        return NextResponse.json(
            { error: "Invalid request payload" },
            { status: 400 }
        );
    }
}
