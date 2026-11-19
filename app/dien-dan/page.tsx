import { Metadata } from 'next';
import { getThreads } from '@/lib/get-data';
import DienDanClient from './DienDanClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Diễn Đàn Du Lịch Quảng Trị · Kinh Nghiệm, Ảnh Check-in & Review',
  description:
    'Góc chia sẻ trải nghiệm thực tế từ những người đã phượt đèo Sa Mù, lặn ngắm san hô Cồn Cỏ, tham quan Thành Cổ và Địa đạo Vịnh Mốc.',
};

export default async function ForumPage() {
  const threads = await getThreads();
  return <DienDanClient initialThreads={threads} />;
}
