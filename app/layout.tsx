import type { Metadata } from 'next';
import ToastProvider from '@/components/common/ToastProvider';
import PageViewTracker from '@/components/common/PageViewTracker';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://quangtri.wiki'),
  title: {
    default: 'QuangTri.wiki · Cẩm Nang Du Lịch & Cung Đường Quảng Trị',
    template: '%s · QuangTri.wiki',
  },
  description:
    'Khám phá cung đường di sản Quảng Trị mới: Vườn quốc gia Phong Nha - Kẻ Bàng, biển Nhật Lệ, Vũng Chùa - Đảo Yến, địa đạo Vịnh Mốc, đèo Sa Mù và đảo ngọc Cồn Cỏ.',
  keywords: [
    'du lịch quảng trị',
    'quang tri wiki',
    'phong nha kẻ bàng',
    'biển nhật lệ',
    'đồng hới',
    'đèo sa mù',
    'đảo cồn cỏ',
    'địa đạo vịnh mốc',
    'thành cổ quảng trị',
    'cung đường di sản',
    'homestay quảng trị',
  ],
  authors: [{ name: 'QuangTri Wiki Team' }],
  openGraph: {
    title: 'QuangTri.wiki · Đi Chậm Để Cảm Nhận Vùng Đất Ký Ức',
    description:
      'Cẩm nang du lịch và cung đường di sản Quảng Trị độc lập, chi tiết và chân thật nhất.',
    url: 'https://quangtri.wiki',
    siteName: 'QuangTri.wiki',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'QuangTri.wiki',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuangTri.wiki · Du Lịch Đi Chậm & Cung Đường Di Sản',
    description: 'Cẩm nang du lịch và cung đường di sản Quảng Trị độc lập.',
    images: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ToastProvider>
          <PageViewTracker />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
