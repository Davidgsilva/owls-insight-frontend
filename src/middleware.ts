import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Routes that require authentication
const protectedRoutes = ["/dashboard"];

// Routes that should redirect to dashboard if already logged in
// Note: /register is intentionally excluded — a stale token cookie would cause
// /register → /dashboard → /login redirect chain, breaking "Start Free Trial" buttons
const authRoutes = ["/login"];

const ALLOWED_ORIGINS = new Set([
  'https://owlsinsight.com',
  'https://www.owlsinsight.com',
  'http://localhost:3000',
]);

/** Derive the public origin from headers, validated against allowlist */
function getOrigin(request: NextRequest): string {
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host');
  // Default to http for local dev hosts, https for production
  const proto = request.headers.get('x-forwarded-proto')
    || (host?.match(/^(localhost|0\.0\.0\.0)(:|$)/) ? 'http' : 'https');
  if (host) {
    const candidate = `${proto}://${host}`;
    if (ALLOWED_ORIGINS.has(candidate)) {
      return candidate;
    }
  }
  return 'https://owlsinsight.com';
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;

  // Check if the route requires authentication
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Check if it's an auth route (login only)
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const origin = getOrigin(request);
    const loginUrl = new URL("/login", origin);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to dashboard if accessing auth routes with valid token
  if (isAuthRoute && token) {
    const origin = getOrigin(request);
    return NextResponse.redirect(new URL("/dashboard", origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
