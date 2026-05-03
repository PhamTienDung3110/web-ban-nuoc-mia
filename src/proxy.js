import { NextResponse } from 'next/server';
import { verifyToken } from '@/utils/auth';

export async function proxy(request) {
  const token = request.cookies.get('auth_token')?.value;
  const isLoginPage = request.nextUrl.pathname === '/login';

  let payload = null;
  if (token) {
    payload = await verifyToken(token);
  }

  if (!payload && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (payload && isLoginPage) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Admin only routes
  if (payload && request.nextUrl.pathname.startsWith('/admin') && payload.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
