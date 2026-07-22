import { NextResponse } from "next/server";
import withAuth from "next-auth/middleware";

const AUTH_PAGES = ["/login", "/register"];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isLoggedIn = !!req.nextauth.token;
    const isAuthPage = AUTH_PAGES.some((page) => pathname.startsWith(page));

    if (isLoggedIn && isAuthPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const { pathname } = req.nextUrl;
        if (AUTH_PAGES.some((page) => pathname.startsWith(page))) {
          return true;
        }
        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
