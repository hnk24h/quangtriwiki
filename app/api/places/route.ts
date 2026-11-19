import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getPlaces } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizePlace, parseStringArray } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const places = await getPlaces();
  return NextResponse.json({ success: true, places });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const id = String(body.id || '').trim() || `place-${Date.now()}`;
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Tên điểm đến là bắt buộc.' }, { status: 400 });
    }

    const heroImage =
      String(body.hero_image || body.image || '').trim() ||
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
    const galleryInput = parseStringArray(body.gallery);

    const payload = {
      id,
      name,
      zone_code: String(body.zone_code || body.zoneCode || 'QT-01').trim(),
      zone_name: String(body.zone_name || body.zoneName || 'Quảng Trị').trim(),
      category: String(body.category || 'history').trim(),
      category_name: String(body.category_name || body.categoryName || 'Di tích lịch sử').trim(),
      rating: Number(body.rating) || 4.8,
      rating_count: Number(body.rating_count ?? body.reviewsCount) || 100,
      hero_image: heroImage,
      gallery: galleryInput.length > 0 ? galleryInput : [heroImage],
      short_desc: String(body.short_desc || body.shortDesc || '').trim(),
      history: String(body.history || body.fullDesc || body.short_desc || body.shortDesc || '').trim(),
      highlights: parseStringArray(body.highlights),
      coordinates: String(body.coordinates || '16.7533° N, 107.1912° E').trim(),
      address: String(body.address || 'Tỉnh Quảng Trị').trim(),
      open_time: String(body.open_time || body.openHours || 'Mở cửa cả ngày').trim(),
      ticket_price: String(body.ticket_price || body.ticket || 'Miễn phí').trim(),
      tips: body.tips ? String(body.tips).trim() : null,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('places')
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
    revalidatePath('/cung-duong');
    revalidatePath('/so-tay');
    revalidatePath(`/diem-den/${id}`);

    return NextResponse.json({
      success: true,
      place: normalizePlace(data || payload),
      message: 'Đã lưu điểm đến vào Database!',
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
    const { error } = await supabaseServer.from('places').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/cung-duong');
    revalidatePath('/so-tay');
    revalidatePath(`/diem-den/${id}`);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
