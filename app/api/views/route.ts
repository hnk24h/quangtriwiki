import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

const BASELINE_TOTAL_VIEWS = 18240;
const BASELINE_TODAY_VIEWS = 1280;

export async function GET() {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayISO = today.toISOString();

    const [totalRes, todayRes] = await Promise.all([
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }),
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayISO),
    ]);

    const dbTotal = totalRes.count || 0;
    const dbToday = todayRes.count || 0;

    return NextResponse.json({
      success: true,
      totalViews: BASELINE_TOTAL_VIEWS + dbTotal,
      todayViews: BASELINE_TODAY_VIEWS + dbToday,
      dbRecordsCount: dbTotal,
      databaseConnected: !totalRes.error,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      totalViews: BASELINE_TOTAL_VIEWS,
      todayViews: BASELINE_TODAY_VIEWS,
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
      console.warn('Supabase page_views insert warning (table might need creation):', insertError.message);
    }

    // Get current total count
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const startOfTodayISO = today.toISOString();

    const [totalRes, todayRes] = await Promise.all([
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }),
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayISO),
    ]);

    const dbTotal = totalRes.count || 0;
    const dbToday = todayRes.count || 0;

    return NextResponse.json({
      success: true,
      totalViews: BASELINE_TOTAL_VIEWS + dbTotal,
      todayViews: BASELINE_TODAY_VIEWS + dbToday,
      savedToDatabase: !insertError,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: true,
      totalViews: BASELINE_TOTAL_VIEWS,
      todayViews: BASELINE_TODAY_VIEWS,
      error: err.message,
    });
  }
}
