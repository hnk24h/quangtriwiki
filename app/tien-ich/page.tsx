import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { getGuides } from '@/lib/get-data';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Cây Xăng, Trạm Cứu Hộ & Tiện Ích Hành Trình Quảng Trị',
  description:
    'Danh bạ cây xăng Petrolimex, trạm cứu hộ đèo Sa Mù 24/7, hotline cảng Cửa Việt đặt vé tàu Cồn Cỏ, công an và y tế khẩn cấp tại Quảng Trị.',
};

export default async function TienIchPage() {
  const { emergencyHotlines, gasStations, bestTimeToVisit } = await getGuides();

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        <div
          style={{
            backgroundColor: '#133e2f',
            color: '#fff',
            padding: '4rem 1.5rem 3.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              AN TOÀN TRÊN MỌI CUNG ĐƯỜNG
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Cây Xăng, Cứu Hộ & Tiện Ích
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Cẩm nang tra cứu trạm nhiên liệu, danh bạ cứu hộ giao thông 24/7 và lời khuyên theo mùa cho chuyến phượt Quảng Trị an toàn.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1150px', margin: '2.5rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Emergency Hotlines */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#991b1b', margin: 0 }}>
                Đường Dây Nóng & Cứu Hộ Khẩn Cấp 24/7
              </h2>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
              Lưu ngay vào điện thoại trước khi khởi hành vào các đoạn đường rừng đèo hoang sơ.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {emergencyHotlines.map((hl, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid #fee2e2',
                    boxShadow: '0 2px 8px rgba(185, 28, 28, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '1.1rem', color: '#133e2f', margin: '0 0 0.4rem 0', fontWeight: 700 }}>
                      {hl.name}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 1rem 0', lineHeight: 1.5 }}>
                      {hl.note || 'Hỗ trợ 24/7'}
                    </p>
                  </div>

                  <a
                    href={`tel:${hl.phone.replace(/[^0-9]/g, '')}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      background: '#b91c1c',
                      color: '#fff',
                      padding: '0.65rem 1rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                    }}
                  >
                    <span>📞 Gọi: {hl.phone}</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* Gas Stations */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.5rem' }}>⛽</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: 0 }}>
                Trạm Xăng & Nhiên Liệu Cốt Lõi
              </h2>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
              Các trạm xăng chốt chặn quan trọng trước khi vào các tuyến đèo và đường Hồ Chí Minh Tây.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {gasStations.map((gas, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(27,42,34,0.08)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'inline-block', background: '#dcfce7', color: '#15803d', fontSize: '0.75rem', fontWeight: 700, padding: '3px 8px', borderRadius: '4px', marginBottom: '0.6rem' }}>
                    {gas.route}
                  </div>
                  <h3 style={{ fontSize: '1.15rem', color: '#133e2f', margin: '0 0 0.5rem 0', fontWeight: 700 }}>
                    {gas.name}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
                    💡 <strong>Lời khuyên:</strong> {gas.tip}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Best Time To Visit */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🌤️</span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: 0 }}>
                Thời Tiết & Thời Điểm Lý Tưởng
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {bestTimeToVisit.map((season, idx) => (
                <div
                  key={idx}
                  style={{
                    background: '#fff',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    border: '1px solid rgba(27,42,34,0.08)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  }}
                >
                  <h3 style={{ fontSize: '1.1rem', color: '#133e2f', margin: '0 0 0.6rem 0', fontWeight: 700 }}>
                    {season.season}
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#4b5563', margin: 0, lineHeight: 1.6 }}>
                    {season.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div
            style={{
              background: '#133e2f',
              color: '#fff',
              borderRadius: '16px',
              padding: '2rem 2.5rem',
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1.5rem',
            }}
          >
            <div>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', margin: '0 0 0.4rem 0' }}>
                Cần thêm hành trang và ghi chú?
              </h3>
              <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.95rem' }}>
                Mở sổ tay cá nhân để đánh dấu danh sách đồ dùng mang theo và lưu điểm đến yêu thích.
              </p>
            </div>
            <Link
              href="/so-tay"
              style={{
                background: '#fff',
                color: '#133e2f',
                padding: '0.8rem 1.6rem',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.95rem',
              }}
            >
              Mở Sổ tay của tôi →
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
