import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

function getVietnamStartOfTodayISO(): string {
  const vnNow = new Date(Date.now() + 7 * 3600 * 1000);
  const utcMidnight = Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate()) - 7 * 3600 * 1000;
  return new Date(utcMidnight).toISOString();
}

function detectDeviceType(userAgent: string): string {
  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/i.test(userAgent)) return 'Tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(userAgent)) return 'Mobile';
  return 'Desktop';
}

function safeDecodeHeader(val: string | null): string | null {
  if (!val) return null;
  try {
    return decodeURIComponent(val).trim();
  } catch {
    return val.trim();
  }
}

function extractRegion(req: NextRequest): string | null {
  const city = safeDecodeHeader(req.headers.get('x-vercel-ip-city'));
  const region = safeDecodeHeader(req.headers.get('x-vercel-ip-country-region'));
  const country = safeDecodeHeader(req.headers.get('x-vercel-ip-country'));

  if (city && country) return `${city}, ${country}`;
  if (city) return city;
  if (region && country) return `${region}, ${country}`;
  if (country) return country;
  return null;
}

async function fetchViewCounts() {
  const startOfTodayISO = getVietnamStartOfTodayISO();
  const [totalRes, todayRes] = await Promise.all([
    supabaseServer.from('page_views').select('id', { count: 'exact', head: true }),
    supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayISO),
  ]);
  return {
    totalViews: totalRes.count || 0,
    todayViews: todayRes.count || 0,
    databaseConnected: !totalRes.error,
  };
}

export async function GET() {
  try {
    const counts = await fetchViewCounts();
    return NextResponse.json({ success: true, ...counts });
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
    } catch {
      // empty body is fine
    }

    const path = String(body.path || '/').slice(0, 200);
    const userAgent = req.headers.get('user-agent') || 'unknown';
    const isBot = /(bot|crawler|spider|headless|lighthouse|facebookexternalhit|slackbot|preview)/i.test(userAgent);

    if (isBot) {
      const counts = await fetchViewCounts();
      return NextResponse.json({
        success: true,
        ...counts,
        savedToDatabase: false,
        ignoredBot: true,
      });
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const deviceType = detectDeviceType(userAgent);
    const region = extractRegion(req);

    let insertRes = await supabaseServer.from('page_views').insert({
      path,
      ip,
      user_agent: userAgent,
      region,
      device_type: deviceType,
    });

    // Retry without new columns if migration_v2.sql is not applied yet
    if (insertRes.error && String(insertRes.error.message || '').toLowerCase().includes('column')) {
      insertRes = await supabaseServer.from('page_views').insert({
        path,
        ip,
        user_agent: userAgent,
      });
    }

    const counts = await fetchViewCounts();
    return NextResponse.json({
      success: true,
      ...counts,
      savedToDatabase: !insertRes.error,
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
