import type { Food, Itinerary, Place, Thread } from '@/lib/supabase/types';

export interface LatLng {
  lat: number;
  lng: number;
}

export interface TravelOrigin {
  id: string;
  label: string;
  point: LatLng;
}

export const TRAVEL_ORIGINS: TravelOrigin[] = [
  { id: 'dong-hoi', label: 'Đồng Hới', point: { lat: 17.4688, lng: 106.6223 } },
  { id: 'dong-ha', label: 'Đông Hà', point: { lat: 16.8163, lng: 107.1003 } },
  { id: 'hue', label: 'Huế', point: { lat: 16.4637, lng: 107.5909 } },
];

export function parseCoordinates(raw?: string | null): LatLng | null {
  if (!raw) return null;
  const nums = raw
    .split(',')
    .map((s) => parseFloat(s.replace(/[^0-9.]/g, '')))
    .filter((n) => Number.isFinite(n));
  if (nums.length < 2) return null;
  return { lat: nums[0], lng: nums[1] };
}

export function haversineKm(a: LatLng, b: LatLng): number {
  const R = 6371;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

function formatDuration(hours: number): string {
  const totalMin = Math.max(5, Math.round((hours * 60) / 5) * 5);
  if (totalMin < 60) return `${totalMin} phút`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m === 0 ? `${h} giờ` : `${h} giờ ${m} phút`;
}

export interface RouteEstimate {
  origin: TravelOrigin;
  straightKm: number;
  roadKm: number;
  motorbike: string;
  car: string;
}

/**
 * Ước tính quãng đường & thời gian di chuyển (đường chim bay × hệ số đường bộ).
 * Đây chỉ là số liệu tham khảo, cần xem lộ trình thật trên Google Maps.
 */
export function estimateRoutes(point: LatLng, isMountain: boolean): RouteEstimate[] {
  const roadFactor = isMountain ? 1.5 : 1.3;
  const motoSpeed = isMountain ? 32 : 42;
  const carSpeed = isMountain ? 38 : 52;

  return TRAVEL_ORIGINS.map((origin) => {
    const straightKm = haversineKm(origin.point, point);
    const roadKm = straightKm * roadFactor;
    return {
      origin,
      straightKm,
      roadKm,
      motorbike: formatDuration(roadKm / motoSpeed),
      car: formatDuration(roadKm / carSpeed),
    };
  });
}

export interface TransportTip {
  icon: string;
  title: string;
  desc: string;
}

export function buildTransportTips(place: Place, isMountain: boolean): TransportTip[] {
  const tips: TransportTip[] = [
    {
      icon: '🚆',
      title: 'Tàu hỏa / xe khách',
      desc: 'Xuống ga Đồng Hới hoặc ga Đông Hà (tùy điểm gần phía Bắc hay Nam tỉnh), sau đó thuê xe máy, ô tô hoặc đặt taxi đi tiếp.',
    },
    {
      icon: '✈️',
      title: 'Máy bay',
      desc: 'Bay thẳng tới Sân bay Đồng Hới (VDH) ngay trong tỉnh, hoặc Sân bay Phú Bài (Huế) nếu khám phá khu vực phía Nam.',
    },
  ];

  const isIsland = place.category === 'island' || /cồn cỏ/i.test(place.name);

  if (isIsland) {
    tips.unshift({
      icon: '⛴️',
      title: 'Tàu ra đảo',
      desc: 'Đi tàu cao tốc từ cảng Cửa Việt. Kiểm tra lịch tàu và dự báo gió biển trước khi khởi hành vì tàu có thể hoãn khi biển động.',
    });
  } else if (isMountain) {
    tips.unshift({
      icon: '🏍️',
      title: 'Xe máy là linh hoạt nhất',
      desc: 'Đường lên vùng núi có nhiều đèo dốc: kiểm tra phanh, đổ đầy xăng ở thị trấn gần nhất và nên xuất phát sớm để tránh sương mù buổi chiều.',
    });
  } else {
    tips.unshift({
      icon: '🏍️',
      title: 'Xe máy hoặc ô tô tự lái',
      desc: 'Đường bằng phẳng, dễ đi. Xe máy phù hợp nhóm nhỏ, ô tô phù hợp gia đình và nhóm đông người.',
    });
  }

  return tips;
}

function stripDiacritics(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

function locationKeywords(place: Place): string[] {
  const rawParts = `${place.zoneName || ''},${place.name || ''},${place.address || ''}`.split(
    /[&,·\-–()/]/
  );
  const stopwords = new Set([
    'quang tri',
    'tinh quang tri',
    'thi xa',
    'huyen',
    'xa',
    'thanh pho',
    'tp',
    'khu vuc',
    'vung',
    'di tich',
    'duong',
  ]);
  const keywords = rawParts
    .map((s) => stripDiacritics(s).trim())
    .filter((s) => s.length >= 4 && !stopwords.has(s));
  return Array.from(new Set(keywords));
}

export function matchFoodsForPlace(place: Place, foods: Food[], limit = 3): Food[] {
  const keywords = locationKeywords(place);
  const scored = foods.map((food) => {
    const haystack = stripDiacritics(`${food.origin} ${(food.addressRecs || []).join(' ')}`);
    const score = keywords.reduce((acc, kw) => (haystack.includes(kw) ? acc + 1 : acc), 0);
    return { food, score };
  });

  const matched = scored
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.food);

  return matched.slice(0, limit);
}

export function matchThreadsForPlace(place: Place, threads: Thread[], limit = 3): Thread[] {
  const nameKey = stripDiacritics(place.name);
  const mentioned = threads.filter((t) =>
    stripDiacritics(`${t.title} ${t.content}`).includes(nameKey)
  );
  const sameZone = threads.filter(
    (t) => t.zoneCode === place.zoneCode && !mentioned.includes(t)
  );
  return [...mentioned, ...sameZone].slice(0, limit);
}

export function matchItinerariesForPlace(
  place: Place,
  itineraries: Itinerary[],
  limit = 3
): Itinerary[] {
  const nameKey = stripDiacritics(place.name);
  return itineraries
    .filter((it) => {
      const text = [
        it.title,
        it.description,
        ...(it.highlights || []),
        ...(it.steps || []).map((s) => `${s.name} ${s.desc}`),
        ...(it.stops || []).map((s) => `${s.name} ${s.desc}`),
      ].join(' ');
      return stripDiacritics(text).includes(nameKey);
    })
    .slice(0, limit);
}

export interface NearbyPlace {
  place: Place;
  km: number;
  motorbike: string;
  sameZone: boolean;
}

export function findNearestPlaces(
  place: Place,
  origin: LatLng,
  allPlaces: Place[],
  limit = 4
): NearbyPlace[] {
  return allPlaces
    .filter((p) => p.id !== place.id)
    .map((p) => {
      const pt = parseCoordinates(p.coordinates);
      if (!pt) return null;
      const km = haversineKm(origin, pt) * 1.3;
      return {
        place: p,
        km,
        motorbike: formatDuration(km / 40),
        sameZone: p.zoneCode === place.zoneCode,
      };
    })
    .filter((x): x is NearbyPlace => x !== null)
    .sort((a, b) => a.km - b.km)
    .slice(0, limit);
}
