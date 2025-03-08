import { NextResponse } from 'next/server';

export function middleware(request) {
  const authToken = request.cookies.get('authToken') || localStorage.getItem('authToken');

  // Check if user is trying to access dashboard without auth
  if (!authToken && request.nextUrl.pathname.startsWith('/series')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/series/:path*'
};