export const onRequestPost: PagesFunction = async (context) => {
    const isHttps = context.request.url.startsWith("https:");
    const cookieParts = [
        "saranwak_admin_session=",
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=0",
    ];
    if (isHttps) {
        cookieParts.push("Secure");
    }
    const cookie = cookieParts.join("; ");

    return Response.json(
        {
            success: true,
            message: "Logout berhasil.",
        },
        {
            headers: {
                "Set-Cookie": cookie,
                "Cache-Control": "no-store",
            },
        }
    );
};