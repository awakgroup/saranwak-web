export const onRequest: PagesFunction = async (context) => {
    const url = new URL(context.request.url);

    // Allow login page and its subpaths without session
    if (url.pathname === "/admin/login" || url.pathname.startsWith("/admin/login/")) {
        return context.next();
    }

    const cookie = context.request.headers.get("Cookie") || "";

    // Require active session cookie
    if (!cookie.includes("saranwak_admin_session=active")) {
        return Response.redirect(new URL("/admin/login", context.request.url), 302);
    }

    return context.next();
};
