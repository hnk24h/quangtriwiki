import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { formatSupabaseWriteError, normalizeServiceType } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const { data, error } = await supabaseServer
      .from('partner_registrations')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, registrations: data || [] });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const businessName = String(body.business_name || body.businessName || '').trim();
    const serviceType = normalizeServiceType(body.service_type || body.serviceType);
    const zoneCode = String(body.zone_code || body.zoneCode || 'QT-01').trim();
    const contactName = String(body.contact_name || body.contactName || businessName).trim();
    const phone = String(body.phone || '').trim();
    const zalo = body.zalo ? String(body.zalo).trim() : phone;
    const address = String(body.address || '').trim();
    const priceRange = body.price_range || body.priceRange ? String(body.price_range || body.priceRange).trim() : null;
    const notes = body.notes ? String(body.notes).trim() : null;

    if (businessName.length < 2 || phone.length < 8 || address.length < 4) {
      return NextResponse.json(
        { success: false, error: 'Vui lòng điền đầy đủ Tên cơ sở, Số điện thoại và Địa chỉ.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('partner_registrations')
      .insert({
        business_name: businessName,
        service_type: serviceType,
        zone_code: zoneCode,
        contact_name: contactName,
        phone,
        zalo,
        address,
        price_range: priceRange,
        notes,
        status: 'pending',
      })
      .select('id, business_name, status, created_at')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      registration: data,
      message: 'Đã gửi hồ sơ đăng ký đối tác thành công!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const id = String(body.id || '').trim();
    const status = String(body.status || '').trim();

    if (!id || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Trạng thái hoặc ID hồ sơ không hợp lệ.' },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from('partner_registrations')
      .update({ status })
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, registration: data });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
