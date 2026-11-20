import type { Metadata } from 'next';
import ToastProvider from '@/components/common/ToastProvider';
import PageViewTracker from '@/components/common/PageViewTracker';
import { LanguageProvider } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://quangtri.wiki'),
  title: {
    default: 'QuangTri.wiki · Đi đến nơi có gió',
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
    title: 'QuangTri.wiki · Đi đến nơi có gió',
    description:
      'Cẩm nang du lịch và cung đường di sản Quảng Trị độc lập, chi tiết và chân thật nhất.',
    url: 'https://quangtri.wiki',
    siteName: 'QuangTri.wiki',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'QuangTri.wiki · Đi đến nơi có gió',
      },
    ],
    locale: 'vi_VN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QuangTri.wiki · Đi đến nơi có gió',
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
        <LanguageProvider>
          <ToastProvider>
            <PageViewTracker />
            {children}
          </ToastProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
