import { createHmac } from "crypto";

const SECRET = process.env.ADMIN_SESSION_SECRET || "cinematic_portfolio_admin_secret_key_2026";

export function generateToken(username: string): string {
    const timestamp = Date.now().toString();
    const signature = createHmac("sha256", SECRET).update(`${username}:${timestamp}`).digest("hex");
    return `${timestamp}.${signature}`;
}

export function verifyToken(token: string): boolean {
    if (!token) return false;
    const [timestamp, signature] = token.split(".");
    if (!timestamp || !signature) return false;

    // Token expires in 7 days
    const age = Date.now() - parseInt(timestamp, 10);
    if (isNaN(age) || age > 7 * 24 * 60 * 60 * 1000 || age < 0) return false;

    const expected = createHmac("sha256", SECRET).update(`admin:${timestamp}`).digest("hex");
    return signature === expected;
}
