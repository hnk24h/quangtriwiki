import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, serviceName, action } = body;

    if (!serviceId || !action) {
      return NextResponse.json({ error: 'Missing serviceId or action' }, { status: 400 });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const { data, error } = await supabaseServer.from('leads').insert({
      service_id: serviceId,
      service_name: serviceName || serviceId,
      action: action as 'call' | 'zalo',
      user_ip: ip,
      user_agent: userAgent,
    }).select('id').single();

    if (error) {
      console.error('Supabase lead error:', error);
      return NextResponse.json({ success: true, leadId: `local-${Date.now()}` });
    }

    return NextResponse.json({ success: true, leadId: data?.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
