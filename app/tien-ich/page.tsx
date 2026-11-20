import { Metadata } from 'next';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import ScrollReveal from '@/components/common/ScrollReveal';
import SubpageHero from '@/components/common/SubpageHero';
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
        <SubpageHero
          kicker="AN TOÀN TRÊN MỌI CUNG ĐƯỜNG"
          kickerIcon="bi-shield-check"
          title="Cây Xăng, Cứu Hộ & Tiện Ích"
          subtitle="Cẩm nang tra cứu trạm nhiên liệu, danh bạ cứu hộ giao thông 24/7 và lời khuyên theo mùa cho chuyến phượt Quảng Trị an toàn."
          highlights={[
            { icon: 'bi-telephone-fill', label: `${emergencyHotlines.length} hotline cứu hộ 24/7` },
            { icon: 'bi-fuel-pump-fill', label: `${gasStations.length} trạm xăng trọng yếu` },
            { icon: 'bi-cloud-sun', label: 'Dự báo thời điểm lý tưởng' },
          ]}
          slides={[
            {
              image: '/images/deo-sa-mu-clouds.jpg',
              tag: 'CỨU HỘ ĐÈO SA MÙ 24/7',
              title: 'Hỗ Trợ Kéo Xe & Vá Vỏ Lưu Động',
              caption: 'Lưu sẵn số cứu hộ Khe Sanh – Hướng Hóa trước khi chạy cung đường Hồ Chí Minh Tây.',
            },
            {
              image: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?auto=format&fit=crop&w=900&q=80',
              tag: 'TRẠM NHIÊN LIỆU CHỐT CHẶN',
              title: 'Đổ Đầy Bình Trước Khi Lên Đèo',
              caption: 'Xác định các điểm Petrolimex cửa ngõ Cam Lộ, Đakrông, Khe Sanh và Phong Nha.',
            },
            {
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
              tag: 'THỜI TIẾT THEO MÙA',
              title: 'Mùa Biển Đẹp & Mùa Săn Mây',
              caption: 'Tháng 4–8 biển êm đi Cồn Cỏ; tháng 10–3 se lạnh thích hợp săn mây đại ngàn.',
            },
          ]}
        />

        <div style={{ maxWidth: '1150px', margin: '2.5rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Emergency Hotlines */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.35rem', color: '#991b1b' }}><i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /></span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#991b1b', margin: 0 }}>
                Đường Dây Nóng & Cứu Hộ Khẩn Cấp 24/7
              </h2>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
              Lưu ngay vào điện thoại trước khi khởi hành vào các đoạn đường rừng đèo hoang sơ.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {emergencyHotlines.map((hl, idx) => (
                <ScrollReveal key={idx} delayMs={(idx % 3) * 70} style={{ display: 'flex' }}>
                <div
                  style={{
                    flex: 1,
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
                    <span><i className="bi bi-telephone-fill" aria-hidden="true" /> Gọi: {hl.phone}</span>
                  </a>
                </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Gas Stations */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.35rem', color: '#133e2f' }}><i className="bi bi-fuel-pump-fill" aria-hidden="true" /></span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: 0 }}>
                Trạm Xăng & Nhiên Liệu Cốt Lõi
              </h2>
            </div>
            <p style={{ color: '#6b7280', fontSize: '0.95rem', margin: '0 0 1.5rem 0' }}>
              Các trạm xăng chốt chặn quan trọng trước khi vào các tuyến đèo và đường Hồ Chí Minh Tây.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
              {gasStations.map((gas, idx) => (
                <ScrollReveal key={idx} delayMs={(idx % 3) * 70} style={{ display: 'flex' }}>
                <div
                  style={{
                    flex: 1,
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
                    <i className="bi bi-lightbulb" aria-hidden="true" /> <strong>Lời khuyên:</strong> {gas.tip}
                  </p>
                </div>
                </ScrollReveal>
              ))}
            </div>
          </section>

          {/* Best Time To Visit */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '1.35rem', color: '#133e2f' }}><i className="bi bi-cloud-sun" aria-hidden="true" /></span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: 0 }}>
                Thời Tiết & Thời Điểm Lý Tưởng
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
              {bestTimeToVisit.map((season, idx) => (
                <ScrollReveal key={idx} delayMs={(idx % 3) * 70} style={{ display: 'flex' }}>
                <div
                  style={{
                    flex: 1,
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
                </ScrollReveal>
              ))}
            </div>
          </section>

          <ScrollReveal variant="scale-up">
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
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
