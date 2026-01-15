import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token");

  const { pathname } = request.nextUrl;

  if (!token) {
    // allow access to signin page
    if (pathname.startsWith("/signin")) {
      return NextResponse.next();
    }

    // redirect all other routes to /signin
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  // 2. If user IS authenticated
  // prevent access to signin page
  if (pathname.startsWith("/signin")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/signin", "/((?!_next|api|favicon.ico).*)"],
};
