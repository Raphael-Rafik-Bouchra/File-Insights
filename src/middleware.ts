import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = ['/', '/login', '/signup'];
  
  // Check if it's a public path
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }
  
  // For protected routes, check auth token from cookies or header
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.split(' ')[1];
  const cookieToken = request.cookies.get('token')?.value;
  const token = headerToken || cookieToken;

  // If no token and trying to access protected route, redirect to login
  if (!token && (path.startsWith('/dashboard') || path.startsWith('/admin'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/login',
    '/dashboard/:path*',
    '/admin/:path*'
  ]
};
