import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  const cookie = request.cookies.get('token');

  const guardedRoutes = ['/dashboard', '/cluster', '/controller', '/user-management'];

  if (guardedRoutes.includes(pathname) && !cookie) {
    return NextResponse.redirect(`${origin}/`);
  }

  if (pathname === '/' && cookie) {
    return NextResponse.redirect(`${origin}/dashboard`);
  }

  return NextResponse.next();
}
