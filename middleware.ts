import { NextResponse, type NextRequest } from 'next/server';

const ADMIN_SESSION_COOKIE = 'crafting_corner_admin_session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === '/admin') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin/')) {
    const hasSession = Boolean(request.cookies.get(ADMIN_SESSION_COOKIE)?.value);
    if (!hasSession) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
