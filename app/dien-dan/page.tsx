import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { getThreads } from '@/lib/get-data';

export const metadata: Metadata = {
  title: 'Diễn Đàn Du Lịch Quảng Trị · Kinh Nghiệm, Ảnh Check-in & Review',
  description: 'Góc chia sẻ trải nghiệm thực tế từ những người đã phượt đèo Sa Mù, lặn ngắm san hô Cồn Cỏ, tham quan Thành Cổ và Địa đạo Vịnh Mốc.',
};

export default async function ForumPage() {
  const list = await getThreads();

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#133e2f',
          color: '#fff',
          padding: '4rem 1.5rem 3.5rem',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              CỘNG ĐỒNG NHỮNG NGƯỜI ĐI CHẬM
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Nhật Ký & Thảo Luận Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Nơi du khách chia sẻ những góc nhìn chân thật nhất về cung đường, ẩm thực và tình người xứ gió Lào cát trắng.
            </p>
          </div>
        </div>

        {/* Thread List */}
        <div style={{ maxWidth: '850px', margin: '3rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {list.map((th: any) => (
            <article
              key={th.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '18px',
                padding: '1.8rem',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <img
                    src={th.avatar || th.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                    alt={th.author || th.author_name}
                    style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: '#133e2f' }}>{th.author || th.author_name}</strong>
                      {(th.badge || th.author_badge) && (
                        <span style={{ fontSize: '0.72rem', backgroundColor: '#e5e7eb', padding: '2px 8px', borderRadius: '10px', color: '#4b5563' }}>
                          {th.badge || th.author_badge}
                        </span>
                      )}
                    </div>
                    <span style={{ fontSize: '0.78rem', color: '#9ca3af' }}>
                      {th.time || (th.created_at ? new Date(th.created_at).toLocaleDateString('vi-VN') : 'Gần đây')}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#ecfdf5', color: '#047857', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    {th.tag}
                  </span>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#fef3c7', color: '#b45309', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>
                    {th.zoneCode || th.zone_code}
                  </span>
                </div>
              </div>

              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.35rem', color: '#133e2f', margin: '0 0 0.8rem 0' }}>
                {th.title}
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.7, fontSize: '0.95rem', margin: '0 0 1.2rem 0' }}>
                {th.content}
              </p>

              {th.images && th.images.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.8rem', marginBottom: '1.2rem' }}>
                  {th.images.map((img: string, idx: number) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Ảnh chuyến đi"
                      style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '12px' }}
                    />
                  ))}
                </div>
              )}

              <div style={{ display: 'flex', gap: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #f3f4f6', fontSize: '0.85rem', color: '#6b7280' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  ❤️ {th.likes_count || 0} Lượt thích
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  💬 Bình luận & Hỏi đáp
                </span>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}