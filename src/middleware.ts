import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_TOKEN_COOKIE } from '@/lib/constants';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authToken = request.cookies.get(AUTH_TOKEN_COOKIE)?.value;

  const isAuthPage = pathname === '/login';

  if (!authToken && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (authToken && isAuthPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
