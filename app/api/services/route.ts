import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getServices } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeService, normalizeServiceType } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const services = await getServices();
  return NextResponse.json({ success: true, services });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const id = String(body.id || '').trim() || `srv-${Date.now()}`;
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Tên dịch vụ là bắt buộc.' }, { status: 400 });
    }

    const type = normalizeServiceType(body.type || body.category);
    const phone = String(body.hotline || body.phone || '').trim();

    const payload = {
      id,
      name,
      type,
      type_label: String(body.type_label || body.typeLabel || body.categoryName || 'Dịch vụ').trim(),
      zone_code: String(body.zone_code || body.zoneCode || 'QT-01').trim(),
      zone_name: String(body.zone_name || body.zoneName || 'Quảng Trị').trim(),
      price: String(body.price || 'Liên hệ').trim(),
      rating: Number(body.rating) || 4.9,
      reviews: Number(body.reviews ?? body.reviewsCount) || 45,
      address: String(body.address || 'Tỉnh Quảng Trị').trim(),
      hotline: phone,
      zalo: String(body.zalo || phone).trim(),
      image:
        String(body.image || '').trim() ||
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      is_verified: Boolean(body.is_verified ?? body.verified ?? true),
      affiliate_url: body.affiliate_url ? String(body.affiliate_url).trim() : null,
      description: body.description ? String(body.description).trim() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('services')
      .upsert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/dich-vu');

    return NextResponse.json({
      success: true,
      service: normalizeService(data || payload),
      message: 'Đã lưu dịch vụ đối tác vào Database!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ success: false, error: 'Thiếu tham số id.' }, { status: 400 });
  }

  try {
    const { error } = await supabaseServer.from('services').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/dich-vu');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
