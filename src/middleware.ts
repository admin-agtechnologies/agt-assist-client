import { NextRequest, NextResponse } from "next/server";

const PUBLIC = ["/login"];
const PME_PREFIX = "/pme";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const auth = request.cookies.get("agt_auth")?.value;

  // Déjà connecté sur /login → dashboard PME
  if (PUBLIC.some(p => pathname.startsWith(p))) {
    if (auth) {
      return NextResponse.redirect(new URL("/pme/dashboard", request.url));
    }
    return NextResponse.next();
  }

  // Routes protégées sans token → login
  if (pathname.startsWith(PME_PREFIX) && !auth) {
    return NextResponse.redirect(new URL(`/login?redirect=${pathname}`, request.url));
  }

  // Bloquer tout accès admin depuis cette app
  if (pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/pme/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = { matcher: ["/login", "/pme/:path*", "/admin/:path*"] };
