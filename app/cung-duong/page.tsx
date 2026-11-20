import { Metadata } from 'next';
import { getPlaces, getZones } from '@/lib/get-data';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CungDuongClient from './CungDuongClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Khám Phá Cung Đường Quảng Trị · 12 Vùng Lộ Trình & Điểm Đến',
  description:
    'Bản đồ tương tác và cẩm nang chi tiết 12 phân vùng lộ trình QT-01 đến QT-12: Phong Nha - Kẻ Bàng, Đồng Hới - Nhật Lệ, Vũng Chùa, Thành Cổ, Hiền Lương, Đèo Sa Mù, Đảo Cồn Cỏ.',
};

export default async function CungDuongPage() {
  const [places, zones] = await Promise.all([getPlaces(), getZones()]);

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
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              HỆ THỐNG MÃ CUNG ĐƯỜNG QT-01 → QT-12
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Khám Phá Cung Đường Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Hành trình xuyên suốt từ Di sản thiên nhiên thế giới Phong Nha - Kẻ Bàng, biển Nhật Lệ đến Vĩ tuyến 17, đèo mây Sa Mù và đảo ngọc Cồn Cỏ.
            </p>
          </div>
        </div>

        <CungDuongClient places={places} zones={zones} />
      </main>

      <Footer />
    </div>
  );
}
