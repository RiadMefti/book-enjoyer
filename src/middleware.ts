import { NextResponse } from "next/server";
import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Redirect authenticated users from root to reading-list
    if (req.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/reading-list", req.url));
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
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)", // Remove $ to include root path
  ],
};
