export const onRequestPost: PagesFunction = async () => {
    const cookie = [
        "saranwak_admin_session=",
        "Path=/",
        "HttpOnly",
        "SameSite=Lax",
        "Max-Age=0",
        "Secure",
    ].join("; ");

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