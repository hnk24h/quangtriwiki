import { Metadata } from 'next';
import ChiPhiClient from './ChiPhiClient';

export const metadata: Metadata = {
  title: 'Dự Toán Chi Phí Du Lịch Quảng Trị · Tự Túc Minh Bạch',
  description:
    'Công cụ dự toán ngân sách du lịch Quảng Trị tự túc: chi phí thuê xe máy, homestay Khe Sanh, ăn uống đặc sản, vé di tích và tàu cao tốc đảo Cồn Cỏ.',
};

export default function ChiPhiPage() {
  return <ChiPhiClient />;
}
