import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: foods, error } = await supabaseServer
      .from('foods')
      .select('*');

    if (!error && foods && foods.length > 0) {
      return NextResponse.json({ success: true, foods, source: 'supabase' });
    }
  } catch (err: any) {
    console.warn('API /api/foods fallback:', err.message);
  }

  return NextResponse.json({ success: true, foods: QUANGTRI_DATA.foods, source: 'local' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error } = await supabaseServer.from('foods').upsert(body);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Food saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
