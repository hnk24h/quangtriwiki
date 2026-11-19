import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: places, error } = await supabaseServer
      .from('places')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && places && places.length > 0) {
      return NextResponse.json({ success: true, places, source: 'supabase' });
    }
  } catch (err: any) {
    console.warn('API /api/places fallback:', err.message);
  }

  return NextResponse.json({ success: true, places: QUANGTRI_DATA.places, source: 'local' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error } = await supabaseServer.from('places').upsert(body);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Place saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
