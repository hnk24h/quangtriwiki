import { Metadata } from 'next';
import { getItineraries } from '@/lib/get-data';
import LichTrinhClient from './LichTrinhClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Lịch Trình & Cung Đường Du Lịch Quảng Trị · Theo Từng Chặng Chi Tiết',
  description:
    'Tổng hợp lịch trình phượt Quảng Trị 2N1Đ, 3N2Đ tối ưu thời gian: Săn mây Đèo Sa Mù, Thành Cổ, Vịnh Mốc, Khe Sanh và đảo ngọc Cồn Cỏ.',
};

export default async function LichTrinhPage() {
  const itineraries = await getItineraries();
  return <LichTrinhClient initialItineraries={itineraries} />;
}
