import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { supabaseServer } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  try {
    const [leadsRes, regRes, threadsRes, servicesRes] = await Promise.all([
      supabaseServer.from('leads').select('id', { count: 'exact', head: true }),
      supabaseServer.from('partner_registrations').select('id', { count: 'exact', head: true }),
      supabaseServer.from('threads').select('id', { count: 'exact', head: true }),
      supabaseServer.from('services').select('id', { count: 'exact', head: true }),
    ]);

    const totalLeads = leadsRes.count || 0;
    const totalRegistrations = regRes.count || 0;
    const totalThreads = threadsRes.count || 0;
    const totalPartners = servicesRes.count || 0;

    const estRevenue = totalRegistrations * 500000 + totalLeads * 15000;

    return NextResponse.json({
      success: true,
      metrics: {
        totalLeads,
        totalRegistrations,
        totalThreads,
        totalPartners,
        estimatedRevenue: `${estRevenue.toLocaleString('vi-VN')} VNĐ`,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
