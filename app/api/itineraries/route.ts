import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getItineraries } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeItinerary, parseStringArray } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const itineraries = await getItineraries();
  return NextResponse.json({ success: true, itineraries });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const id = String(body.id || '').trim() || `it-${Date.now()}`;
    const title = String(body.title || '').trim();
    if (!title) {
      return NextResponse.json({ success: false, error: 'Tên lộ trình là bắt buộc.' }, { status: 400 });
    }

    const rawStops = Array.isArray(body.steps)
      ? body.steps
      : Array.isArray(body.stops)
      ? body.stops
      : [];

    const payload = {
      id,
      title,
      duration: String(body.duration || '2 Ngày 1 Đêm').trim(),
      suitability: String(body.suitability || 'Phượt thủ & Gia đình').trim(),
      distance: String(body.distance || 'Linh hoạt').trim(),
      description: String(body.description || '').trim(),
      highlights: parseStringArray(body.highlights),
      stops: rawStops,
    };

    const { data, error } = await supabaseServer
      .from('itineraries')
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
    revalidatePath('/lich-trinh');
    revalidatePath('/so-tay');

    return NextResponse.json({
      success: true,
      itinerary: normalizeItinerary(data || payload),
      message: 'Đã lưu lộ trình vào Database!',
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
    const { error } = await supabaseServer.from('itineraries').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/lich-trinh');
    revalidatePath('/so-tay');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
