import { Metadata } from 'next';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';

export const metadata: Metadata = {
  title: 'Bảng Điều Khiển Quản Trị & Doanh Thu · QuangTri.wiki',
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminDashboardPage() {
  const [leadsRes, regRes, threadsRes, servicesRes, recentLeads] = await Promise.all([
    supabaseServer.from('leads').select('id', { count: 'exact', head: true }),
    supabaseServer.from('partner_registrations').select('id', { count: 'exact', head: true }),
    supabaseServer.from('threads').select('id', { count: 'exact', head: true }),
    supabaseServer.from('services').select('id', { count: 'exact', head: true }),
    supabaseServer.from('leads').select('*').order('created_at', { ascending: false }).limit(10),
  ]);

  const totalLeads = leadsRes.count || 0;
  const totalRegistrations = regRes.count || 0;
  const totalThreads = threadsRes.count || 0;
  const totalPartners = servicesRes.count || 0;
  const estRevenue = totalRegistrations * 500000 + totalLeads * 15000;

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <header style={{
        padding: '1.2rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(27,42,34,0.08)',
        backgroundColor: 'rgba(247, 244, 238, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#133e2f', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>←</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.2rem' }}>QuangTri.wiki</span>
        </Link>
        <span style={{ fontSize: '0.85rem', color: '#dc2626', fontWeight: 600 }}>
          🔒 Trung Tâm Quản Trị & Doanh Thu Đối Tác
        </span>
      </header>

      <main style={{ maxWidth: '1100px', margin: '3rem auto', padding: '0 1.5rem' }}>
        <div style={{ marginBottom: '2.5rem' }}>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.4rem', color: '#133e2f', margin: '0 0 0.5rem 0' }}>
            Báo Cáo Hoạt Động & Doanh Thu Thời Gian Thực
          </h1>
          <p style={{ color: '#4b5563', margin: 0 }}>
            Dữ liệu đồng bộ trực tiếp từ Supabase Database. Số liệu làm căn cứ tính phí thường niên và đối soát hoa hồng Pay-per-lead.
          </p>
        </div>

        {/* 4 KPI Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <div style={{ background: '#fff', padding: '1.6rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Đối tác xác minh</span>
            <strong style={{ fontSize: '2.2rem', color: '#133e2f', display: 'block', margin: '0.4rem 0' }}>{totalPartners}</strong>
            <span style={{ fontSize: '0.78rem', color: '#10b981' }}>Homestay, Nhà xe, Vé tàu</span>
          </div>

          <div style={{ background: '#fff', padding: '1.6rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Đơn đăng ký mới</span>
            <strong style={{ fontSize: '2.2rem', color: '#d97706', display: 'block', margin: '0.4rem 0' }}>{totalRegistrations}</strong>
            <span style={{ fontSize: '0.78rem', color: '#d97706' }}>Cơ sở chờ duyệt hồ sơ</span>
          </div>

          <div style={{ background: '#fff', padding: '1.6rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)', boxShadow: '0 4px 15px rgba(0,0,0,0.02)' }}>
            <span style={{ fontSize: '0.85rem', color: '#6b7280', display: 'block' }}>Lượt kết nối khách (Leads)</span>
            <strong style={{ fontSize: '2.2rem', color: '#2563eb', display: 'block', margin: '0.4rem 0' }}>{totalLeads}</strong>
            <span style={{ fontSize: '0.78rem', color: '#2563eb' }}>Click Gọi điện & Zalo</span>
          </div>

          <div style={{ background: '#133e2f', color: '#fff', padding: '1.6rem', borderRadius: '18px', boxShadow: '0 8px 24px rgba(19,62,47,0.2)' }}>
            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', display: 'block' }}>Doanh thu tạm tính</span>
            <strong style={{ fontSize: '1.8rem', color: '#fef08a', display: 'block', margin: '0.4rem 0' }}>
              {estRevenue.toLocaleString('vi-VN')} đ
            </strong>
            <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.8)' }}>Phí niêm yết + hoa hồng lead</span>
          </div>
        </div>

        {/* Recent Leads Table */}
        <div style={{ background: '#fff', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(27,42,34,0.08)' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#133e2f', marginTop: 0, fontSize: '1.4rem', marginBottom: '1.2rem' }}>
            Nhật ký kết nối khách hàng gần nhất (Leads Log)
          </h2>
          {(!recentLeads.data || recentLeads.data.length === 0) ? (
            <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>Chưa có lượt click nào được ghi nhận.</p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f3f4f6', color: '#6b7280' }}>
                    <th style={{ padding: '0.8rem 0.5rem' }}>Thời gian</th>
                    <th style={{ padding: '0.8rem 0.5rem' }}>Dịch vụ / Cơ sở</th>
                    <th style={{ padding: '0.8rem 0.5rem' }}>Hành động</th>
                    <th style={{ padding: '0.8rem 0.5rem' }}>User Agent / IP</th>
                  </tr>
                </thead>
                <tbody>
                  {recentLeads.data.map((lead: any) => (
                    <tr key={lead.id} style={{ borderBottom: '1px solid #f9fafb' }}>
                      <td style={{ padding: '0.8rem 0.5rem', color: '#6b7280', fontSize: '0.8rem' }}>
                        {new Date(lead.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td style={{ padding: '0.8rem 0.5rem', fontWeight: 600, color: '#133e2f' }}>
                        {lead.service_name}
                      </td>
                      <td style={{ padding: '0.8rem 0.5rem' }}>
                        <span style={{
                          backgroundColor: lead.action === 'zalo' ? '#eff6ff' : '#ecfdf5',
                          color: lead.action === 'zalo' ? '#1d4ed8' : '#047857',
                          padding: '3px 8px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                        }}>
                          {lead.action === 'zalo' ? 'Nhắn Zalo' : 'Gọi Hotline'}
                        </span>
                      </td>
                      <td style={{ padding: '0.8rem 0.5rem', color: '#9ca3af', fontSize: '0.78rem' }}>
                        {lead.user_ip}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
