import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ดึง token จาก request
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

  // หากผู้ใช้พยายามเข้าถึง root ('/')
  if (pathname === '/') {
    return NextResponse.redirect(new URL(token ? '/dashboard/analytics' : '/auth/login', request.url));
  } 

  // ป้องกันผู้ใช้ที่เข้าสู่ระบบแล้วไม่ให้เข้าถึงหน้า login
  if (pathname.startsWith('/auth/login') && token) {
    return NextResponse.redirect(new URL('/dashboard/analytics', request.url));
  }

  // หากผู้ใช้ยังไม่ได้เข้าสู่ระบบและพยายามเข้าถึงหน้า dashboard
  if (!token && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Pathที่ middleware จะทำงาน
export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/login'],
};
