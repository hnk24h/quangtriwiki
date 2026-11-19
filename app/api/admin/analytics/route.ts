import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseServer } from '@/lib/supabase/server';
import type { AnalyticsSummary } from '@/lib/supabase/types';

export const dynamic = 'force-dynamic';

function detectDevice(ua?: string | null, recorded?: string | null): string {
  if (recorded) return recorded;
  const s = ua || '';
  if (/ipad|tablet|playbook|silk|(android(?!.*mobi))/i.test(s)) return 'Tablet';
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile/i.test(s)) return 'Mobile';
  return 'Desktop';
}

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const now = Date.now();
    const vnNow = new Date(now + 7 * 3600 * 1000);
    const vnMidnightUtc =
      Date.UTC(vnNow.getUTCFullYear(), vnNow.getUTCMonth(), vnNow.getUTCDate()) - 7 * 3600 * 1000;

    const startOfTodayISO = new Date(vnMidnightUtc).toISOString();
    const startOf7DaysISO = new Date(now - 7 * 86400 * 1000).toISOString();
    const startOf14DaysISO = new Date(now - 14 * 86400 * 1000).toISOString();
    const startOf30DaysISO = new Date(now - 30 * 86400 * 1000).toISOString();

    const [totalRes, todayRes, last7Res, prev7Res] = await Promise.all([
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }),
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOfTodayISO),
      supabaseServer.from('page_views').select('id', { count: 'exact', head: true }).gte('created_at', startOf7DaysISO),
      supabaseServer
        .from('page_views')
        .select('id', { count: 'exact', head: true })
        .gte('created_at', startOf14DaysISO)
        .lt('created_at', startOf7DaysISO),
    ]);

    let rowsRes: { data: any[] | null; error: any } = await supabaseServer
      .from('page_views')
      .select('path, user_agent, created_at, region, device_type')
      .gte('created_at', startOf30DaysISO)
      .order('created_at', { ascending: false })
      .limit(5000);

    // Fallback if region/device_type columns not yet migrated
    if (rowsRes.error && String(rowsRes.error.message || '').toLowerCase().includes('column')) {
      rowsRes = await supabaseServer
        .from('page_views')
        .select('path, user_agent, created_at')
        .gte('created_at', startOf30DaysISO)
        .order('created_at', { ascending: false })
        .limit(5000);
    }

    const rows = rowsRes.data || [];
    const totalRows = rows.length;

    const hourBuckets = Array.from({ length: 24 }, (_, hour) => ({
      hour,
      label: `${String(hour).padStart(2, '0')}h`,
      count: 0,
    }));

    const pathCounts = new Map<string, number>();
    const deviceCounts = new Map<string, number>();
    const regionCounts = new Map<string, number>();

    for (const row of rows) {
      if (row.created_at) {
        const vnTime = new Date(new Date(row.created_at).getTime() + 7 * 3600 * 1000);
        const h = vnTime.getUTCHours();
        if (hourBuckets[h]) hourBuckets[h].count += 1;
      }

      const path = String(row.path || '/');
      pathCounts.set(path, (pathCounts.get(path) || 0) + 1);

      const dev = detectDevice(row.user_agent, row.device_type);
      deviceCounts.set(dev, (deviceCounts.get(dev) || 0) + 1);

      if (row.region && String(row.region).trim()) {
        const reg = String(row.region).trim();
        regionCounts.set(reg, (regionCounts.get(reg) || 0) + 1);
      }
    }

    // Peak hour calculation
    let peakHourIdx = 0;
    let peakHourCount = 0;
    for (const b of hourBuckets) {
      if (b.count > peakHourCount) {
        peakHourCount = b.count;
        peakHourIdx = b.hour;
      }
    }
    const peakHourRange =
      totalRows > 0
        ? `${String(peakHourIdx).padStart(2, '0')}:00 - ${String((peakHourIdx + 1) % 24).padStart(2, '0')}:00`
        : 'Chưa có dữ liệu';
    const peakHourSharePercent =
      totalRows > 0 ? Math.round((peakHourCount / totalRows) * 1000) / 10 : 0;

    const topPages = Array.from(pathCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([path, count]) => ({
        path,
        count,
        percent: totalRows > 0 ? Math.round((count / totalRows) * 1000) / 10 : 0,
      }));

    const deviceBreakdown = Array.from(deviceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([device, count]) => ({
        device,
        count,
        percent: totalRows > 0 ? Math.round((count / totalRows) * 1000) / 10 : 0,
      }));

    const totalRegionRows = Array.from(regionCounts.values()).reduce((sum, n) => sum + n, 0);
    const regionBreakdown = Array.from(regionCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([region, count]) => ({
        region,
        count,
        percent: totalRegionRows > 0 ? Math.round((count / totalRegionRows) * 1000) / 10 : 0,
      }));

    const last7 = last7Res.count || 0;
    const prev7 = prev7Res.count || 0;
    const growthPercent =
      prev7 > 0 ? Math.round(((last7 - prev7) / prev7) * 1000) / 10 : null;

    const analytics: AnalyticsSummary = {
      totalViews: totalRes.count || 0,
      todayViews: todayRes.count || 0,
      last7DaysViews: last7,
      prev7DaysViews: prev7,
      growthPercent,
      hourlyDistribution: hourBuckets,
      peakHourRange,
      peakHourSharePercent,
      topPages,
      deviceBreakdown,
      regionBreakdown,
    };

    return NextResponse.json({ success: true, analytics });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
