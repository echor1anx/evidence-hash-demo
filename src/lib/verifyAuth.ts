import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret_do_not_use_in_prod";

export async function verifyAuth(req: NextRequest) {
    const token = req.cookies.get("evidence_auth_token")?.value;

    if (!token) {
        return null;
    }

    try {
        const { payload } = await jwtVerify(
            token,
            new TextEncoder().encode(JWT_SECRET)
        );

        return {
            id: payload.userId as string,
            email: payload.email as string,
            role: payload.role as string,
            name: payload.name as string,
        };
    } catch (error) {
        console.error("JWT Verification failed:", error);
        return null;
    }
}
