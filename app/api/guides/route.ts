import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getGuides } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeGuides } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const guides = await getGuides();
  return NextResponse.json({ success: true, guides });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const current = await getGuides();

    const payload = {
      id: 'main',
      best_time_to_visit: body.bestTimeToVisit ?? body.best_time_to_visit ?? current.bestTimeToVisit ?? [],
      packing_checklist: body.packingChecklist ?? body.packing_checklist ?? current.packingChecklist ?? [],
      emergency_hotlines: body.emergencyHotlines ?? body.emergency_hotlines ?? current.emergencyHotlines ?? [],
      gas_stations: body.gasStations ?? body.gas_stations ?? current.gasStations ?? [],
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseServer
      .from('guides')
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
    revalidatePath('/tien-ich');
    revalidatePath('/so-tay');

    return NextResponse.json({
      success: true,
      guides: normalizeGuides(data || payload),
      message: 'Đã lưu dữ liệu Cứu hộ & Cẩm nang vào Database!',
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
