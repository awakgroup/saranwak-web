type Env = {
    ADMIN_USERNAME?: string;
    ADMIN_PASSWORD?: string;
};

type LoginPayload = {
    username?: string;
    password?: string;
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
    try {
        const body = (await context.request.json()) as LoginPayload;

        const username = String(body.username ?? "").trim();
        const password = String(body.password ?? "").trim();

        const adminUsername = context.env.ADMIN_USERNAME || "admin";
        const adminPassword = context.env.ADMIN_PASSWORD || "admin123";

        if (!username || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Username dan password wajib diisi.",
                },
                { status: 400 }
            );
        }

        if (username !== adminUsername || password !== adminPassword) {
            return Response.json(
                {
                    success: false,
                    message: "Username atau password salah.",
                },
                { status: 401 }
            );
        }

        const cookie = [
            "saranwak_admin_session=active",
            "Path=/",
            "HttpOnly",
            "SameSite=Lax",
            "Max-Age=86400",
            "Secure",
        ].join("; ");

        return Response.json(
            {
                success: true,
                message: "Login berhasil.",
            },
            {
                headers: {
                    "Set-Cookie": cookie,
                    "Cache-Control": "no-store",
                },
            }
        );
    } catch (error) {
        console.error("POST /api/admin/login error:", error);

        return Response.json(
            {
                success: false,
                message: "Login gagal.",
            },
            { status: 500 }
        );
    }
};