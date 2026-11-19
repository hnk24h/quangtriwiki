import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getBannerSlides } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeBannerSlide } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const banners = await getBannerSlides();
  return NextResponse.json({ success: true, banners });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const id = String(body.id || '').trim() || `slide-${Date.now()}`;
    const title = String(body.title || '').trim();
    const image = String(body.image || body.img || '').trim();

    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: 'Tiêu đề và URL ảnh nền là bắt buộc.' },
        { status: 400 }
      );
    }

    const payload = {
      id,
      badge: String(body.badge || body.kicker || '').trim(),
      title,
      subtitle: String(body.subtitle || body.caption || '').trim(),
      image,
      zone_code: body.zoneCode || body.zone_code || null,
      stats_tag: body.statsTag || body.stats_tag || null,
      sort_order: Number(body.sortOrder ?? body.sort_order ?? 0),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('banner_slides')
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
    return NextResponse.json({
      success: true,
      banner: normalizeBannerSlide(data || payload),
      message: 'Đã lưu slide banner vào Database!',
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
    const { error } = await supabaseServer.from('banner_slides').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
