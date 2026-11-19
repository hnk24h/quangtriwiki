import { Metadata } from 'next';
import AdminClient from './AdminClient';

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Trị Nội Dung CMS · QuangTri.wiki',
  description: 'Trang quản trị nội dung, biên tập bài viết và dữ liệu du lịch Quảng Trị.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminPage() {
  return <AdminClient />;
}
