import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // If user is authenticated and tries to access root, redirect to reading-list
    if (req.nextauth.token && req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/reading-list", req.url));
    }

    // For all other protected routes, redirect to login if not authenticated
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  },
  {
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/((?!$|login|api/auth|_next/static|_next/image|favicon.ico).*)", // Add back $ to exclude root path from protection
  ],
};
