import { Metadata } from 'next';
import { getPlaces } from '@/lib/get-data';
import { QUANGTRI_DATA } from '@/lib/data';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import CungDuongClient from './CungDuongClient';

export const metadata: Metadata = {
  title: 'Khám Phá Cung Đường Quảng Trị · 8 Vùng Lộ Trình & 24 Điểm Đến',
  description: 'Bản đồ và cẩm nang chi tiết 8 phân vùng lộ trình QT-01 đến QT-08: Thành Cổ, Đôi Bờ Hiền Lương, Đèo Sa Mù, Đảo Cồn Cỏ, Địa đạo Vịnh Mốc.',
};

export default async function CungDuongPage() {
  const places = await getPlaces();

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        <div style={{
          backgroundColor: '#133e2f',
          color: '#fff',
          padding: '4rem 1.5rem 3.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              HỆ THỐNG MÃ CUNG ĐƯỜNG QT-01 → QT-08
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Khám Phá Cung Đường Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Hành trình kết nối di sản lịch sử hào hùng, những con đèo mây ngàn Trường Sơn và đảo ngọc tiền đồn Cồn Cỏ.
            </p>
          </div>
        </div>

        <CungDuongClient
          places={places || []}
          zones={QUANGTRI_DATA.zones || []}
        />
      </main>

      <Footer />
    </div>
  );
}
