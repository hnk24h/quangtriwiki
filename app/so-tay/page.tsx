import { Metadata } from 'next';
import { getGuides, getItineraries, getPlaces } from '@/lib/get-data';
import SoTayClient, { MinimalItinerarySummary, MinimalPlaceSummary } from './SoTayClient';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Sổ Tay Hành Trình Cá Nhân · Lưu Điểm Đến & Checklist Phượt',
  description:
    'Quản lý danh sách điểm đến đã lưu, lịch trình yêu thích, checklist hành trang đèo Sa Mù & đảo Cồn Cỏ và ghi chú riêng tư trên QuangTri.wiki.',
};

export default async function SoTayPage() {
  const [places, itineraries, guides] = await Promise.all([
    getPlaces(),
    getItineraries(),
    getGuides(),
  ]);

  const minimalPlaces: MinimalPlaceSummary[] = places.map((p) => ({
    id: p.id,
    name: p.name,
    zoneCode: p.zoneCode,
    zoneName: p.zoneName,
    image: p.image,
    shortDesc: p.shortDesc,
    coordinates: p.coordinates,
  }));

  const minimalItineraries: MinimalItinerarySummary[] = itineraries.map((it) => ({
    id: it.id,
    title: it.title,
    duration: it.duration,
    distance: it.distance,
    suitability: it.suitability,
  }));

  return (
    <SoTayClient
      places={minimalPlaces}
      itineraries={minimalItineraries}
      defaultChecklist={guides.packingChecklist || []}
    />
  );
}
