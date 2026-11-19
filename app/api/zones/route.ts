import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getZones } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeZone } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const zones = await getZones();
  return NextResponse.json({ success: true, zones });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const code = String(body.code || '').trim().toUpperCase();
    const name = String(body.name || '').trim();

    if (!code || !name) {
      return NextResponse.json(
        { success: false, error: 'Mã khu vực (QT-01...) và Tên khu vực là bắt buộc.' },
        { status: 400 }
      );
    }

    const slug = String(body.slug || code.toLowerCase()).trim();
    const rawGroup = String(body.typeGroup || body.type_group || 'history').trim();
    const typeGroup = ['history', 'mountain', 'coastal'].includes(rawGroup)
      ? rawGroup
      : 'history';

    const parseCoord = (value: unknown, min: number, max: number): number | null => {
      if (value === null || value === undefined || value === '') return null;
      const num = Number(value);
      return Number.isFinite(num) && num >= min && num <= max ? num : null;
    };
    const lat = parseCoord(body.lat, -90, 90);
    const lon = parseCoord(body.lon, -180, 180);

    const showInWeather =
      typeof body.showInWeather === 'boolean'
        ? body.showInWeather
        : typeof body.show_in_weather === 'boolean'
        ? body.show_in_weather
        : true;

    const basePayload = {
      code,
      name,
      slug,
      tagline: String(body.tagline || '').trim(),
      hero_image:
        String(body.heroImage || body.hero_image || '').trim() ||
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
      description: String(body.description || body.desc || '').trim(),
    };

    const fullPayload = {
      ...basePayload,
      featured_count: String(body.featuredCount || body.featured_count || '').trim() || null,
      specialty: String(body.specialty || '').trim() || null,
      type_tag: String(body.typeTag || body.type_tag || '').trim() || null,
      type_group: typeGroup,
      lat,
      lon,
      show_in_weather: showInWeather,
      weather_region_label:
        String(body.weatherRegionLabel || body.weather_region_label || '').trim() || null,
    };

    let res = await supabaseServer
      .from('zones')
      .upsert(fullPayload, { onConflict: 'code' })
      .select('*')
      .single();

    if (res.error && String(res.error.message || '').toLowerCase().includes('column')) {
      res = await supabaseServer
        .from('zones')
        .upsert(basePayload, { onConflict: 'code' })
        .select('*')
        .single();
    }

    if (res.error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(res.error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/cung-duong');

    return NextResponse.json({
      success: true,
      zone: normalizeZone(res.data || fullPayload),
      message: `Đã lưu khu vực ${code} vào Database!`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const code = String(req.nextUrl.searchParams.get('code') || '').trim().toUpperCase();
  if (!code) {
    return NextResponse.json(
      { success: false, error: 'Thiếu tham số code khu vực.' },
      { status: 400 }
    );
  }

  try {
    const { error } = await supabaseServer.from('zones').delete().eq('code', code);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/cung-duong');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
