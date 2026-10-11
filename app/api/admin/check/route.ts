import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
    const token = request.cookies.get("admin_session")?.value;
    const isValid = token ? verifyToken(token) : false;

    return NextResponse.json({ authenticated: isValid });
}

export async function POST() {
    const response = NextResponse.json({ success: true, message: "Logged out" });
    response.cookies.delete("admin_session");
    return response;
}
