import { Metadata } from 'next';
import { getPlaces, getZones } from '@/lib/get-data';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SubpageHero from '@/components/common/SubpageHero';
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
        <SubpageHero
          kicker="HỆ THỐNG MÃ CUNG ĐƯỜNG QT-01 → QT-12"
          kickerIcon="bi-map"
          title="Khám Phá Cung Đường Quảng Trị"
          subtitle="Hành trình xuyên suốt từ Di sản thiên nhiên thế giới Phong Nha - Kẻ Bàng, biển Nhật Lệ đến Vĩ tuyến 17, đèo mây Sa Mù và đảo ngọc Cồn Cỏ."
          highlights={[
            { icon: 'bi-geo-alt-fill', label: `${places.length} tọa độ thực địa` },
            { icon: 'bi-signpost-split', label: `${zones.length} phân vùng di sản` },
            { icon: 'bi-pin-angle-fill', label: 'Ghim địa điểm cộng đồng' },
          ]}
          slides={[
            {
              image: '/images/phong-nha-cave.jpg',
              tag: 'QT-09 · PHONG NHA - KẺ BÀNG',
              title: 'Kỳ Quan Hang Động UNESCO',
              caption: 'Hệ thống hang động đá vôi hùng vĩ và sông Son xanh ngọc bích phía Bắc tỉnh.',
            },
            {
              image: '/images/hien-luong-bridge.jpg',
              tag: 'QT-03 · VĨ TUYẾN 17',
              title: 'Cầu Hiền Lương & Sông Bến Hải',
              caption: 'Dấu ấn lịch sử chia cắt hai miền và biểu tượng khát vọng thống nhất.',
            },
            {
              image: '/images/deo-sa-mu-clouds.jpg',
              tag: 'QT-05 · ĐÈO SA MÙ 1.400M',
              title: 'Biển Mây Đại Ngàn Trường Sơn',
              caption: 'Cung đèo săn mây, cánh đồng điện gió Hướng Linh và thung lũng cà phê Khe Sanh.',
            },
          ]}
        />

        <CungDuongClient places={places} zones={zones} />
      </main>

      <Footer />
    </div>
  );
}
