import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // If authenticated and accessing "/" or "/login", redirect to "/reading-list"
  if (token) {
    if (pathname === "/" || pathname === "/login") {
      return NextResponse.redirect(new URL("/reading-list", req.url));
    }
    return NextResponse.next();
  }

  // If not authenticated, allow only "/" and "/login"
  if (!token) {
    if (pathname !== "/" && pathname !== "/login") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Run on all paths except static assets and api routes
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
