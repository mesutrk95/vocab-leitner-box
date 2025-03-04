import { authConfig } from "@/auth/config";
import NextAuth from "next-auth";
import { DEFAULT_LOGIN_REDIRECT, apiAuthPrefix, authRoutes, publicRoutes } from "@/routes";
import { NextRequest, NextResponse } from "next/server";

export const { auth } = NextAuth(authConfig);

// Define a new type for middleware
export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  if (isApiAuthRoute) {
    return;
  }

  // Get session using the auth helper
  const session = await auth();
  const isLoggedIn = !!session;

  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isAuthRoute) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  return;
}


// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
