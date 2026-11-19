import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: itineraries, error } = await supabaseServer
      .from('itineraries')
      .select('*');

    if (!error && itineraries && itineraries.length > 0) {
      return NextResponse.json({ success: true, itineraries, source: 'supabase' });
    }
  } catch (err: any) {
    console.warn('API /api/itineraries fallback:', err.message);
  }

  return NextResponse.json({ success: true, itineraries: QUANGTRI_DATA.itineraries, source: 'local' });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { error } = await supabaseServer.from('itineraries').upsert(body);

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Itinerary saved successfully' });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
