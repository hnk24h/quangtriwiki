import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { getFoods } from '@/lib/get-data';
import { formatSupabaseWriteError, normalizeFood, parseStringArray } from '@/lib/normalize';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const foods = await getFoods();
  return NextResponse.json({ success: true, foods });
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const body = await req.json();
    const id = String(body.id || '').trim() || `food-${Date.now()}`;
    const name = String(body.name || '').trim();
    if (!name) {
      return NextResponse.json({ success: false, error: 'Tên món ăn là bắt buộc.' }, { status: 400 });
    }

    const basePayload = {
      id,
      name,
      origin: String(body.origin || 'Quảng Trị').trim(),
      type: String(body.type || 'Món mặn truyền thống').trim(),
      price_range: String(body.price_range || body.priceRange || 'Bình dân').trim(),
      description: String(body.description || '').trim(),
      image:
        String(body.image || '').trim() ||
        'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80',
      address_recs: parseStringArray(body.address_recs ?? body.addressRecs ?? body.addressRec),
    };

    const fullPayload = {
      ...basePayload,
      taste_notes: body.taste_notes || body.tasteNotes ? String(body.taste_notes || body.tasteNotes).trim() : null,
      highlights: parseStringArray(body.highlights),
    };

    let res = await supabaseServer.from('foods').upsert(fullPayload).select('*').single();

    // Gracefully retry without new v2 columns if migration_v2.sql has not been applied yet
    if (res.error && String(res.error.message || '').toLowerCase().includes('column')) {
      res = await supabaseServer.from('foods').upsert(basePayload).select('*').single();
    }

    if (res.error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(res.error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/am-thuc');

    return NextResponse.json({
      success: true,
      food: normalizeFood(res.data || fullPayload),
      message: 'Đã lưu món ăn vào Database!',
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
    const { error } = await supabaseServer.from('foods').delete().eq('id', id);
    if (error) {
      return NextResponse.json(
        { success: false, error: formatSupabaseWriteError(error) },
        { status: 400 }
      );
    }

    revalidatePath('/');
    revalidatePath('/am-thuc');
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
