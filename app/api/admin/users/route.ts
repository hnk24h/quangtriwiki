import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession, hashPassword, requireAdmin } from '@/lib/admin-auth';
import { formatSupabaseWriteError } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';
import type { UserRole, UserStatus } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

const VALID_ROLES: UserRole[] = ['admin', 'editor', 'user'];
const VALID_STATUSES: UserStatus[] = ['active', 'inactive'];

const SAFE_USER_COLS =
  'id, name, email, role, status, phone, avatar, note, last_login_at, created_at, updated_at';

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const roleFilter = req.nextUrl.searchParams.get('role') || 'all';
    const q = (req.nextUrl.searchParams.get('q') || '').trim().toLowerCase();

    const { data, error } = await supabaseServer
      .from('users')
      .select(SAFE_USER_COLS)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    const allUsers = data || [];
    const filtered = allUsers.filter((u) => {
      const matchRole =
        roleFilter === 'all' ||
        (roleFilter === 'cms' ? u.role === 'admin' || u.role === 'editor' : u.role === roleFilter);
      const matchSearch =
        !q ||
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        (u.phone || '').toLowerCase().includes(q);
      return matchRole && matchSearch;
    });

    const stats = {
      total: allUsers.length,
      cmsUsers: allUsers.filter((u) => u.role === 'admin' || u.role === 'editor').length,
      webUsers: allUsers.filter((u) => u.role === 'user').length,
      active: allUsers.filter((u) => u.status === 'active').length,
    };

    return NextResponse.json({ success: true, users: filtered, stats });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const session = await getAdminSession(req);
  if (session?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Chỉ Quản trị viên (Admin) mới có quyền tạo tài khoản.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = String(body?.password || '');
    const role = (VALID_ROLES.includes(body?.role) ? body.role : 'user') as UserRole;
    const status = (VALID_STATUSES.includes(body?.status) ? body.status : 'active') as UserStatus;
    const phone = body?.phone ? String(body.phone).trim() : null;
    const avatar = body?.avatar ? String(body.avatar).trim() : null;
    const note = body?.note ? String(body.note).trim() : null;

    if (!name || !email) {
      return NextResponse.json(
        { success: false, error: 'Họ tên và Email là bắt buộc.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng email không hợp lệ.' },
        { status: 400 }
      );
    }
    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự.' },
        { status: 400 }
      );
    }

    const id = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const payload = {
      id,
      name,
      email,
      password_hash: hashPassword(password),
      role,
      status,
      phone,
      avatar,
      note,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('users')
      .insert(payload)
      .select(SAFE_USER_COLS)
      .single();

    if (error) {
      const msg = error.code === '23505' ? 'Email này đã tồn tại trong hệ thống.' : formatSupabaseWriteError(error);
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data,
      message: 'Đã tạo tài khoản người dùng mới!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const session = await getAdminSession(req);
  if (session?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Chỉ Quản trị viên (Admin) mới có quyền chỉnh sửa tài khoản.' },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const id = String(body?.id || '').trim();
    const name = String(body?.name || '').trim();
    const email = String(body?.email || '').trim().toLowerCase();
    const password = typeof body?.password === 'string' ? body.password : '';
    const role = (VALID_ROLES.includes(body?.role) ? body.role : 'user') as UserRole;
    const status = (VALID_STATUSES.includes(body?.status) ? body.status : 'active') as UserStatus;

    if (!id || !name || !email) {
      return NextResponse.json(
        { success: false, error: 'Thiếu ID, họ tên hoặc email.' },
        { status: 400 }
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Định dạng email không hợp lệ.' },
        { status: 400 }
      );
    }
    if (password && password.length < 6) {
      return NextResponse.json(
        { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự.' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, any> = {
      name,
      email,
      role,
      status,
      phone: body?.phone ? String(body.phone).trim() : null,
      avatar: body?.avatar ? String(body.avatar).trim() : null,
      note: body?.note ? String(body.note).trim() : null,
      updated_at: new Date().toISOString(),
    };

    if (password) {
      updatePayload.password_hash = hashPassword(password);
    }

    const { data, error } = await supabaseServer
      .from('users')
      .update(updatePayload)
      .eq('id', id)
      .select(SAFE_USER_COLS)
      .single();

    if (error) {
      const msg = error.code === '23505' ? 'Email này đã được sử dụng.' : formatSupabaseWriteError(error);
      return NextResponse.json({ success: false, error: msg }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      user: data,
      message: 'Đã cập nhật thông tin người dùng!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const session = await getAdminSession(req);
  if (session?.role !== 'admin') {
    return NextResponse.json(
      { success: false, error: 'Chỉ Quản trị viên (Admin) mới có quyền xóa tài khoản.' },
      { status: 403 }
    );
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Thiếu tham số id.' }, { status: 400 });
  }

  try {
    const { data: target } = await supabaseServer
      .from('users')
      .select('email')
      .eq('id', id)
      .maybeSingle();

    if (target?.email && target.email.toLowerCase() === session.email.toLowerCase()) {
      return NextResponse.json(
        { success: false, error: 'Không thể xóa tài khoản đang đăng nhập.' },
        { status: 400 }
      );
    }

    const { error } = await supabaseServer.from('users').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: 'Đã xóa tài khoản người dùng.' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
