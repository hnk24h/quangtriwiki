import { Metadata } from 'next';
import { getServices } from '@/lib/get-data';
import DichVuClient from './DichVuClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Lưu Trú & Dịch Vụ Bản Địa Xác Minh · Homestay, Thuê Xe, Vé Tàu Cồn Cỏ',
  description:
    'Danh bạ homestay, thuê xe máy phượt Sa Mù, vé tàu cao tốc đảo Cồn Cỏ được xác minh uy tín tại Quảng Trị. Kết nối trực tiếp qua Zalo & Hotline.',
};

export default async function ServicesPage() {
  const list = await getServices();
  return <DichVuClient initialServices={list} />;
}
