import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { formatSupabaseWriteError } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function mapRowToPoi(row: any) {
  return {
    id: String(row.id),
    name: String(row.name || ''),
    category: row.category || 'sightseeing',
    categoryLabel: String(row.category_label || row.categoryLabel || 'Cộng đồng ghim'),
    zoneCode: String(row.zone_code || row.zoneCode || 'QT-01'),
    zoneName: String(row.zone_name || row.zoneName || row.zone_code || 'Quảng Trị'),
    lat: Number(row.lat),
    lng: Number(row.lng),
    address: String(row.address || ''),
    priceOrHours: String(row.price_or_hours || row.priceOrHours || 'Cộng đồng cập nhật'),
    rating: 5.0,
    description: String(row.description || ''),
    image: row.image ? String(row.image) : undefined,
    contributor: row.contributor ? String(row.contributor) : 'Phượt thủ Quảng Trị',
    isUserPin: true,
  };
}

export async function GET() {
  try {
    const { data, error } = await supabaseServer
      .from('map_pins')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json({ success: true, pins: [], source: 'local-only' });
    }

    return NextResponse.json({
      success: true,
      pins: (data || []).map(mapRowToPoi),
      source: 'supabase',
    });
  } catch {
    return NextResponse.json({ success: true, pins: [], source: 'local-only' });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const name = String(body.name || '').trim();
    const lat = Number(body.lat);
    const lng = Number(body.lng);

    if (!name || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return NextResponse.json(
        { success: false, error: 'Tên địa điểm và tọa độ (lat, lng) hợp lệ là bắt buộc.' },
        { status: 400 }
      );
    }

    if (lat < 14 || lat > 20 || lng < 104 || lng > 110) {
      return NextResponse.json(
        { success: false, error: 'Tọa độ nằm ngoài khu vực Quảng Trị - Miền Trung.' },
        { status: 400 }
      );
    }

    const validCategories = new Set(['sightseeing', 'food', 'hotel', 'parking', 'fuel']);
    const category = validCategories.has(String(body.category)) ? String(body.category) : 'sightseeing';
    const id = String(body.id || `pin-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`);

    const payload = {
      id,
      name: name.slice(0, 120),
      category,
      category_label: String(body.categoryLabel || 'Cộng đồng ghim').slice(0, 80),
      zone_code: String(body.zoneCode || 'QT-01').trim().toUpperCase().slice(0, 12),
      zone_name: String(body.zoneName || 'Quảng Trị').slice(0, 100),
      lat,
      lng,
      address: String(body.address || `${lat.toFixed(4)}°N, ${lng.toFixed(4)}°E`).slice(0, 200),
      price_or_hours: String(body.priceOrHours || 'Cộng đồng cập nhật').slice(0, 100),
      description: String(body.description || '').slice(0, 600),
      image: body.image ? String(body.image).slice(0, 400) : null,
      contributor: String(body.contributor || 'Phượt thủ Quảng Trị').slice(0, 80),
    };

    const { data, error } = await supabaseServer
      .from('map_pins')
      .insert(payload)
      .select('*')
      .single();

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: formatSupabaseWriteError(error),
          pin: mapRowToPoi(payload),
        },
        { status: 202 }
      );
    }

    return NextResponse.json({
      success: true,
      pin: mapRowToPoi(data || payload),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Lỗi lưu ghim.' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const id = String(req.nextUrl.searchParams.get('id') || '').trim();
  if (!id) {
    return NextResponse.json({ success: false, error: 'Thiếu tham số id ghim.' }, { status: 400 });
  }

  try {
    const { error } = await supabaseServer.from('map_pins').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err?.message || 'Lỗi xóa ghim.' }, { status: 500 });
  }
}
