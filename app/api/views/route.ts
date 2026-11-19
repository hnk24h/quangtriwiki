import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayISO = today.toISOString();

    const [totalRes, todayRes] = await Promise.all([
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }),
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayISO),
    ]);

    const totalViews = totalRes.count || 0;
    const todayViews = todayRes.count || 0;

    return NextResponse.json({
      success: true,
      totalViews,
      todayViews,
      databaseConnected: !totalRes.error,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      totalViews: 0,
      todayViews: 0,
      error: err.message,
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (e) {
      // empty body is fine
    }

    const path = body.path || '/';
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Insert record into Supabase page_views table
    const { error: insertError } = await supabaseServer.from('page_views').insert({
      path,
      ip,
      user_agent: userAgent,
    });

    if (insertError) {
      console.warn('Supabase page_views insert notice:', insertError.message);
    }

    // Get current total count from database
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayISO = today.toISOString();

    const [totalRes, todayRes] = await Promise.all([
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }),
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayISO),
    ]);

    const totalViews = totalRes.count || 0;
    const todayViews = todayRes.count || 0;

    return NextResponse.json({
      success: true,
      totalViews,
      todayViews,
      savedToDatabase: !insertError,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      totalViews: 0,
      todayViews: 0,
      error: err.message,
    });
  }
}
