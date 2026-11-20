'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { useToast } from '@/components/common/ToastProvider';
import PlaceQuickModal from '@/components/home/PlaceQuickModal';
import { formatDualCurrency, useLanguage } from '@/lib/i18n';
import { DEFAULT_ZONE_META } from '@/lib/normalize';
import type { Food, GuidesData, Place, Service, Zone } from '@/lib/supabase/types';

export type MapPoiCategory =
  | 'all'
  | 'sightseeing'
  | 'food'
  | 'hotel'
  | 'parking'
  | 'fuel'
  | 'user_pin';

export type MapBaseLayer = 'street' | 'satellite' | 'terrain';

export interface MapPoiItem {
  id: string;
  name: string;
  category: Exclude<MapPoiCategory, 'all'>;
  categoryLabel: string;
  zoneCode: string;
  zoneName: string;
  lat: number;
  lng: number;
  address: string;
  priceOrHours: string;
  rating?: number;
  description: string;
  image?: string;
  phone?: string;
  contributor?: string;
  isUserPin?: boolean;
  rawPlace?: Place;
}

interface Props {
  places: Place[];
  foods?: Food[];
  services?: Service[];
  zones?: Zone[];
  guides?: GuidesData;
  selectedZone?: string;
  onSelectZone?: (zoneCode: string) => void;
  onOpenModal?: (place: Place) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string, e?: React.MouseEvent) => void;
  defaultSidebarCollapsed?: boolean;
}

const USER_PINS_STORAGE_KEY = 'quangtri_user_map_pins_v1';

const FALLBACK_PLACE_COORDS: Record<string, { lat: number; lng: number }> = {
  'thanh-co-quang-tri': { lat: 16.7533, lng: 107.1912 },
  'cau-hien-luong-ben-hai': { lat: 17.0019, lng: 107.0984 },
  'dia-dao-vinh-moc': { lat: 17.0715, lng: 107.1103 },
  'san-bay-ta-con': { lat: 16.6534, lng: 106.7118 },
  'deo-sa-mu': { lat: 16.6895, lng: 106.7112 },
  'thac-chenh-venh': { lat: 16.6982, lng: 106.7245 },
  'canh-dong-dien-gio-huong-linh': { lat: 16.7012, lng: 106.7615 },
  'nghia-trang-truong-son': { lat: 16.931, lng: 106.968 },
  'dao-con-co': { lat: 17.1583, lng: 107.3389 },
  'bien-cua-viet': { lat: 16.9065, lng: 107.185 },
  'mui-treo-quang-tri': { lat: 17.095, lng: 107.092 },
  'cau-treo-dakrong': { lat: 16.578, lng: 106.956 },
  'thanh-dia-la-vang': { lat: 16.7215, lng: 107.158 },
  'den-vua-ham-nghi-tan-so': { lat: 16.803, lng: 106.993 },
  'dong-phong-nha': { lat: 17.5819, lng: 106.2836 },
  'dong-thien-duong': { lat: 17.5194, lng: 106.2236 },
  'suoi-nuoc-mooc': { lat: 17.5625, lng: 106.2358 },
  'bai-bien-nhat-le': { lat: 17.4848, lng: 106.6252 },
  'vung-chua-dao-yen': { lat: 17.9347, lng: 106.4847 },
  'nha-luu-niem-dai-tuong-vo-nguyen-giap': { lat: 17.2215, lng: 106.7985 },
};

const CURATED_FOOD_POIS: MapPoiItem[] = [
  {
    id: 'food-poi-chao-vat-giuong',
    name: 'Phố Cháo Vạt Giường Diên Sanh',
    category: 'food',
    categoryLabel: 'Ăn uống & Đặc sản',
    zoneCode: 'QT-02',
    zoneName: 'Thị Xã Quảng Trị & Hải Lăng',
    lat: 16.7024,
    lng: 107.2315,
    address: 'Ngã 3 Hải Lăng, TT. Diên Sanh, Hải Lăng',
    priceOrHours: '25.000 - 45.000đ · 06:00 - 21:00',
    rating: 4.9,
    description: 'Bánh canh cá lóc đồng ướp củ nén cay nồng trứ danh đất Hải Lăng.',
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-bun-hen-mai-xa',
    name: 'Làng Bún Hến Mai Xá (Chắt Bi)',
    category: 'food',
    categoryLabel: 'Ăn uống & Đặc sản',
    zoneCode: 'QT-04',
    zoneName: 'Gio Linh & Cửa Việt',
    lat: 16.8795,
    lng: 107.1422,
    address: 'Làng Mai Xá, xã Gio Mai, huyện Gio Linh',
    priceOrHours: '20.000 - 35.000đ · 06:00 - 17:00',
    rating: 4.9,
    description: 'Di sản ẩm thực Việt Nam với chắt chắt sông Hiếu đậm vị gừng cay.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-cafe-khe-sanh',
    name: 'Không Gian Cà Phê Arabica Khe Sanh',
    category: 'food',
    categoryLabel: 'Ăn uống & Cafe',
    zoneCode: 'QT-05',
    zoneName: 'Hướng Hóa & Khe Sanh',
    lat: 16.6312,
    lng: 106.7268,
    address: 'Thị trấn Khe Sanh & Hướng Phùng, Hướng Hóa',
    priceOrHours: '25.000 - 55.000đ · 06:30 - 22:00',
    rating: 4.9,
    description: 'Thưởng thức Arabica vùng cao Khe Sanh và thịt trâu lá trơng nướng thơm lừng.',
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-cho-dong-ha',
    name: 'Khu Ẩm Thực Chợ Đông Hà',
    category: 'food',
    categoryLabel: 'Ăn uống & Đặc sản',
    zoneCode: 'QT-01',
    zoneName: 'Đông Hà & Vùng Trung Tâm',
    lat: 16.8178,
    lng: 107.1048,
    address: 'Đường Nguyễn Trãi, TP. Đông Hà',
    priceOrHours: '15.000 - 60.000đ · 07:00 - 18:30',
    rating: 4.8,
    description: 'Thiên đường bánh bột lọc, bánh ướt, bún nghệ và chè truyền thống Đông Hà.',
    image: 'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-hai-san-cua-viet',
    name: 'Phố Hải Sản Tươi Sống Bãi Biển Cửa Việt',
    category: 'food',
    categoryLabel: 'Hải sản biển',
    zoneCode: 'QT-04',
    zoneName: 'Gio Linh & Cửa Việt',
    lat: 16.9082,
    lng: 107.1892,
    address: 'Ven biển Cửa Việt, huyện Gio Linh',
    priceOrHours: '120.000 - 350.000đ · 09:00 - 22:30',
    rating: 4.8,
    description: 'Mực nhảy, ghẹ xanh, cá mú hấp và gỏi cá trích tươi đánh bắt trong ngày.',
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-ga-doi-cua',
    name: 'Đặc Sản Gà Đồi Cùa Cam Lộ',
    category: 'food',
    categoryLabel: 'Ăn uống & Đặc sản',
    zoneCode: 'QT-08',
    zoneName: 'Cam Lộ & Vùng Trung Du',
    lat: 16.7945,
    lng: 106.9825,
    address: 'Thung lũng Cùa, xã Cam Chính, Cam Lộ',
    priceOrHours: '180.000 - 280.000đ/con · 09:00 - 21:00',
    rating: 4.8,
    description: 'Gà thả đồi nướng muối ớt xanh chấm lá chanh và cao chè vằng Định Sơn.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-chao-canh-dong-hoi',
    name: 'Phố Cháo Canh Cá Lóc Đồng Hới',
    category: 'food',
    categoryLabel: 'Ăn uống & Đặc sản',
    zoneCode: 'QT-09',
    zoneName: 'Đồng Hới & Biển Nhật Lệ',
    lat: 17.4712,
    lng: 106.6205,
    address: 'Đường Lý Thường Kiệt & Lê Lợi, Đồng Hới',
    priceOrHours: '30.000 - 50.000đ · 06:00 - 21:30',
    rating: 4.9,
    description: 'Cháo canh cá lóc nóng hổi ăn cùng ram giòn và hải sản ven biển Nhật Lệ.',
    image: 'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'food-poi-ga-nuong-phong-nha',
    name: 'Mẹt Gà Nướng Muối Cheo & Cá Trắm Sông Son',
    category: 'food',
    categoryLabel: 'Ẩm thực Phong Nha',
    zoneCode: 'QT-10',
    zoneName: 'Phong Nha - Kẻ Bàng',
    lat: 17.5842,
    lng: 106.2865,
    address: 'Trung tâm thị trấn Phong Nha, Bố Trạch',
    priceOrHours: '220.000 - 320.000đ · 09:00 - 22:00',
    rating: 4.9,
    description: 'Gà nướng than hoa chấm muối cheo lá chanh rừng bên dòng sông Son.',
    image: 'https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?auto=format&fit=crop&w=600&q=80',
  },
];

const CURATED_HOTEL_POIS: MapPoiItem[] = [
  {
    id: 'hotel-poi-sa-mu-cloud',
    name: 'Sa Mù Cloud Glamping & Homestay',
    category: 'hotel',
    categoryLabel: 'Khách sạn & Homestay',
    zoneCode: 'QT-05',
    zoneName: 'Hướng Hóa & Khe Sanh',
    lat: 16.6825,
    lng: 106.7155,
    address: 'Chân đèo Sa Mù, xã Hướng Phùng, Hướng Hóa',
    priceOrHours: '450.000 - 850.000đ/đêm',
    rating: 4.9,
    description: 'Lều glamping và bungalow gỗ view biển mây Sa Mù, có BBQ tối và lửa trại.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hotel-poi-dong-ha-central',
    name: 'Khách Sạn Sài Gòn - Đông Hà & Lưu Trú Trung Tâm',
    category: 'hotel',
    categoryLabel: 'Khách sạn 4 sao',
    zoneCode: 'QT-01',
    zoneName: 'Đông Hà & Vùng Trung Tâm',
    lat: 16.8128,
    lng: 107.0965,
    address: '01 Bùi Thị Xuân, TP. Đông Hà (sát sông Hiếu)',
    priceOrHours: '650.000 - 1.200.000đ/đêm',
    rating: 4.8,
    description: 'Khách sạn trung tâm Đông Hà có bãi đỗ xe rộng, thuận tiện đi mọi cung đường.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hotel-poi-cua-viet-resort',
    name: 'Sepon Boutique Resort Biển Cửa Việt',
    category: 'hotel',
    categoryLabel: 'Resort ven biển',
    zoneCode: 'QT-04',
    zoneName: 'Gio Linh & Cửa Việt',
    lat: 16.9022,
    lng: 107.1912,
    address: 'Bãi tắm Cửa Việt, huyện Gio Linh',
    priceOrHours: '750.000 - 1.450.000đ/đêm',
    rating: 4.8,
    description: 'Khu nghỉ dưỡng sát bờ biển cát trắng Cửa Việt, cách bến tàu Cồn Cỏ 3 phút.',
    image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hotel-poi-khe-sanh-valley',
    name: 'Khe Sanh Coffee Valley Homestay',
    category: 'hotel',
    categoryLabel: 'Homestay bản địa',
    zoneCode: 'QT-05',
    zoneName: 'Hướng Hóa & Khe Sanh',
    lat: 16.6458,
    lng: 106.721,
    address: 'Xã Tân Hợp, Thị trấn Khe Sanh, Hướng Hóa',
    priceOrHours: '350.000 - 600.000đ/đêm',
    rating: 4.9,
    description: 'Homestay giữa đồi cà phê Arabica, cho thuê xe máy cào cào đi đèo Sa Mù.',
    image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hotel-poi-nhat-le-resort',
    name: 'Sun Spa & Bảo Ninh Beach Resort Nhật Lệ',
    category: 'hotel',
    categoryLabel: 'Resort ven biển',
    zoneCode: 'QT-09',
    zoneName: 'Đồng Hới & Biển Nhật Lệ',
    lat: 17.4655,
    lng: 106.6345,
    address: 'Bán đảo Bảo Ninh, TP. Đồng Hới',
    priceOrHours: '900.000 - 2.200.000đ/đêm',
    rating: 4.9,
    description: 'Nghỉ dưỡng cao cấp bên bán đảo Bảo Ninh và bãi biển Nhật Lệ.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'hotel-poi-phong-nha-farmstay',
    name: 'Phong Nha Farmstay & Mountain Eco Lodge',
    category: 'hotel',
    categoryLabel: 'Farmstay Di sản',
    zoneCode: 'QT-10',
    zoneName: 'Phong Nha - Kẻ Bàng',
    lat: 17.5685,
    lng: 106.3105,
    address: 'Cự Nẫm / Sơn Trạch, Phong Nha, Bố Trạch',
    priceOrHours: '550.000 - 1.100.000đ/đêm',
    rating: 4.9,
    description: 'View đồng lúa và núi đá vôi Phong Nha, hỗ trợ đặt tour hang động & xe máy.',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=600&q=80',
  },
];

const CURATED_PARKING_POIS: MapPoiItem[] = [
  {
    id: 'parking-thanh-co',
    name: 'Bãi Đỗ Xe Di Tích Thành Cổ Quảng Trị',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe du lịch',
    zoneCode: 'QT-02',
    zoneName: 'Thị Xã Quảng Trị & Hải Lăng',
    lat: 16.7545,
    lng: 107.1892,
    address: 'Cổng chính Thành Cổ, đường Lý Thái Tổ, TX. Quảng Trị',
    priceOrHours: 'Ô tô & Xe máy · Mở cửa 06:00 - 22:00',
    rating: 4.9,
    description: 'Bãi đỗ rộng rãi có bóng cây xanh, đỗ được xe đoàn 45 chỗ, ô tô con và xe máy.',
  },
  {
    id: 'parking-hien-luong',
    name: 'Bãi Đỗ Xe Khu Đôi Bờ Hiền Lương - Bến Hải',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe di tích',
    zoneCode: 'QT-03',
    zoneName: 'Vĩnh Linh & Vĩ Tuyến 17',
    lat: 17.0032,
    lng: 107.0972,
    address: 'Bờ Bắc Cầu Hiền Lương, QL1A, Vĩnh Linh',
    priceOrHours: 'Miễn phí / Phí niêm yết · 06:30 - 18:00',
    rating: 4.8,
    description: 'Bãi đỗ xe chính ngay nhà trưng bày Vĩ tuyến 17 và kỳ đài Hiền Lương.',
  },
  {
    id: 'parking-vinh-moc',
    name: 'Bãi Đỗ Xe Địa Đạo Vịnh Mốc',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe di tích',
    zoneCode: 'QT-03',
    zoneName: 'Vĩnh Linh & Vĩ Tuyến 17',
    lat: 17.0728,
    lng: 107.1095,
    address: 'Thôn Vịnh Mốc, xã Kim Thạch, Vĩnh Linh',
    priceOrHours: 'Có bảo vệ trông xe · 07:00 - 17:30',
    rating: 4.8,
    description: 'Bãi đỗ sát cổng khu địa đạo và lối xuống bờ biển Cửa Tùng.',
  },
  {
    id: 'parking-cang-cua-viet',
    name: 'Bãi Gửi Xe Qua Đêm Cảng Cửa Việt (Đi Đảo Cồn Cỏ)',
    category: 'parking',
    categoryLabel: 'Bãi gửi xe qua đêm',
    zoneCode: 'QT-04',
    zoneName: 'Gio Linh & Cửa Việt',
    lat: 16.9045,
    lng: 107.1862,
    address: 'Bến tàu cao tốc Cửa Việt, TT. Cửa Việt, Gio Linh',
    priceOrHours: 'Nhận gửi ô tô & xe máy qua đêm · 24/7',
    rating: 4.9,
    description: 'Bãi xe có mái che và bảo vệ 24/7 dành cho du khách gửi xe ra đảo Cồn Cỏ.',
  },
  {
    id: 'parking-deo-sa-mu',
    name: 'Trạm Dừng & Bãi Đỗ Săn Mây Đỉnh Đèo Sa Mù',
    category: 'parking',
    categoryLabel: 'Điểm dừng đỗ đèo',
    zoneCode: 'QT-05',
    zoneName: 'Hướng Hóa & Khe Sanh',
    lat: 16.6882,
    lng: 106.7128,
    address: 'Đỉnh đèo Sa Mù, Hướng Phùng, Hướng Hóa',
    priceOrHours: 'Miễn phí · Hoạt động 24/7',
    rating: 4.9,
    description: 'Bãi đất rộng an toàn ngay khúc cua ngắm biển mây đỉnh Sa Mù, không đỗ lấn lòng đèo.',
  },
  {
    id: 'parking-ta-con',
    name: 'Bãi Đỗ Xe Bảo Tàng Sân Bay Tà Cơn',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe di tích',
    zoneCode: 'QT-05',
    zoneName: 'Hướng Hóa & Khe Sanh',
    lat: 16.6545,
    lng: 106.7132,
    address: 'Xã Tân Hợp, huyện Hướng Hóa',
    priceOrHours: '07:00 - 17:30 · Đỗ xe máy & ô tô',
    rating: 4.8,
    description: 'Bãi đỗ xe ngay trước cổng bán vé di tích Sân bay Tà Cơn.',
  },
  {
    id: 'parking-la-vang',
    name: 'Bãi Đỗ Xe Trung Tâm Thánh Địa La Vang',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe hành hương',
    zoneCode: 'QT-02',
    zoneName: 'Thị Xã Quảng Trị & Hải Lăng',
    lat: 16.7224,
    lng: 107.1592,
    address: 'Xã Hải Phú, huyện Hải Lăng',
    priceOrHours: 'Miễn phí · Mở cửa 24/7',
    rating: 4.9,
    description: 'Khuôn viên đỗ xe sức chứa lớn ngay lối vào Linh Đài Đức Mẹ La Vang.',
  },
  {
    id: 'parking-dong-ha',
    name: 'Bãi Đỗ Xe Quảng Trường Trung Tâm Đông Hà',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe đô thị',
    zoneCode: 'QT-01',
    zoneName: 'Đông Hà & Vùng Trung Tâm',
    lat: 16.8148,
    lng: 107.1015,
    address: 'Đường Hùng Vương, trung tâm TP. Đông Hà',
    priceOrHours: 'Miễn phí · 24/7',
    rating: 4.7,
    description: 'Thuận tiện đỗ xe dạo phố đêm Đông Hà và ăn uống khu trung tâm.',
  },
  {
    id: 'parking-phong-nha',
    name: 'Bãi Đỗ Xe Trung Tâm Du Lịch Phong Nha',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe Di sản',
    zoneCode: 'QT-10',
    zoneName: 'Phong Nha - Kẻ Bàng',
    lat: 17.5835,
    lng: 106.2852,
    address: 'Sát bến thuyền du lịch Phong Nha, Bố Trạch',
    priceOrHours: 'Ô tô & Xe máy · 06:30 - 18:00',
    rating: 4.9,
    description: 'Bãi đỗ xe chính trước bến thuyền Động Phong Nha và điểm trung chuyển Động Thiên Đường.',
  },
  {
    id: 'parking-vung-chua',
    name: 'Bãi Đỗ Xe Khu Viếng Vũng Chùa - Đảo Yến',
    category: 'parking',
    categoryLabel: 'Bãi đỗ xe di tích',
    zoneCode: 'QT-11',
    zoneName: 'Bố Trạch, Vũng Chùa & Đèo Ngang',
    lat: 17.9325,
    lng: 106.4822,
    address: 'Chân núi Thọ, Vũng Chùa, Quảng Đông',
    priceOrHours: 'Miễn phí · 06:30 - 17:30',
    rating: 4.9,
    description: 'Bãi đỗ xe rộng rãi cho đoàn khách và xe máy ngay lối lên khu mộ Đại tướng.',
  },
];

const CURATED_FUEL_POIS: MapPoiItem[] = [
  {
    id: 'fuel-petrolimex-dong-ha',
    name: 'Trạm Xăng Petrolimex Số 1 Đông Hà (Ngã 3 QL1A - QL9)',
    category: 'fuel',
    categoryLabel: 'Cây xăng trọng yếu',
    zoneCode: 'QT-01',
    zoneName: 'Đông Hà & Vùng Trung Tâm',
    lat: 16.8192,
    lng: 107.0928,
    address: 'Đầu tuyến Quốc lộ 9 giao QL1A, TP. Đông Hà',
    priceOrHours: 'Mở cửa 24/7 · RON 95-III & DO',
    rating: 4.9,
    description: 'Điểm đổ đầy bình bắt buộc trước khi xuất phát theo QL9 lên Cam Lộ - Khe Sanh.',
  },
  {
    id: 'fuel-petrolimex-khe-sanh',
    name: 'Cây Xăng Petrolimex Thị Trấn Khe Sanh',
    category: 'fuel',
    categoryLabel: 'Cây xăng trước đèo',
    zoneCode: 'QT-05',
    zoneName: 'Hướng Hóa & Khe Sanh',
    lat: 16.6285,
    lng: 106.731,
    address: 'Đường Lê Duẩn (QL9), TT. Khe Sanh, Hướng Hóa',
    priceOrHours: '05:00 - 22:30 · Có tiệm vá lốp kế bên',
    rating: 4.9,
    description: 'Trạm nhiên liệu lớn cuối cùng trước khi rẽ vào đường Hồ Chí Minh nhánh Tây lên đèo Sa Mù.',
  },
  {
    id: 'fuel-petrolimex-dakrong',
    name: 'Trạm Xăng Cầu Treo Đakrông (Ngã 3 Đường HCM)',
    category: 'fuel',
    categoryLabel: 'Cây xăng đường đèo',
    zoneCode: 'QT-06',
    zoneName: 'Đakrông & Đường Hồ Chí Minh',
    lat: 16.5812,
    lng: 106.9595,
    address: 'Km 50 Quốc lộ 9, chân cầu treo Đakrông',
    priceOrHours: '05:30 - 21:00',
    rating: 4.8,
    description: 'Trạm tiếp xăng quan trọng cho cung đường Trường Sơn Đông - suối khoáng Klu.',
  },
  {
    id: 'fuel-petrolimex-ho-xa',
    name: 'Cây Xăng Petrolimex Hồ Xá - Vĩnh Linh',
    category: 'fuel',
    categoryLabel: 'Cây xăng QL1A Bắc',
    zoneCode: 'QT-03',
    zoneName: 'Vĩnh Linh & Vĩ Tuyến 17',
    lat: 17.0652,
    lng: 107.0398,
    address: 'Quốc lộ 1A, TT. Hồ Xá, huyện Vĩnh Linh',
    priceOrHours: 'Mở cửa 24/7',
    rating: 4.8,
    description: 'Trạm xăng lớn thuận tiện cho cung Cầu Hiền Lương - Địa đạo Vịnh Mốc - Mũi Trèo.',
  },
  {
    id: 'fuel-petrolimex-dong-hoi',
    name: 'Trạm Xăng Petrolimex Trung Tâm Đồng Hới',
    category: 'fuel',
    categoryLabel: 'Cây xăng QL1A',
    zoneCode: 'QT-09',
    zoneName: 'Đồng Hới & Biển Nhật Lệ',
    lat: 17.4695,
    lng: 106.6122,
    address: 'Đường Trần Hưng Đạo, TP. Đồng Hới',
    priceOrHours: 'Mở cửa 24/7',
    rating: 4.9,
    description: 'Trạm xăng trung tâm Đồng Hới, thuận tiện đổ đầy bình trước khi lên Phong Nha hoặc đi Đèo Ngang.',
  },
  {
    id: 'fuel-petrolimex-phong-nha',
    name: 'Cây Xăng Phong Nha (Cửa Ngõ Đường HCM Tây)',
    category: 'fuel',
    categoryLabel: 'Cây xăng trước rừng',
    zoneCode: 'QT-10',
    zoneName: 'Phong Nha - Kẻ Bàng',
    lat: 17.5865,
    lng: 106.2915,
    address: 'TT. Phong Nha, Bố Trạch',
    priceOrHours: '05:30 - 21:30',
    rating: 4.9,
    description: 'Điểm đổ xăng quan trọng nhất trước khi chạy đường Hồ Chí Minh nhánh Tây xuyên VQG Phong Nha - Kẻ Bàng.',
  },
];

const CATEGORY_TABS: Array<{
  id: MapPoiCategory;
  label: string;
  labelEn: string;
  labelJa: string;
  icon: string;
  color: string;
}> = [
  { id: 'all', label: 'Tất cả', labelEn: 'All', labelJa: 'すべて', icon: '🧭', color: '#133e2f' },
  { id: 'sightseeing', label: 'Điểm tham quan', labelEn: 'Attractions', labelJa: '観光スポット', icon: '🏛️', color: '#059669' },
  { id: 'food', label: 'Ăn uống', labelEn: 'Food & Drink', labelJa: 'グルメ', icon: '🍲', color: '#ea580c' },
  { id: 'hotel', label: 'Khách sạn & Lưu trú', labelEn: 'Hotels & Stays', labelJa: '宿泊', icon: '🏨', color: '#2563eb' },
  { id: 'parking', label: 'Bãi đỗ xe', labelEn: 'Parking', labelJa: '駐車場', icon: '🅿️', color: '#4f46e5' },
  { id: 'fuel', label: 'Cây xăng & Cứu hộ', labelEn: 'Fuel & Rescue', labelJa: '給油・救援', icon: '⛽', color: '#d97706' },
  { id: 'user_pin', label: 'Cộng đồng ghim', labelEn: 'Community Pins', labelJa: 'みんなのピン', icon: '📌', color: '#db2777' },
];

function parsePlaceLatLng(place: Place): { lat: number; lng: number } {
  if (FALLBACK_PLACE_COORDS[place.id]) {
    const raw = (place.coordinates || '').split(',');
    const nums = raw.map((s) => parseFloat(s.replace(/[^0-9.]/g, ''))).filter((n) => Number.isFinite(n));
    if (nums.length >= 2 && nums[0] >= 15.5 && nums[0] <= 18.5 && nums[1] >= 105.5 && nums[1] <= 108.5) {
      return { lat: nums[0], lng: nums[1] };
    }
    return FALLBACK_PLACE_COORDS[place.id];
  }
  const nums = (place.coordinates || '')
    .split(',')
    .map((s) => parseFloat(s.replace(/[^0-9.]/g, '')))
    .filter((n) => Number.isFinite(n));
  if (nums.length >= 2) {
    return { lat: nums[0], lng: nums[1] };
  }
  const zoneMeta = DEFAULT_ZONE_META[place.zoneCode];
  return {
    lat: zoneMeta?.lat ?? 16.8163,
    lng: zoneMeta?.lon ?? 107.1003,
  };
}

function findNearestZoneCode(lat: number, lng: number): string {
  let bestCode = 'QT-01';
  let bestDist = Infinity;
  for (const [code, meta] of Object.entries(DEFAULT_ZONE_META)) {
    const dLat = lat - meta.lat;
    const dLon = lng - meta.lon;
    const dist = dLat * dLat + dLon * dLon;
    if (dist < bestDist) {
      bestDist = dist;
      bestCode = code;
    }
  }
  return bestCode;
}

function getCategoryMeta(cat: Exclude<MapPoiCategory, 'all'>) {
  return CATEGORY_TABS.find((t) => t.id === cat) || CATEGORY_TABS[1];
}

let leafletLoadPromise: Promise<any> | null = null;

function loadLeafletFromCdn(): Promise<any> {
  if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
  const w = window as any;
  if (w.L && typeof w.L.map === 'function') {
    return Promise.resolve(w.L);
  }
  if (leafletLoadPromise) return leafletLoadPromise;

  leafletLoadPromise = new Promise((resolve, reject) => {
    if (!document.getElementById('leaflet-cdn-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-cdn-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.onerror = () => {
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
      };
      document.head.appendChild(link);
    }

    const script = document.createElement('script');
    script.id = 'leaflet-cdn-js';
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.async = true;
    script.onload = () => {
      if (w.L) resolve(w.L);
      else reject(new Error('Leaflet failed to initialize'));
    };
    script.onerror = () => {
      const fallback = document.createElement('script');
      fallback.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js';
      fallback.async = true;
      fallback.onload = () => {
        if (w.L) resolve(w.L);
        else reject(new Error('Leaflet fallback failed'));
      };
      fallback.onerror = () => reject(new Error('Leaflet network error'));
      document.head.appendChild(fallback);
    };
    document.head.appendChild(script);
  });

  return leafletLoadPromise;
}

export default function QuangTriInteractiveMap({
  places = [],
  foods = [],
  services = [],
  zones = [],
  selectedZone: externalZone,
  onSelectZone,
  onOpenModal,
  bookmarkedIds = [],
  onToggleBookmark,
  defaultSidebarCollapsed = false,
}: Props) {
  const { showToast } = useToast();
  const { lang } = useLanguage();

  const [activeCategory, setActiveCategory] = useState<MapPoiCategory>('all');
  const [internalZone, setInternalZone] = useState<string>('all');
  const activeZone = externalZone !== undefined ? externalZone : internalZone;

  const [mapSearch, setMapSearch] = useState('');
  const [baseLayer, setBaseLayer] = useState<MapBaseLayer>('street');
  const [selectedPoiId, setSelectedPoiId] = useState<string>('thanh-co-quang-tri');
  const [userPins, setUserPins] = useState<MapPoiItem[]>([]);
  const [isPinningMode, setIsPinningMode] = useState(false);
  const [draftPinCoords, setDraftPinCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [isPinDrawerOpen, setIsPinDrawerOpen] = useState(false);
  const [internalModalPlace, setInternalModalPlace] = useState<Place | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(defaultSidebarCollapsed);
  const [isInfoCardVisible, setIsInfoCardVisible] = useState(true);
  const [leafletReady, setLeafletReady] = useState(false);
  const [leafletFailed, setLeafletFailed] = useState(false);

  // Pin form states
  const [pinName, setPinName] = useState('');
  const [pinCategory, setPinCategory] = useState<Exclude<MapPoiCategory, 'all' | 'user_pin'>>('sightseeing');
  const [pinZoneCode, setPinZoneCode] = useState('QT-01');
  const [pinAddress, setPinAddress] = useState('');
  const [pinPriceOrHours, setPinPriceOrHours] = useState('');
  const [pinDescription, setPinDescription] = useState('');
  const [pinContributor, setPinContributor] = useState('');
  const [pinImage, setPinImage] = useState('');

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const draftMarkerRef = useRef<any>(null);
  const isPinningModeRef = useRef(isPinningMode);
  isPinningModeRef.current = isPinningMode;

  // Load community pins from Supabase /api/map-pins + localStorage fallback
  useEffect(() => {
    let localPins: MapPoiItem[] = [];
    try {
      const raw = localStorage.getItem(USER_PINS_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) localPins = parsed;
      }
    } catch {
      // ignore storage errors
    }
    if (localPins.length > 0) setUserPins(localPins);

    fetch('/api/map-pins')
      .then((r) => r.json())
      .then((res) => {
        if (Array.isArray(res?.pins) && res.pins.length > 0) {
          const seen = new Set<string>();
          const merged: MapPoiItem[] = [];
          for (const p of [...res.pins, ...localPins]) {
            if (!seen.has(p.id)) {
              seen.add(p.id);
              merged.push(p);
            }
          }
          setUserPins(merged);
        }
      })
      .catch(() => {
        // keep local pins if offline
      });
  }, []);

  const saveUserPins = useCallback((nextPins: MapPoiItem[]) => {
    setUserPins(nextPins);
    try {
      localStorage.setItem(USER_PINS_STORAGE_KEY, JSON.stringify(nextPins));
    } catch {
      // ignore storage quota errors
    }
  }, []);

  const zoneOptions = useMemo(() => {
    if (Array.isArray(zones) && zones.length > 0) {
      return zones.map((z) => ({
        code: z.code,
        name: z.name,
        lat: z.lat ?? DEFAULT_ZONE_META[z.code]?.lat ?? 16.8163,
        lon: z.lon ?? DEFAULT_ZONE_META[z.code]?.lon ?? 107.1003,
        specialty: z.specialty || DEFAULT_ZONE_META[z.code]?.specialty || '',
      }));
    }
    return Object.entries(DEFAULT_ZONE_META).map(([code, meta]) => ({
      code,
      name: meta.weatherRegionLabel,
      lat: meta.lat,
      lon: meta.lon,
      specialty: meta.specialty,
    }));
  }, [zones]);

  // Build unified POI database across all categories
  const allPois = useMemo<MapPoiItem[]>(() => {
    const placePois: MapPoiItem[] = places.map((p) => {
      const coords = parsePlaceLatLng(p);
      return {
        id: p.id,
        name: p.name,
        category: 'sightseeing',
        categoryLabel: p.categoryName || 'Điểm tham quan',
        zoneCode: p.zoneCode,
        zoneName: p.zoneName,
        lat: coords.lat,
        lng: coords.lng,
        address: p.address || p.zoneName,
        priceOrHours: `${p.ticket || 'Miễn phí'} · ${p.openHours || 'Cả ngày'}`,
        rating: p.rating || 4.9,
        description: p.shortDesc,
        image: p.image || p.hero_image,
        rawPlace: p,
      };
    });

    // Convert dynamic DB foods into map pins if not already covered
    const dynamicFoodPois: MapPoiItem[] = foods.map((f, idx) => {
      const matchingCurated = CURATED_FOOD_POIS.find((cf) =>
        cf.name.toLowerCase().includes(f.name.split('(')[0].trim().toLowerCase())
      );
      if (matchingCurated) {
        return {
          ...matchingCurated,
          id: `food-db-${f.id}`,
          name: f.name,
          priceOrHours: f.priceRange || matchingCurated.priceOrHours,
          description: f.tasteNotes || f.description || matchingCurated.description,
          address: f.addressRecs?.[0] || matchingCurated.address,
          image: f.image || matchingCurated.image,
        };
      }
      const originLower = (f.origin || '').toLowerCase();
      const zoneCode = originLower.includes('hướng hóa') || originLower.includes('khe sanh')
        ? 'QT-05'
        : originLower.includes('gio linh') || originLower.includes('mai xá')
        ? 'QT-04'
        : originLower.includes('hải lăng') || originLower.includes('mỹ chánh')
        ? 'QT-02'
        : originLower.includes('cam lộ') || originLower.includes('cùa')
        ? 'QT-08'
        : originLower.includes('cồn cỏ')
        ? 'QT-07'
        : originLower.includes('phong nha') || originLower.includes('bố trạch')
        ? 'QT-10'
        : originLower.includes('đồng hới') || originLower.includes('nhật lệ')
        ? 'QT-09'
        : originLower.includes('vũng chùa') || originLower.includes('đèo ngang')
        ? 'QT-11'
        : originLower.includes('lệ thủy')
        ? 'QT-12'
        : 'QT-01';
      const meta = DEFAULT_ZONE_META[zoneCode] || DEFAULT_ZONE_META['QT-01'];
      const offset = (idx % 5) * 0.008 - 0.012;
      return {
        id: `food-db-${f.id}`,
        name: f.name,
        category: 'food',
        categoryLabel: f.type || 'Đặc sản bản địa',
        zoneCode,
        zoneName: f.origin || 'Quảng Trị',
        lat: meta.lat + offset,
        lng: meta.lon - offset,
        address: f.addressRecs?.[0] || f.origin,
        priceOrHours: f.priceRange || 'Đặc sản địa phương',
        rating: 4.9,
        description: f.tasteNotes || f.description,
        image: f.image,
      };
    });

    const foodList = dynamicFoodPois.length >= 4 ? [...dynamicFoodPois, ...CURATED_FOOD_POIS.slice(3)] : CURATED_FOOD_POIS;

    // Convert dynamic DB services into hotel/service pins
    const servicePois: MapPoiItem[] = services.map((s, idx) => {
      const meta = DEFAULT_ZONE_META[s.zoneCode] || DEFAULT_ZONE_META['QT-01'];
      const angle = (idx + 1) * 1.3;
      const radius = 0.011;
      return {
        id: `srv-${s.id}`,
        name: s.name,
        category: 'hotel',
        categoryLabel: s.typeLabel || 'Lưu trú & Dịch vụ',
        zoneCode: s.zoneCode,
        zoneName: s.zoneName,
        lat: meta.lat + Math.sin(angle) * radius,
        lng: meta.lon + Math.cos(angle) * radius,
        address: s.address,
        priceOrHours: s.price,
        rating: s.rating,
        description: `${s.typeLabel} xác minh tại ${s.zoneName}. Liên hệ trực tiếp hotline ${s.phone}.`,
        image: s.image,
        phone: s.phone,
      };
    });

    const hotelList = [...servicePois, ...CURATED_HOTEL_POIS];

    return [
      ...placePois,
      ...foodList,
      ...hotelList,
      ...CURATED_PARKING_POIS,
      ...CURATED_FUEL_POIS,
      ...userPins,
    ];
  }, [places, foods, services, userPins]);

  // Counts per category under current zone & search filter
  const categoryCounts = useMemo(() => {
    const q = mapSearch.trim().toLowerCase();
    const zoneScoped = allPois.filter((item) => {
      const matchZone = activeZone === 'all' || item.zoneCode === activeZone;
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.zoneName.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchZone && matchQuery;
    });

    return {
      all: zoneScoped.length,
      sightseeing: zoneScoped.filter((i) => i.category === 'sightseeing').length,
      food: zoneScoped.filter((i) => i.category === 'food').length,
      hotel: zoneScoped.filter((i) => i.category === 'hotel').length,
      parking: zoneScoped.filter((i) => i.category === 'parking').length,
      fuel: zoneScoped.filter((i) => i.category === 'fuel').length,
      user_pin: zoneScoped.filter((i) => i.isUserPin || i.category === 'user_pin').length,
    };
  }, [allPois, activeZone, mapSearch]);

  // Filtered POIs displayed on the map and sidebar
  const filteredPois = useMemo(() => {
    const q = mapSearch.trim().toLowerCase();
    return allPois.filter((item) => {
      const matchZone = activeZone === 'all' || item.zoneCode === activeZone;
      const matchCat =
        activeCategory === 'all'
          ? true
          : activeCategory === 'user_pin'
          ? Boolean(item.isUserPin)
          : item.category === activeCategory;
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.address.toLowerCase().includes(q) ||
        item.zoneName.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchZone && matchCat && matchQuery;
    });
  }, [allPois, activeZone, activeCategory, mapSearch]);

  const selectedPoi = useMemo(() => {
    return (
      filteredPois.find((p) => p.id === selectedPoiId) ||
      allPois.find((p) => p.id === selectedPoiId) ||
      filteredPois[0] ||
      allPois[0] ||
      null
    );
  }, [filteredPois, allPois, selectedPoiId]);

  const handleZoneChange = useCallback(
    (code: string) => {
      const next = code === activeZone && code !== 'all' ? 'all' : code;
      if (onSelectZone) {
        onSelectZone(next);
      } else {
        setInternalZone(next);
      }

      const map = mapInstanceRef.current;
      if (map) {
        if (next === 'all') {
          map.flyTo([17.22, 106.82], 9, { duration: 0.9 });
        } else {
          const z = zoneOptions.find((zo) => zo.code === next);
          if (z) {
            map.flyTo([z.lat, z.lon], 12, { duration: 0.9 });
          }
        }
      }
    },
    [activeZone, onSelectZone, zoneOptions]
  );

  // Initialize Leaflet map
  useEffect(() => {
    let cancelled = false;

    loadLeafletFromCdn()
      .then((L) => {
        if (cancelled || !mapContainerRef.current) return;
        if (mapInstanceRef.current) {
          setLeafletReady(true);
          return;
        }

        const map = L.map(mapContainerRef.current, {
          center: [17.22, 106.82],
          zoom: 9,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        const tileLayer = L.tileLayer(
          'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
            maxZoom: 19,
          }
        ).addTo(map);

        const markersLayer = L.layerGroup().addTo(map);

        map.on('click', (e: any) => {
          const lat = Number(e.latlng.lat.toFixed(5));
          const lng = Number(e.latlng.lng.toFixed(5));
          if (isPinningModeRef.current) {
            setDraftPinCoords({ lat, lng });
            setPinZoneCode(findNearestZoneCode(lat, lng));
            setIsPinDrawerOpen(true);
          }
        });

        mapInstanceRef.current = map;
        tileLayerRef.current = tileLayer;
        markersLayerRef.current = markersLayer;
        setLeafletReady(true);
      })
      .catch(() => {
        if (!cancelled) setLeafletFailed(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // Cleanup map instance on unmount
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Switch Base Tile Layer (Street / Satellite / Terrain)
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current);
    }

    let url = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
    let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

    if (baseLayer === 'satellite') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri';
    } else if (baseLayer === 'terrain') {
      url = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}';
      attribution = 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap';
    }

    tileLayerRef.current = L.tileLayer(url, {
      attribution,
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);
  }, [baseLayer, leafletReady]);

  // Render Draft Pin Marker when user clicks on map in Pinning Mode
  useEffect(() => {
    if (!leafletReady || !mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    if (draftMarkerRef.current) {
      mapInstanceRef.current.removeLayer(draftMarkerRef.current);
      draftMarkerRef.current = null;
    }

    if (draftPinCoords) {
      const icon = L.divIcon({
        className: 'gmap-custom-div-icon',
        html: `
          <div class="gmap-pin-marker is-draft">
            <span class="gmap-pin-bubble" style="background:#db2777">📌</span>
            <span class="gmap-pin-label">Vị trí ghim mới</span>
          </div>
        `,
        iconSize: [40, 46],
        iconAnchor: [20, 42],
      });

      const marker = L.marker([draftPinCoords.lat, draftPinCoords.lng], {
        icon,
        draggable: true,
      }).addTo(mapInstanceRef.current);

      marker.on('dragend', (ev: any) => {
        const pos = ev.target.getLatLng();
        const lat = Number(pos.lat.toFixed(5));
        const lng = Number(pos.lng.toFixed(5));
        setDraftPinCoords({ lat, lng });
        setPinZoneCode(findNearestZoneCode(lat, lng));
      });

      draftMarkerRef.current = marker;
    }
  }, [draftPinCoords, leafletReady]);

  // Render all filtered POI markers onto Leaflet layerGroup
  useEffect(() => {
    if (!leafletReady || !markersLayerRef.current || !mapInstanceRef.current) return;
    const L = (window as any).L;
    if (!L) return;

    const layerGroup = markersLayerRef.current;
    layerGroup.clearLayers();

    filteredPois.forEach((poi) => {
      const isSelected = selectedPoi?.id === poi.id;
      const catMeta = getCategoryMeta(poi.isUserPin ? 'user_pin' : poi.category);
      const safeTitle = poi.name.replace(/"/g, '&quot;');

      const icon = L.divIcon({
        className: 'gmap-custom-div-icon',
        html: `
          <div class="gmap-pin-marker ${isSelected ? 'is-active' : ''}" title="${safeTitle}">
            <span class="gmap-pin-bubble" style="background:${catMeta.color}">
              ${catMeta.icon}
            </span>
            <span class="gmap-pin-label">${poi.name}</span>
          </div>
        `,
        iconSize: [38, 44],
        iconAnchor: [19, 40],
      });

      const marker = L.marker([poi.lat, poi.lng], { icon });
      marker.on('click', () => {
        setSelectedPoiId(poi.id);
        setIsInfoCardVisible(true);
        mapInstanceRef.current?.flyTo([poi.lat, poi.lng], Math.max(mapInstanceRef.current.getZoom(), 12), {
          duration: 0.7,
        });
      });

      layerGroup.addLayer(marker);
    });
  }, [filteredPois, selectedPoi?.id, leafletReady]);

  const handleFocusPoi = (poi: MapPoiItem) => {
    setSelectedPoiId(poi.id);
    setIsInfoCardVisible(true);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([poi.lat, poi.lng], Math.max(mapInstanceRef.current.getZoom(), 12), {
        duration: 0.75,
      });
    }
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
    setTimeout(() => {
      mapInstanceRef.current?.invalidateSize?.();
    }, 260);
  };

  const handleStartPinMode = () => {
    if (isPinningMode) {
      setIsPinningMode(false);
      setDraftPinCoords(null);
      setIsPinDrawerOpen(false);
      return;
    }
    setIsPinningMode(true);
    const center = mapInstanceRef.current?.getCenter?.();
    const lat = center ? Number(center.lat.toFixed(5)) : 16.8163;
    const lng = center ? Number(center.lng.toFixed(5)) : 107.1003;
    setDraftPinCoords({ lat, lng });
    setPinZoneCode(findNearestZoneCode(lat, lng));
    setIsPinDrawerOpen(true);
    showToast('Chạm/click vào bản đồ hoặc kéo ghim hồng để chọn đúng vị trí địa điểm!', 'info');
  };

  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Trình duyệt không hỗ trợ định vị GPS.', 'error');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = Number(pos.coords.latitude.toFixed(5));
        const lng = Number(pos.coords.longitude.toFixed(5));
        mapInstanceRef.current?.flyTo([lat, lng], 14, { duration: 0.9 });
        if (isPinningMode) {
          setDraftPinCoords({ lat, lng });
          setPinZoneCode(findNearestZoneCode(lat, lng));
          setIsPinDrawerOpen(true);
        }
        showToast(`Đã định vị GPS: ${lat}°N, ${lng}°E`);
      },
      () => {
        showToast('Không thể truy cập GPS. Hãy cấp quyền vị trí hoặc click trực tiếp lên bản đồ.', 'info');
      }
    );
  };

  const handleSaveUserPin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pinName.trim() || !draftPinCoords) {
      showToast(
        lang === 'en'
          ? 'Please enter a place name and pick coordinates on the map.'
          : 'Vui lòng nhập tên địa điểm và chọn tọa độ trên bản đồ.',
        'error'
      );
      return;
    }

    const zoneObj = zoneOptions.find((z) => z.code === pinZoneCode);
    const catMeta = getCategoryMeta(pinCategory);

    const draftPin: MapPoiItem = {
      id: `user-pin-${Date.now()}`,
      name: pinName.trim(),
      category: pinCategory,
      categoryLabel: `${catMeta.label} · Cộng đồng ghim`,
      zoneCode: pinZoneCode,
      zoneName: zoneObj?.name || pinZoneCode,
      lat: draftPinCoords.lat,
      lng: draftPinCoords.lng,
      address: pinAddress.trim() || `Tọa độ ${draftPinCoords.lat}°N, ${draftPinCoords.lng}°E`,
      priceOrHours: pinPriceOrHours.trim() || 'Cập nhật bởi cộng đồng',
      rating: 5.0,
      description:
        pinDescription.trim() ||
        `Địa điểm được đóng góp bởi ${pinContributor.trim() || 'Phượt thủ cộng đồng'}.`,
      image:
        pinImage.trim() ||
        '/images/phong-nha-cave.jpg',
      contributor: pinContributor.trim() || 'Phượt thủ Quảng Trị',
      isUserPin: true,
    };

    let savedPin = draftPin;
    let savedToServer = false;
    try {
      const res = await fetch('/api/map-pins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draftPin),
      });
      const json = await res.json();
      if (res.ok && json?.success && json?.pin) {
        savedPin = json.pin;
        savedToServer = true;
      }
    } catch {
      // fallback to localStorage below
    }

    const updated = [savedPin, ...userPins.filter((p) => p.id !== savedPin.id)];
    saveUserPins(updated);
    setSelectedPoiId(savedPin.id);
    setIsPinningMode(false);
    setIsPinDrawerOpen(false);
    setDraftPinCoords(null);
    setPinName('');
    setPinAddress('');
    setPinPriceOrHours('');
    setPinDescription('');
    setPinImage('');

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([savedPin.lat, savedPin.lng], 13, { duration: 0.8 });
    }
    showToast(
      savedToServer
        ? `Đã lưu ghim "${savedPin.name}" lên Database cộng đồng!`
        : `Đã ghim "${savedPin.name}" lên bản đồ!`
    );
  };

  const handleDeleteUserPin = (pinId: string, pinLabel: string) => {
    const next = userPins.filter((p) => p.id !== pinId);
    saveUserPins(next);
    showToast(`Đã xóa ghim "${pinLabel}".`);
  };

  const handleOpenPlaceDetail = (place: Place) => {
    if (onOpenModal) {
      onOpenModal(place);
    } else {
      setInternalModalPlace(place);
    }
  };

  return (
    <div className="gmap-shell">
      {/* 1. Google-Maps-Style Top Toolbar: Category Chips + Pin Button + Search */}
      <div className="gmap-toolbar">
        <div className="gmap-toolbar-top">
          {/* Category Filter Chips (Ăn uống, Khách sạn, Điểm tham quan, Bãi đỗ xe, Cây xăng...) */}
          <div className="gmap-cat-pills" role="tablist" aria-label="Bộ lọc loại địa điểm trên bản đồ">
            {CATEGORY_TABS.map((tab) => {
              const isActive = activeCategory === tab.id;
              const count = categoryCounts[tab.id] ?? 0;
              return (
                <button
                  type="button"
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`gmap-cat-pill ${isActive ? 'active' : ''}`}
                  style={
                    isActive
                      ? { backgroundColor: tab.color, borderColor: tab.color, color: '#ffffff' }
                      : undefined
                  }
                >
                  <span>{tab.icon}</span>
                  <span>
                    {lang === 'en' ? tab.labelEn : lang === 'ja' ? tab.labelJa : tab.label}
                  </span>
                  <span className="gmap-cat-count">{count}</span>
                </button>
              );
            })}
          </div>

          {/* Search & User Pin Action */}
          <div className="gmap-actions-right">
            <div className="gmap-search-mini">
              <span>🔍</span>
              <input
                type="text"
                value={mapSearch}
                onChange={(e) => setMapSearch(e.target.value)}
                placeholder={
                  lang === 'en'
                    ? 'Search food, hotels, parking...'
                    : lang === 'ja'
                    ? '飲食店、ホテル、駐車場を検索...'
                    : 'Tìm quán ăn, khách sạn, bãi đỗ xe...'
                }
                aria-label={lang === 'en' ? 'Search map' : 'Tìm địa điểm trên bản đồ'}
              />
              {mapSearch && (
                <button type="button" onClick={() => setMapSearch('')} aria-label="Xóa tìm kiếm">
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleStartPinMode}
              className={`gmap-add-pin-btn ${isPinningMode ? 'active' : ''}`}
            >
              <span>📌</span>
              <span>
                {isPinningMode
                  ? lang === 'en'
                    ? 'Pinning (Click to cancel)'
                    : lang === 'ja'
                    ? 'ピン配置中 (キャンセル)'
                    : 'Đang ghim (Bấm để hủy)'
                  : lang === 'en'
                  ? '+ Pin New Place'
                  : lang === 'ja'
                  ? '+ スポットをピン留め'
                  : '+ Ghim địa điểm mới'}
              </span>
            </button>
          </div>
        </div>

        {/* Integrated 8-Zones Quick Selector Bar (Replaces the old standalone 8-Zones section) */}
        <div className="gmap-zone-bar" aria-label="Chọn nhanh 8 phân vùng Quảng Trị trên bản đồ">
          <span className="gmap-zone-label">🗺️ Vùng:</span>
          <button
            type="button"
            onClick={() => handleZoneChange('all')}
            className={`gmap-zone-chip ${activeZone === 'all' ? 'active' : ''}`}
          >
            Toàn tỉnh ({zoneOptions.length} vùng)
          </button>
          {zoneOptions.map((z) => (
            <button
              type="button"
              key={z.code}
              onClick={() => handleZoneChange(z.code)}
              title={z.specialty ? `${z.name} · Đặc sản: ${z.specialty}` : z.name}
              className={`gmap-zone-chip ${activeZone === z.code ? 'active' : ''}`}
            >
              <strong>{z.code}</strong>
              <span>{z.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Pin Mode Active Instruction Banner */}
      {isPinningMode && (
        <div className="gmap-pin-banner">
          <div>
            <strong>📌 Chế độ ghim địa điểm:</strong> Click vào bất kỳ vị trí nào trên bản đồ (hoặc kéo ghim màu hồng) để lấy tọa độ GPS chính xác và điền thông tin địa điểm.
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <button type="button" onClick={handleLocateMe} className="gmap-banner-btn">
              🎯 Lấy vị trí của tôi
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPinningMode(false);
                setDraftPinCoords(null);
                setIsPinDrawerOpen(false);
              }}
              className="gmap-banner-btn cancel"
            >
              ✕ Thoát chế độ ghim
            </button>
          </div>
        </div>
      )}

      {/* 2. Main Split View: Left POI Explorer Sidebar (collapsible) + Right Google-Maps-Style Canvas */}
      <div className={`gmap-main-split ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        {/* Left List Panel (like Google Maps Left Drawer) */}
        {!isSidebarCollapsed && (
          <aside className="gmap-side-list" aria-label="Danh sách địa điểm trên bản đồ">
            <div className="gmap-side-head">
              <div>
                <strong>{filteredPois.length} địa điểm trên bản đồ</strong>
                <span>
                  {activeZone === 'all' ? 'Toàn tỉnh Quảng Trị' : `Đang lọc vùng ${activeZone}`}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {(activeCategory !== 'all' || activeZone !== 'all' || mapSearch.trim() !== '') && (
                  <button
                    type="button"
                    onClick={() => {
                      setActiveCategory('all');
                      handleZoneChange('all');
                      setMapSearch('');
                    }}
                    className="gmap-reset-link"
                  >
                    Đặt lại
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleToggleSidebar}
                  className="gmap-collapse-btn"
                  title="Thu gọn danh sách để mở rộng bản đồ"
                >
                  ◀ Thu gọn
                </button>
              </div>
            </div>

            <div className="gmap-poi-scroll">
              {filteredPois.length === 0 ? (
                <div className="gmap-empty-box">
                  <p>Chưa có địa điểm nào khớp bộ lọc này.</p>
                  <button
                    type="button"
                    onClick={handleStartPinMode}
                    className="gmap-empty-pin-cta"
                  >
                    📌 + Ghim bổ sung địa điểm tại đây
                  </button>
                </div>
              ) : (
                filteredPois.map((poi) => {
                  const isSelected = selectedPoi?.id === poi.id;
                  const catMeta = getCategoryMeta(poi.isUserPin ? 'user_pin' : poi.category);
                  return (
                    <div
                      key={poi.id}
                      onClick={() => handleFocusPoi(poi)}
                      className={`gmap-poi-row ${isSelected ? 'active' : ''}`}
                    >
                      <span
                        className="gmap-poi-icon"
                        style={{ backgroundColor: `${catMeta.color}15`, color: catMeta.color }}
                      >
                        {catMeta.icon}
                      </span>
                      <div className="gmap-poi-body">
                        <div className="gmap-poi-meta">
                          <span className="gmap-poi-zone">{poi.zoneCode}</span>
                          <span className="gmap-poi-cat" style={{ color: catMeta.color }}>
                            {poi.categoryLabel}
                          </span>
                          {poi.rating && <span className="gmap-poi-rate">★ {poi.rating}</span>}
                        </div>
                        <h4 className="gmap-poi-title">{poi.name}</h4>
                        <p className="gmap-poi-addr">📍 {poi.address}</p>
                        <span className="gmap-poi-price">{poi.priceOrHours}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* Right Interactive Leaflet Map Canvas */}
        <div className={`gmap-canvas-wrap ${isPinningMode ? 'pin-cursor' : ''}`}>
          {isSidebarCollapsed && (
            <button
              type="button"
              onClick={handleToggleSidebar}
              className="gmap-expand-sidebar-btn"
              title="Mở danh sách địa điểm"
            >
              ▶ Danh sách ({filteredPois.length})
            </button>
          )}
          {/* Floating Map Type Switcher (Street / Satellite / Terrain) + Locate button */}
          <div className="gmap-layer-switcher" role="group" aria-label="Chế độ bản đồ">
            <button
              type="button"
              onClick={() => setBaseLayer('street')}
              className={baseLayer === 'street' ? 'active' : ''}
            >
              🗺️ Đường phố
            </button>
            <button
              type="button"
              onClick={() => setBaseLayer('satellite')}
              className={baseLayer === 'satellite' ? 'active' : ''}
            >
              🛰️ Vệ tinh
            </button>
            <button
              type="button"
              onClick={() => setBaseLayer('terrain')}
              className={baseLayer === 'terrain' ? 'active' : ''}
            >
              ⛰️ Địa hình
            </button>
            <button
              type="button"
              onClick={handleLocateMe}
              title="Định vị GPS của tôi"
              className="gmap-gps-btn"
            >
              🎯 Vị trí
            </button>
          </div>

          {/* The Leaflet DOM Container */}
          <div ref={mapContainerRef} className="gmap-leaflet-canvas" />

          {/* Loading or Offline Fallback Overlay */}
          {!leafletReady && !leafletFailed && (
            <div className="gmap-loading-overlay">
              <span>🧭 Đang khởi tạo bản đồ tương tác Quảng Trị...</span>
            </div>
          )}

          {leafletFailed && (
            <div className="gmap-loading-overlay">
              <div style={{ textAlign: 'center', maxWidth: '420px', padding: '1rem' }}>
                <strong>⚠️ Chế độ ngoại tuyến</strong>
                <p style={{ fontSize: '0.85rem', marginTop: '0.35rem', opacity: 0.9 }}>
                  Không tải được lớp bản đồ trực tuyến. Bạn vẫn có thể chọn từng địa điểm ở danh sách bên trái và mở chỉ đường Google Maps.
                </p>
              </div>
            </div>
          )}

          {/* 3. User Pin Contribution Drawer (Opens when user clicks "+ Ghim địa điểm mới" / clicks map) */}
          {isPinDrawerOpen && draftPinCoords && (
            <div className="gmap-pin-form-drawer" role="dialog" aria-label="Ghim bổ sung địa điểm mới">
              <div className="gmap-drawer-head">
                <div>
                  <span className="gmap-drawer-kicker">📌 ĐÓNG GÓP ĐỊA ĐIỂM CỘNG ĐỒNG</span>
                  <h4>Ghim Địa Điểm Mới Lên Bản Đồ</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsPinDrawerOpen(false);
                    setIsPinningMode(false);
                    setDraftPinCoords(null);
                  }}
                  className="gmap-drawer-close"
                  aria-label="Đóng"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveUserPin} className="gmap-pin-form">
                <div className="gmap-coord-readout">
                  <span>📍 Tọa độ đã chọn:</span>
                  <strong>
                    {draftPinCoords.lat}° N, {draftPinCoords.lng}° E
                  </strong>
                  <small>(Click lên bản đồ để đổi vị trí)</small>
                </div>

                <div className="gmap-form-row-2">
                  <div>
                    <label>Loại địa điểm *</label>
                    <select
                      value={pinCategory}
                      onChange={(e) => setPinCategory(e.target.value as any)}
                    >
                      <option value="sightseeing">🏛️ Điểm tham quan / Check-in</option>
                      <option value="food">🍲 Quán ăn / Đặc sản / Cafe</option>
                      <option value="hotel">🏨 Khách sạn / Homestay</option>
                      <option value="parking">🅿️ Bãi đỗ xe / Trạm nghỉ</option>
                      <option value="fuel">⛽ Cây xăng / Sửa xe cứu hộ</option>
                    </select>
                  </div>
                  <div>
                    <label>Khu vực *</label>
                    <select
                      value={pinZoneCode}
                      onChange={(e) => setPinZoneCode(e.target.value)}
                    >
                      {zoneOptions.map((z) => (
                        <option key={z.code} value={z.code}>
                          {z.code} · {z.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label>Tên địa điểm *</label>
                  <input
                    type="text"
                    required
                    value={pinName}
                    onChange={(e) => setPinName(e.target.value)}
                    placeholder="VD: Bãi đỗ xe miễn phí chợ Đông Hà, Quán bún hến O Hương..."
                  />
                </div>

                <div className="gmap-form-row-2">
                  <div>
                    <label>Địa chỉ / Chỉ dẫn</label>
                    <input
                      type="text"
                      value={pinAddress}
                      onChange={(e) => setPinAddress(e.target.value)}
                      placeholder="VD: Cách cầu Hiền Lương 200m"
                    />
                  </div>
                  <div>
                    <label>Giá vé / Giá món / Giờ mở cửa</label>
                    <input
                      type="text"
                      value={pinPriceOrHours}
                      onChange={(e) => setPinPriceOrHours(e.target.value)}
                      placeholder="VD: Miễn phí · 06:00 - 22:00"
                    />
                  </div>
                </div>

                <div>
                  <label>Kinh nghiệm & Ghi chú bổ sung</label>
                  <textarea
                    rows={2}
                    value={pinDescription}
                    onChange={(e) => setPinDescription(e.target.value)}
                    placeholder="Chia sẻ kinh nghiệm đỗ xe, món ngon nên thử, lưu ý đường đi..."
                  />
                </div>

                <div className="gmap-form-row-2">
                  <div>
                    <label>Tên của bạn (Tùy chọn)</label>
                    <input
                      type="text"
                      value={pinContributor}
                      onChange={(e) => setPinContributor(e.target.value)}
                      placeholder="VD: Minh Tuấn (Phượt thủ)"
                    />
                  </div>
                  <div>
                    <label>Link ảnh minh họa (Tùy chọn)</label>
                    <input
                      type="url"
                      value={pinImage}
                      onChange={(e) => setPinImage(e.target.value)}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="gmap-form-actions">
                  <button
                    type="button"
                    onClick={() => {
                      setIsPinDrawerOpen(false);
                      setIsPinningMode(false);
                      setDraftPinCoords(null);
                    }}
                    className="gmap-btn-cancel"
                  >
                    Hủy
                  </button>
                  <button type="submit" className="gmap-btn-submit">
                    📌 Lưu Ghim Lên Bản Đồ
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* 4. Floating Selected POI Info Card (Dismissible) */}
          {selectedPoi && isInfoCardVisible && !isPinDrawerOpen && (
            <div className="gmap-info-card">
              <button
                type="button"
                onClick={() => setIsInfoCardVisible(false)}
                className="gmap-info-close-btn"
                title="Thu gọn thẻ thông tin"
                aria-label="Đóng thẻ thông tin"
              >
                ✕
              </button>
              {selectedPoi.image && (
                <div className="gmap-info-thumb">
                  <SafeImage
                    src={selectedPoi.image}
                    alt={selectedPoi.name}
                    fill
                    sizes="120px"
                  />
                </div>
              )}

              <div className="gmap-info-content">
                <div className="gmap-info-top">
                  <span
                    className="gmap-info-badge"
                    style={{
                      backgroundColor: getCategoryMeta(
                        selectedPoi.isUserPin ? 'user_pin' : selectedPoi.category
                      ).color,
                    }}
                  >
                    {getCategoryMeta(selectedPoi.isUserPin ? 'user_pin' : selectedPoi.category).icon}{' '}
                    {selectedPoi.categoryLabel}
                  </span>
                  <span className="gmap-info-zone">
                    {selectedPoi.zoneCode} · {selectedPoi.zoneName}
                  </span>
                  {selectedPoi.rating && (
                    <span className="gmap-info-rating">★ {selectedPoi.rating}</span>
                  )}
                </div>

                <h3 className="gmap-info-title">{selectedPoi.name}</h3>
                <p className="gmap-info-desc">{selectedPoi.description}</p>

                <div className="gmap-info-meta-grid">
                  <span>📍 {selectedPoi.address}</span>
                  <span>🏷️ {formatDualCurrency(selectedPoi.priceOrHours, lang)}</span>
                  <span>
                    🧭 {selectedPoi.lat.toFixed(4)}°N, {selectedPoi.lng.toFixed(4)}°E
                  </span>
                  {selectedPoi.contributor && (
                    <span>👤 {lang === 'en' ? 'By:' : 'Đóng góp:'} {selectedPoi.contributor}</span>
                  )}
                </div>

                <div className="gmap-info-actions">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPoi.lat},${selectedPoi.lng}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="gmap-action-btn primary"
                  >
                    🧭{' '}
                    {lang === 'en'
                      ? 'Google Maps Directions ↗'
                      : lang === 'ja'
                      ? 'Googleマップで経路案内 ↗'
                      : 'Chỉ đường Google Maps ↗'}
                  </a>

                  {selectedPoi.rawPlace && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleOpenPlaceDetail(selectedPoi.rawPlace!)}
                        className="gmap-action-btn"
                      >
                        📋 Xem nhanh
                      </button>
                      <Link
                        href={`/diem-den/${selectedPoi.rawPlace.id}`}
                        className="gmap-action-btn"
                      >
                        Chi tiết →
                      </Link>
                      {onToggleBookmark && (
                        <button
                          type="button"
                          onClick={(e) => onToggleBookmark(selectedPoi.rawPlace!.id, e)}
                          className={`gmap-action-btn ${
                            bookmarkedIds.includes(selectedPoi.rawPlace.id) ? 'bookmarked' : ''
                          }`}
                        >
                          {bookmarkedIds.includes(selectedPoi.rawPlace.id) ? '★ Đã lưu' : '☆ Lưu sổ tay'}
                        </button>
                      )}
                    </>
                  )}

                  {selectedPoi.phone && (
                    <a href={`tel:${selectedPoi.phone}`} className="gmap-action-btn">
                      📞 Gọi {selectedPoi.phone}
                    </a>
                  )}

                  {selectedPoi.isUserPin && (
                    <button
                      type="button"
                      onClick={() => handleDeleteUserPin(selectedPoi.id, selectedPoi.name)}
                      className="gmap-action-btn danger"
                    >
                      🗑️ Xóa ghim này
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Internal Quick Modal Fallback */}
      <PlaceQuickModal
        place={internalModalPlace}
        isBookmarked={internalModalPlace ? bookmarkedIds.includes(internalModalPlace.id) : false}
        onToggleBookmark={onToggleBookmark ? (id) => onToggleBookmark(id) : undefined}
        onClose={() => setInternalModalPlace(null)}
      />
    </div>
  );
}
