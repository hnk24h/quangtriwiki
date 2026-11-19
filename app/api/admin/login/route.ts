import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  createAdminSessionToken,
  isUsingDefaultAdminPassword,
  validateAdminCredentials,
} from '@/lib/admin-auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!validateAdminCredentials(email, password)) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(email);
    const res = NextResponse.json({
      success: true,
      email,
      usingDefaultPassword: isUsingDefaultAdminPassword(),
    });

    res.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return res;
  } catch {
    return NextResponse.json(
      { success: false, error: 'Dữ liệu đăng nhập không hợp lệ.' },
      { status: 400 }
    );
  }
}
