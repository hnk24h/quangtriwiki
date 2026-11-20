'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import SafeImage from '@/components/common/SafeImage';
import { useToast } from '@/components/common/ToastProvider';
import { DEFAULT_ZONE_META } from '@/lib/normalize';
import { matchesPlaceCategory, matchesPlaceSearch } from '@/lib/place-filters';
import PlaceQuickModal from '@/components/home/PlaceQuickModal';
import { getBookmarkedIds, subscribeStorageSync, toggleBookmarkId } from '@/lib/storage';
import type { Place, Zone } from '@/lib/supabase/types';

const QuangTriInteractiveMap = dynamic(
  () => import('@/components/QuangTriInteractiveMap'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: '520px',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, #0d2c20 0%, #133e2f 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#a7f3d0',
          fontWeight: 600,
        }}
      >
        🧭 Đang tải bản đồ tọa độ tương tác Quảng Trị...
      </div>
    ),
  }
);

interface CungDuongClientProps {
  places: Place[];
  zones: Zone[];
}

export default function CungDuongClient({ places, zones }: CungDuongClientProps) {
  const { showToast } = useToast();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [zoneTypeFilter, setZoneTypeFilter] = useState<'all' | 'history' | 'mountain' | 'coastal'>('all');
  const [placesViewMode, setPlacesViewMode] = useState<'map' | 'grid'>('map');
  const [activeModal, setActiveModal] = useState<Place | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
    return subscribeStorageSync(() => setBookmarkedIds(getBookmarkedIds()));
  }, []);

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const { ids, added } = toggleBookmarkId(id);
    setBookmarkedIds(ids);
    showToast(added ? 'Đã lưu điểm đến vào Sổ tay!' : 'Đã bỏ khỏi Sổ tay.');
  };

  const phuotCategories = [
    { id: 'all', icon: '🧭', code: 'TỌA ĐỘ TOÀN CẢNH', label: 'Tất cả tọa độ', badge: `${places.length} ĐIỂM`, desc: 'Bao quát toàn tỉnh lộ' },
    { id: 'history', icon: '🏛️', code: 'VĨ TUYẾN 17 & DMZ', label: 'Di tích lịch sử', badge: 'HÀO HÙNG', desc: 'Thành Cổ · Vịnh Mốc' },
    { id: 'cloud', icon: '☁️', code: 'CAO ĐỘ 1.400M', label: 'Săn mây Sa Mù', badge: 'ĐÈO GIÓ', desc: 'Khe Sanh · Điện gió' },
    { id: 'beach', icon: '🏖️', code: '75KM BIỂN CÁT', label: 'Biển cát trắng', badge: 'HOANG SƠ', desc: 'Cửa Việt · Mũi Trèo' },
    { id: 'island', icon: '🏝️', code: '15 HẢI LÝ BIỂN ĐÔNG', label: 'Đảo Cồn Cỏ', badge: 'TIỀN ĐỒN', desc: 'Lặn ngắm san hô' },
    { id: 'waterfall', icon: '💦', code: 'RỪNG NGUYÊN SINH', label: 'Thác & Suối ngàn', badge: 'TREKKING', desc: 'Thác Chênh Vênh · Klu' },
  ];

  const filteredPlaces = useMemo(() => {
    return places.filter(
      (p) =>
        matchesPlaceCategory(p, selectedCategory) &&
        (selectedZone === 'all' || p.zoneCode === selectedZone) &&
        matchesPlaceSearch(p, search)
    );
  }, [places, selectedCategory, selectedZone, search]);

  const getGroup = (z: Zone) => z.typeGroup || DEFAULT_ZONE_META[z.code]?.typeGroup || 'history';

  const zoneCounts = useMemo(() => {
    return {
      all: zones.length,
      history: zones.filter((z) => getGroup(z) === 'history').length,
      mountain: zones.filter((z) => getGroup(z) === 'mountain').length,
      coastal: zones.filter((z) => getGroup(z) === 'coastal').length,
    };
  }, [zones]);

  const filteredZones = useMemo(() => {
    if (zoneTypeFilter === 'all') return zones;
    return zones.filter((z) => getGroup(z) === zoneTypeFilter);
  }, [zones, zoneTypeFilter]);

  return (
    <div className="container places-wide-container" style={{ marginTop: '2rem' }}>
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              📍 BẢN ĐỒ SỐ ĐA LỚP & GHIM CỘNG ĐỒNG
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: '0.15rem 0 0' }}>
              Bản Đồ Tương Tác Quảng Trị
            </h3>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(19, 62, 47, 0.08)', padding: '4px', borderRadius: '12px' }}>
            <button
              type="button"
              onClick={() => setPlacesViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: placesViewMode === 'map' ? '#133e2f' : 'transparent',
                color: placesViewMode === 'map' ? '#ffffff' : '#4b5563',
              }}
            >
              <span>🗺️</span>
              <span>Bản Đồ Tương Tác</span>
            </button>

            <button
              type="button"
              onClick={() => setPlacesViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.5rem 1.1rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: placesViewMode === 'grid' ? '#133e2f' : 'transparent',
                color: placesViewMode === 'grid' ? '#ffffff' : '#4b5563',
              }}
            >
              <span>📋</span>
              <span>Danh Sách Thẻ ({filteredPlaces.length})</span>
            </button>
          </div>
        </div>

        {placesViewMode === 'map' ? (
          <QuangTriInteractiveMap
            places={filteredPlaces}
            zones={zones}
            selectedZone={selectedZone}
            onSelectZone={setSelectedZone}
            onOpenModal={(p) => setActiveModal(p)}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={handleToggleBookmark}
          />
        ) : (
          <div className="places-grid">
            {filteredPlaces.map((p) => (
              <article
                key={p.id}
                onClick={() => setActiveModal(p)}
                className="place-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="card-media" style={{ position: 'relative', overflow: 'hidden' }}>
                  <SafeImage src={p.image || p.hero_image} alt={p.name} fill sizes="(max-width: 768px) 100vw, 360px" />
                  <span className="card-zone-tag">{p.zoneCode}</span>
                  <button
                    type="button"
                    onClick={(e) => handleToggleBookmark(p.id, e)}
                    aria-label={bookmarkedIds.includes(p.id) ? `Bỏ lưu ${p.name}` : `Lưu ${p.name} vào sổ tay`}
                    className={`card-bookmark-btn ${bookmarkedIds.includes(p.id) ? 'bookmarked' : ''}`}
                    title="Lưu vào Sổ tay"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarkedIds.includes(p.id) ? '#d97706' : 'none'} stroke="currentColor" strokeWidth="2">
                      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                    </svg>
                  </button>
                </div>
                <div className="card-body">
                  <div className="card-meta-row">
                    <span className="card-cat">{p.categoryName}</span>
                    <span className="card-rating">★ {p.rating} ({p.reviewsCount})</span>
                  </div>
                  <h3 className="card-title">{p.name}</h3>
                  <p className="card-short-desc">{p.shortDesc}</p>
                  <div className="card-footer-info">
                    <span className="card-coord">📍 {p.zoneName}</span>
                    <span className="card-ticket-preview">{p.ticket || 'Miễn phí'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <PlaceQuickModal
        place={activeModal}
        isBookmarked={activeModal ? bookmarkedIds.includes(activeModal.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark(id)}
        onClose={() => setActiveModal(null)}
      />
    </div>
  );
}
