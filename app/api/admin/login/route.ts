import { NextRequest, NextResponse } from 'next/server';
import {
  COOKIE_NAME,
  createAdminSessionToken,
  isUsingDefaultAdminPassword,
  validateAdminCredentials,
  verifyPassword,
} from '@/lib/admin-auth';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng nhập đầy đủ email và mật khẩu.' },
        { status: 400 }
      );
    }

    let authedRole: 'admin' | 'editor' = 'admin';
    let authedName = 'Quản trị viên';
    let usedDefault = false;
    let authenticated = false;

    // 1. Check public.users in Supabase for CMS accounts (admin / editor)
    try {
      const { data: dbUser } = await supabaseServer
        .from('users')
        .select('id, name, email, password_hash, role, status')
        .eq('email', email)
        .maybeSingle();

      if (dbUser) {
        if (dbUser.status !== 'active') {
          return NextResponse.json(
            { success: false, error: 'Tài khoản này đang bị tạm khóa.' },
            { status: 403 }
          );
        }
        if (dbUser.role !== 'admin' && dbUser.role !== 'editor') {
          return NextResponse.json(
            { success: false, error: 'Tài khoản người dùng web không có quyền truy cập CMS.' },
            { status: 403 }
          );
        }
        if (verifyPassword(password, dbUser.password_hash)) {
          authenticated = true;
          authedRole = dbUser.role;
          authedName = dbUser.name || email;
          await supabaseServer
            .from('users')
            .update({ last_login_at: new Date().toISOString() })
            .eq('id', dbUser.id);
        }
      }
    } catch {
      // Fallback to env credentials if users table does not exist yet
    }

    // 2. Fallback to environment super-admin credentials
    if (!authenticated && validateAdminCredentials(email, password)) {
      authenticated = true;
      authedRole = 'admin';
      authedName = 'Super Admin';
      usedDefault = isUsingDefaultAdminPassword();
    }

    if (!authenticated) {
      return NextResponse.json(
        { success: false, error: 'Email hoặc mật khẩu không đúng.' },
        { status: 401 }
      );
    }

    const token = createAdminSessionToken(email, authedRole, authedName);
    const res = NextResponse.json({
      success: true,
      email,
      role: authedRole,
      name: authedName,
      usingDefaultPassword: usedDefault,
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
