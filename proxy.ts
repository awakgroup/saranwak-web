import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const COOKIE_NAME = "saranwak_admin_session";

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const isAdminPage = pathname.startsWith("/admin");
    const isLoginPage = pathname === "/admin/login";

    if (!isAdminPage || isLoginPage) {
        return NextResponse.next();
    }

    const session = request.cookies.get(COOKIE_NAME)?.value;
    const validSession = process.env.ADMIN_SESSION_TOKEN;

    if (!session || session !== validSession) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};