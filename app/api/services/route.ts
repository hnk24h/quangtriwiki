import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const { data: services, error } = await supabaseServer
      .from('services')
      .select('*')
      .order('rating', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, services });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
