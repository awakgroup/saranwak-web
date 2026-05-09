import { NextResponse } from "next/server";

const COOKIE_NAME = "saranwak_admin_session";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "").trim();

        if (
            username !== process.env.ADMIN_USERNAME ||
            password !== process.env.ADMIN_PASSWORD
        ) {
            return NextResponse.json(
                { message: "Username atau password salah." },
                { status: 401 }
            );
        }

        const sessionToken = process.env.ADMIN_SESSION_TOKEN;

        if (!sessionToken) {
            return NextResponse.json(
                { message: "ADMIN_SESSION_TOKEN belum diset di .env.local." },
                { status: 500 }
            );
        }

        const response = NextResponse.json({
            message: "Login berhasil.",
        });

        response.cookies.set(COOKIE_NAME, sessionToken, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (error) {
        console.error("POST /api/admin/login error:", error);

        return NextResponse.json(
            { message: "Gagal login." },
            { status: 500 }
        );
    }
}