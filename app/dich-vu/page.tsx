import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { getServices } from '@/lib/get-data';

export const metadata: Metadata = {
  title: 'Lưu Trú & Dịch Vụ Bản Địa Xác Minh · Homestay, Thuê Xe, Vé Tàu Cồn Cỏ',
  description: 'Danh bạ homestay, thuê xe máy phượt Sa Mù, vé tàu cao tốc đảo Cồn Cỏ được xác minh uy tín tại Quảng Trị. Kết nối trực tiếp qua Zalo & Hotline.',
};

export default async function ServicesPage() {
  const list = await getServices();

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
              KẾT NỐI TRỰC TIẾP VỚI NGƯỜI BẢN ĐỊA
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Lưu Trú & Dịch Vụ Du Lịch Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Tất cả đối tác đều được đội ngũ khảo sát thực tế, cam kết đúng giá niêm yết, không chèo kéo, hỗ trợ tận tình cho phượt thủ và khách lãng du.
            </p>
          </div>
        </div>

        {/* Services Grid */}
        <div style={{
          maxWidth: '1200px',
          margin: '3rem auto 0',
          padding: '0 1.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {list.map((srv: any) => (
            <article
              key={srv.id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ position: 'relative', height: '190px' }}>
                <img
                  src={srv.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80'}
                  alt={srv.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(19, 62, 47, 0.85)',
                  color: '#fff',
                  backdropFilter: 'blur(4px)',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  {srv.type_label || srv.categoryName || 'Dịch vụ'}
                </span>
                {(srv.is_verified || srv.verified) && (
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    backgroundColor: '#10b981',
                    color: '#fff',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.72rem',
                    fontWeight: 600,
                  }}>
                    ✓ Đã xác minh
                  </span>
                )}
              </div>

              <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{srv.zone_name || srv.zoneName}</span>
                  <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 600 }}>★ {srv.rating} ({srv.reviewsCount || srv.reviews})</span>
                </div>

                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#133e2f', margin: '0 0 0.5rem 0' }}>
                  {srv.name}
                </h3>
                <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                  {srv.address}
                </p>

                <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Mức giá tham khảo</span>
                    <strong style={{ fontSize: '1.1rem', color: '#133e2f' }}>{srv.price}</strong>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                    <a
                      href={`tel:${srv.phone || srv.hotline}`}
                      style={{
                        textAlign: 'center',
                        padding: '0.65rem 0',
                        borderRadius: '10px',
                        border: '1px solid #133e2f',
                        color: '#133e2f',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                      }}
                    >
                      Gọi Hotline
                    </a>
                    <a
                      href={`https://zalo.me/${(srv.zalo || srv.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        textAlign: 'center',
                        padding: '0.65rem 0',
                        borderRadius: '10px',
                        backgroundColor: '#0068ff',
                        color: '#fff',
                        textDecoration: 'none',
                        fontWeight: 600,
                        fontSize: '0.88rem',
                      }}
                    >
                      Nhắn Zalo
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}