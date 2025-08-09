import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get token from cookie or localStorage
  const token = request.cookies.get('token')?.value || request.headers.get('Authorization')?.split(' ')[1]
 
  // If no token and trying to access protected route, redirect to login
  if (!token && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
 
  return NextResponse.next()
}
