import { Metadata } from 'next';
import { getFoods } from '@/lib/get-data';
import AmThucClient from './AmThucClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Ẩm Thực & Món Ngon Quảng Trị · Quán Ngon Bản Địa & Đặc Sản',
  description:
    'Khám phá cháo vạt giường Hải Lăng, bún hến Mai Xá, thịt trâu lá trơng, bánh bột lọc Mỹ Chánh và cà phê Khe Sanh cùng địa chỉ quán ngon chuẩn người bản địa.',
};

export default async function AmThucPage() {
  const foods = await getFoods();
  return <AmThucClient initialFoods={foods} />;
}
