import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only apply middleware to admin routes
  if (pathname.startsWith("/admin")) {
    // Allow access to login page without authentication
    if (pathname === "/admin/login") {
      // Check if user is already authenticated
      const adminToken = request.cookies.get("adminToken")?.value;
      const authHeader = request.headers.get("authorization");
      const bearerToken = authHeader?.startsWith("Bearer ")
        ? authHeader.substring(7)
        : null;

      const token = adminToken || bearerToken;

      // If authenticated and token exists, redirect to dashboard
      if (token && token.trim() !== "") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      // Allow access to login page
      return NextResponse.next();
    }

    // For /admin root path, redirect to login
    if (pathname === "/admin") {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    // For all other admin routes, check authentication
    const adminToken = request.cookies.get("adminToken")?.value;
    const authHeader = request.headers.get("authorization");
    const bearerToken = authHeader?.startsWith("Bearer ")
      ? authHeader.substring(7)
      : null;

    const token = adminToken || bearerToken;

    // If not authenticated or token is empty, redirect to login
    if (!token || token.trim() === "") {
      // Store the original URL to redirect back after login
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("returnUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Allow access to protected admin routes
    return NextResponse.next();
  }

  // Allow access to all non-admin routes
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
