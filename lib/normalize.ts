import type {
  BannerSlide,
  Comment,
  Food,
  GuidesData,
  Itinerary,
  ItineraryStep,
  Place,
  Service,
  Thread,
  Zone,
} from '@/lib/supabase/types';

export function parseStringArray(val: unknown): string[] {
  if (Array.isArray(val)) {
    return val.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof val === 'string') {
    const trimmed = val.trim();
    if (!trimmed) return [];
    // Postgres array format: {"a","b"}
    if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
      return trimmed
        .slice(1, -1)
        .split(',')
        .map((s) => s.replace(/^"|"$/g, '').trim())
        .filter(Boolean);
    }
    return trimmed
      .split(/\n|·/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

export function normalizePlace(raw: any): Place {
  const image =
    raw.hero_image ||
    raw.image ||
    'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80';
  const galleryRaw = parseStringArray(raw.gallery);
  const gallery = galleryRaw.length > 0 ? galleryRaw : [image];

  return {
    id: String(raw.id || ''),
    name: String(raw.name || 'Điểm đến Quảng Trị'),
    zoneCode: String(raw.zone_code || raw.zoneCode || 'QT-01'),
    zoneName: String(raw.zone_name || raw.zoneName || 'Quảng Trị'),
    category: String(raw.category || 'history'),
    categoryName: String(raw.category_name || raw.categoryName || 'Di tích & Danh thắng'),
    image,
    hero_image: image,
    gallery,
    rating: Number(raw.rating) || 4.8,
    reviewsCount: Number(raw.rating_count ?? raw.reviewsCount) || 120,
    shortDesc: String(raw.short_desc || raw.shortDesc || ''),
    fullDesc: String(raw.history || raw.fullDesc || raw.short_desc || raw.shortDesc || ''),
    history: String(raw.history || raw.fullDesc || raw.short_desc || raw.shortDesc || ''),
    highlights: parseStringArray(raw.highlights),
    coordinates: String(raw.coordinates || '16.7533° N, 107.1912° E'),
    address: String(raw.address || 'Tỉnh Quảng Trị'),
    openHours: String(raw.open_time || raw.openHours || 'Mở cửa cả ngày'),
    ticket: String(raw.ticket_price || raw.ticket || 'Miễn phí'),
    tips: raw.tips ? String(raw.tips) : null,
  };
}

export function normalizeServiceType(rawType?: string | null): string {
  const val = String(rawType || 'homestay').trim().toLowerCase();
  if (val === 'rental') return 'bike';
  return val;
}

export function normalizeService(raw: any): Service {
  const type = normalizeServiceType(raw.type || raw.category);
  const typeLabel = String(raw.type_label || raw.typeLabel || raw.categoryName || 'Dịch vụ');
  const verified = Boolean(raw.is_verified ?? raw.verified ?? true);
  const phone = String(raw.hotline || raw.phone || '');

  return {
    id: String(raw.id || ''),
    name: String(raw.name || ''),
    type,
    typeLabel,
    category: type,
    categoryName: typeLabel,
    zoneCode: String(raw.zone_code || raw.zoneCode || 'QT-01'),
    zoneName: String(raw.zone_name || raw.zoneName || 'Quảng Trị'),
    price: String(raw.price || 'Liên hệ'),
    rating: Number(raw.rating) || 4.9,
    reviewsCount: Number(raw.reviews ?? raw.reviewsCount) || 45,
    address: String(raw.address || ''),
    phone,
    hotline: phone,
    zalo: String(raw.zalo || phone),
    image: String(
      raw.image ||
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
    ),
    verified,
    is_verified: verified,
    badge: verified ? 'Đối tác Xác minh' : 'Đối tác',
    description: raw.description ? String(raw.description) : null,
    highlights: raw.description
      ? [String(raw.description)]
      : Array.isArray(raw.highlights)
      ? raw.highlights
      : [],
  };
}

export function normalizeFood(raw: any, fallbackFood?: any): Food {
  return {
    id: String(raw.id || ''),
    name: String(raw.name || ''),
    origin: String(raw.origin || 'Quảng Trị'),
    type: String(raw.type || 'Món mặn truyền thống'),
    priceRange: String(raw.price_range || raw.priceRange || 'Bình dân'),
    description: String(raw.description || ''),
    tasteNotes: String(raw.taste_notes || raw.tasteNotes || fallbackFood?.tasteNotes || ''),
    image: String(
      raw.image ||
        'https://images.unsplash.com/photo-1555126634-323283e090fa?auto=format&fit=crop&w=800&q=80'
    ),
    addressRecs: parseStringArray(raw.address_recs ?? raw.addressRecs ?? raw.bestPlaces),
    highlights: parseStringArray(raw.highlights),
  };
}

export function normalizeItinerary(raw: any): Itinerary {
  const rawSteps =
    Array.isArray(raw.stops) && raw.stops.length > 0
      ? raw.stops
      : Array.isArray(raw.steps)
      ? raw.steps
      : [];

  const steps: ItineraryStep[] = rawSteps.map((s: any, idx: number) => ({
    name: String(s?.name || `Chặng ${idx + 1}`),
    time: String(s?.time || 'Trong ngày'),
    desc: String(s?.desc || s?.description || ''),
  }));

  const rawHighlights = raw.highlights ?? raw.highlight;
  const highlights = parseStringArray(rawHighlights);

  return {
    id: String(raw.id || ''),
    title: String(raw.title || ''),
    duration: String(raw.duration || raw.days || '2 Ngày 1 Đêm'),
    suitability: String(raw.suitability || raw.suitableFor || 'Phượt thủ & Gia đình'),
    distance: String(raw.distance || 'Linh hoạt'),
    description: String(raw.description || ''),
    highlights,
    steps,
    stops: steps,
  };
}

export interface ZoneMetaDefault {
  specialty: string;
  typeTag: string;
  typeGroup: 'history' | 'mountain' | 'coastal';
  lat: number;
  lon: number;
  showInWeather: boolean;
  weatherRegionLabel: string;
}

export const DEFAULT_ZONE_META: Record<string, ZoneMetaDefault> = {
  'QT-01': {
    specialty: 'Bánh bột lọc & Cháo bột cá lóc',
    typeTag: '🏛️ Đô thị & Cửa ngõ',
    typeGroup: 'history',
    lat: 16.8163,
    lon: 107.1003,
    showInWeather: true,
    weatherRegionLabel: 'TRUNG TÂM · TP. ĐÔNG HÀ',
  },
  'QT-02': {
    specialty: 'Cháo vạt giường Diên Sanh & Bánh lọc Mỹ Chánh',
    typeTag: '⚔️ Thành Cổ & Đất thiêng',
    typeGroup: 'history',
    lat: 16.746,
    lon: 107.1856,
    showInWeather: true,
    weatherRegionLabel: 'ĐẤT THIÊNG · THÀNH CỔ',
  },
  'QT-03': {
    specialty: 'Hải sản biển Cửa Tùng & Tôm cá Bến Hải',
    typeTag: '🕊️ Vĩ tuyến 17 & Làng hầm',
    typeGroup: 'history',
    lat: 17.0714,
    lon: 107.11,
    showInWeather: true,
    weatherRegionLabel: 'VĨ TUYẾN 17 · BỜ BIỂN',
  },
  'QT-04': {
    specialty: 'Bún hến Mai Xá (Di sản ẩm thực Việt Nam)',
    typeTag: '🌊 Biển Cửa Việt & Mũi Trèo',
    typeGroup: 'coastal',
    lat: 16.9065,
    lon: 107.185,
    showInWeather: true,
    weatherRegionLabel: 'BIỂN CỬA VIỆT · GIO LINH',
  },
  'QT-05': {
    specialty: 'Cà phê Arabica Khe Sanh & Thịt trâu lá trơng',
    typeTag: '☁️ Săn mây Sa Mù & Núi cao',
    typeGroup: 'mountain',
    lat: 16.69,
    lon: 106.71,
    showInWeather: true,
    weatherRegionLabel: 'VÙNG CAO · ĐÈO SA MÙ',
  },
  'QT-06': {
    specialty: 'Cơm lam, rượu cần & Suối khoáng Klu',
    typeTag: '🌲 Trường Sơn & Bản làng',
    typeGroup: 'mountain',
    lat: 16.578,
    lon: 106.956,
    showInWeather: true,
    weatherRegionLabel: 'ĐẠI NGÀN TRƯỜNG SƠN',
  },
  'QT-07': {
    specialty: 'Cua đá Cồn Cỏ & Rong biển đảo ngọc',
    typeTag: '🏝️ Đảo tiền tiêu & San hô',
    typeGroup: 'coastal',
    lat: 17.1583,
    lon: 107.3389,
    showInWeather: true,
    weatherRegionLabel: 'HẢI ĐẢO · 15 HẢI LÝ',
  },
  'QT-08': {
    specialty: 'Gà đồi Cùa & Cao chè vằng Định Sơn',
    typeTag: '🌿 Căn cứ Tân Sở & Đồi Cùa',
    typeGroup: 'history',
    lat: 16.803,
    lon: 106.993,
    showInWeather: true,
    weatherRegionLabel: 'TRUNG DU · VÙNG CÙA',
  },
};

function normalizeZoneGroup(val?: string | null): 'history' | 'mountain' | 'coastal' {
  if (val === 'mountain' || val === 'coastal' || val === 'history') return val;
  return 'history';
}

export function normalizeZone(raw: any, fallbackZone?: any): Zone {
  const code = String(raw.code || '').trim();
  const metaDefault = DEFAULT_ZONE_META[code];
  const description = String(raw.description || raw.desc || fallbackZone?.description || '');
  const rawLat = raw.lat !== null && raw.lat !== undefined && raw.lat !== '' ? Number(raw.lat) : metaDefault?.lat;
  const rawLon = raw.lon !== null && raw.lon !== undefined && raw.lon !== '' ? Number(raw.lon) : metaDefault?.lon;
  const lat = rawLat !== undefined && Number.isFinite(rawLat) ? rawLat : 16.8163;
  const lon = rawLon !== undefined && Number.isFinite(rawLon) ? rawLon : 107.1003;

  return {
    code,
    name: String(raw.name || ''),
    slug: String(raw.slug || code.toLowerCase()),
    tagline: String(raw.tagline || ''),
    heroImage: String(
      raw.hero_image ||
        raw.heroImage ||
        fallbackZone?.heroImage ||
        'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'
    ),
    description,
    desc: description,
    featuredCount: String(
      raw.featured_count || raw.featuredCount || fallbackZone?.featuredCount || 'Điểm đến bản địa'
    ),
    specialty: String(
      raw.specialty || fallbackZone?.specialty || metaDefault?.specialty || 'Ẩm thực & Đặc sản bản địa'
    ),
    typeTag: String(
      raw.type_tag || raw.typeTag || fallbackZone?.typeTag || metaDefault?.typeTag || 'Điểm đến tiêu biểu'
    ),
    typeGroup: normalizeZoneGroup(
      raw.type_group || raw.typeGroup || fallbackZone?.typeGroup || metaDefault?.typeGroup
    ),
    lat,
    lon,
    showInWeather:
      typeof raw.show_in_weather === 'boolean'
        ? raw.show_in_weather
        : typeof raw.showInWeather === 'boolean'
        ? raw.showInWeather
        : metaDefault?.showInWeather ?? true,
    weatherRegionLabel: String(
      raw.weather_region_label ||
        raw.weatherRegionLabel ||
        metaDefault?.weatherRegionLabel ||
        raw.name ||
        code
    ),
  };
}

export function normalizeThread(raw: any, comments: Comment[] = []): Thread {
  const likesCount = Number(raw.likes_count ?? raw.likes ?? 0);
  const createdAt = raw.created_at ? String(raw.created_at) : undefined;
  const authorName = String(raw.author_name || raw.author || 'Khách lãng du');
  const avatar = String(
    raw.author_avatar ||
      raw.avatar ||
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'
  );
  const badge = String(raw.author_badge || raw.badge || 'Thành viên');

  return {
    id: String(raw.id || ''),
    author: authorName,
    author_name: authorName,
    avatar,
    author_avatar: avatar,
    badge,
    author_badge: badge,
    time: raw.time
      ? String(raw.time)
      : createdAt
      ? new Date(createdAt).toLocaleDateString('vi-VN')
      : 'Gần đây',
    created_at: createdAt,
    tag: String(raw.tag || 'Kinh nghiệm'),
    zoneCode: String(raw.zone_code || raw.zoneCode || 'QT-05'),
    zone_code: String(raw.zone_code || raw.zoneCode || 'QT-05'),
    title: String(raw.title || ''),
    content: String(raw.content || ''),
    images: parseStringArray(raw.images),
    likes: likesCount,
    likes_count: likesCount,
    comments,
  };
}

export function normalizeBannerSlide(raw: any): BannerSlide {
  return {
    id: String(raw.id || ''),
    badge: String(raw.badge || raw.kicker || raw.zone || 'MIỀN TRUNG VIỆT NAM'),
    title: String(raw.title || 'Quảng Trị Chân Thật'),
    subtitle: String(raw.subtitle || raw.caption || ''),
    image: String(
      raw.image ||
        raw.img ||
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85'
    ),
    zoneCode: raw.zone_code || raw.zoneCode || '',
    statsTag: raw.stats_tag || raw.statsTag || '',
    sortOrder: Number(raw.sort_order ?? raw.sortOrder ?? 0),
  };
}

export function normalizeGuides(raw: any, fallback: any = {}): GuidesData {
  return {
    bestTimeToVisit:
      raw?.best_time_to_visit || raw?.bestTimeToVisit || fallback?.bestTimeToVisit || [],
    packingChecklist:
      raw?.packing_checklist || raw?.packingChecklist || fallback?.packingChecklist || [],
    emergencyHotlines:
      raw?.emergency_hotlines || raw?.emergencyHotlines || fallback?.emergencyHotlines || [],
    gasStations: raw?.gas_stations || raw?.gasStations || fallback?.gasStations || [],
  };
}

export function formatSupabaseWriteError(err: any): string {
  const msg = String(err?.message || err || 'Lỗi lưu dữ liệu');
  if (
    msg.toLowerCase().includes('row-level security') ||
    msg.toLowerCase().includes('permission denied')
  ) {
    return `${msg} (Hãy cấu hình SUPABASE_SERVICE_ROLE_KEY thật trong .env.local / Vercel và chạy supabase/migration_v2.sql)`;
  }
  if (msg.toLowerCase().includes('does not exist')) {
    return `${msg} (Bảng/cột chưa tồn tại — hãy chạy supabase/migration_v2.sql trong Supabase SQL Editor)`;
  }
  return msg;
}
