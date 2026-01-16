import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("access_token");
  const { pathname } = request.nextUrl;

  // 1. User is NOT authenticated
  if (!token) {
    // Allow access to public routes
    if (pathname === "/signin") {
      return NextResponse.next();
    }

    // Redirect all protected routes to /signin
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. User IS authenticated
  // Redirect from / or /signin to /drive
  if (pathname === "/" || pathname === "/signin") {
    return NextResponse.redirect(new URL("/drive", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/signin", "/drive/:path*", "/((?!_next|api|favicon.ico).*)"],
};
