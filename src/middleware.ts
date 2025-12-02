import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getAuth } from './lib/auth';
 
export async function middleware(request: NextRequest) {
  const user = await getAuth();
  const { pathname } = request.nextUrl
 
  // Allow requests for static files and Next.js internals
  if (pathname.startsWith('/_next/') || pathname.startsWith('/api/') || pathname.startsWith('/static/')) {
    return NextResponse.next()
  }

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
 
  if (isAuthPage) {
    if (user) {
      // If the user is authenticated, redirect them from login/register to the home page.
      return NextResponse.redirect(new URL('/', request.url))
    }
    // If not authenticated, allow them to see the login/register page.
    return NextResponse.next();
  }
 
  if (!user) {
     // If the user is not authenticated and not on an auth page, redirect them to login.
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    if (user.role !== 'admin') {
      // If user is not an admin, redirect them to the home page
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next()
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
