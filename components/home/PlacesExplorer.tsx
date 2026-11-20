'use client';

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { formatDualCurrency, useLanguage } from '@/lib/i18n';
import type { Food, GuidesData, Place, Service, Zone } from '@/lib/supabase/types';

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
          fontSize: '0.95rem',
        }}
      >
        🧭 Đang tải bản đồ tọa độ tương tác Quảng Trị...
      </div>
    ),
  }
);

interface PlacesExplorerProps {
  filteredPlaces: Place[];
  foods?: Food[];
  services?: Service[];
  zones?: Zone[];
  guides?: GuidesData;
  placeCategory: string;
  onChangePlaceCategory: (cat: string) => void;
  selectedZone: string;
  onSelectZone?: (zoneCode: string) => void;
  selectedZoneName?: string;
  /** Number of places per category under the current zone/keyword */
  categoryCounts: Record<string, number>;
  /** Increment to jump to the results panel (list view) after an external action such as picking a zone */
  focusToken: number;
  searchQuery: string;
  onResetFilters: () => void;
  bookmarkedIds: string[];
  onToggleBookmark: (id: string, e?: React.MouseEvent) => void;
  onOpenModal: (place: Place) => void;
}

const WAYPOINTS = [
  { id: 'all', icon: '🧭', code: 'TỌA ĐỘ TOÀN CẢNH', label: 'Tất cả tọa độ', badge: 'TOÀN TỈNH', desc: 'Bao quát toàn tỉnh lộ' },
  { id: 'history', icon: '🏛️', code: 'VĨ TUYẾN 17 & DMZ', label: 'Di tích lịch sử', badge: 'HÀO HÙNG', desc: 'Thành Cổ · Vịnh Mốc' },
  { id: 'cloud', icon: '☁️', code: 'CAO ĐỘ 1.400M', label: 'Săn mây Sa Mù', badge: 'ĐÈO GIÓ', desc: 'Khe Sanh · Điện gió' },
  { id: 'beach', icon: '🏖️', code: '75KM BIỂN CÁT', label: 'Biển cát trắng', badge: 'HOANG SƠ', desc: 'Cửa Việt · Mũi Trèo' },
  { id: 'island', icon: '🏝️', code: '15 HẢI LÝ BIỂN ĐÔNG', label: 'Đảo Cồn Cỏ', badge: 'TIỀN ĐỒN', desc: 'Lặn ngắm san hô' },
  { id: 'waterfall', icon: '💦', code: 'RỪNG NGUYÊN SINH', label: 'Thác & Suối ngàn', badge: 'TREKKING', desc: 'Thác Chênh Vênh · Klu' },
];

export default function PlacesExplorer({
  filteredPlaces,
  foods = [],
  services = [],
  zones = [],
  guides,
  placeCategory,
  onChangePlaceCategory,
  selectedZone,
  onSelectZone,
  selectedZoneName,
  categoryCounts,
  focusToken,
  searchQuery,
  onResetFilters,
  bookmarkedIds,
  onToggleBookmark,
  onOpenModal,
}: PlacesExplorerProps) {
  const { lang } = useLanguage();
  const [placesViewMode, setPlacesViewMode] = useState<'map' | 'grid'>('map');

  // After picking a zone: show the list right away (visible, scannable) and scroll to the results panel
  useEffect(() => {
    if (focusToken === 0) return;
    setPlacesViewMode('grid');
    const frame = requestAnimationFrame(() => {
      document.getElementById('places-results')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    return () => cancelAnimationFrame(frame);
  }, [focusToken]);

  const hasActiveFilter = placeCategory !== 'all' || selectedZone !== 'all' || searchQuery.trim() !== '';

  return (
    <section className="places-section places-section-wide" id="cung-duong">
      <div className="container places-wide-container">
        <div
          id="places-results"
          className="section-head-split"
        >
          <div className="section-head-hagiang" style={{ marginBottom: 0 }}>
            <span className="sub-title-accent">
              {lang === 'en'
                ? 'STEP 02 / 05 · INTERACTIVE MULTI-LAYER MAP & PINS'
                : lang === 'ja'
                ? 'ステップ 02 / 05 · 多層インタラクティブ地図'
                : 'BẢN ĐỒ SỐ ĐA LỚP · GHIM ĐỊA ĐIỂM CỘNG ĐỒNG'}
            </span>
            <h2 className="title-serif">
              {lang === 'en'
                ? 'Explore Quang Tri Interactive Map'
                : lang === 'ja'
                ? 'クアンチ・インタラクティブ観光マップ'
                : 'Bản Đồ Tương Tác & Khám Phá Quảng Trị'}
            </h2>
            <p className="desc-text">
              {lang === 'en'
                ? 'Filter zones (QT-01 → QT-12), attractions, food, hotels, parking & fuel stations — or drop your own pin.'
                : lang === 'ja'
                ? 'エリア別（QT-01 → QT-12）や観光地・グルメ・宿泊・駐車場・給油所で絞り込み、新しいピンも追加できます。'
                : 'Chọn khu vực (QT-01 → QT-12), lọc nhanh điểm tham quan, quán ăn, khách sạn, bãi đỗ xe hoặc tự ghim tọa độ mới.'}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', flexShrink: 0 }}>
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
                boxShadow: placesViewMode === 'map' ? '0 2px 8px rgba(19, 62, 47, 0.25)' : 'none',
                transition: 'all 0.2s ease',
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
                boxShadow: placesViewMode === 'grid' ? '0 2px 8px rgba(19, 62, 47, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>📋</span>
              <span>Danh Sách Thẻ ({filteredPlaces.length})</span>
            </button>
            </div>
            <Link href="/cung-duong" className="journey-back-map-chip">
              Mở toàn trang Bản đồ ↗
            </Link>
          </div>
        </div>

        {/* Conditional Rendering: Interactive Map (always available) or Grid */}
        {placesViewMode === 'map' ? (
          <QuangTriInteractiveMap
            places={filteredPlaces}
            foods={foods}
            services={services}
            zones={zones}
            guides={guides}
            selectedZone={selectedZone}
            onSelectZone={onSelectZone}
            onOpenModal={onOpenModal}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={onToggleBookmark}
            defaultSidebarCollapsed={true}
          />
        ) : filteredPlaces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '16px' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Không tìm thấy điểm tham quan phù hợp với bộ lọc hiện tại.
            </p>
            <button
              type="button"
              onClick={onResetFilters}
              style={{
                background: '#133e2f',
                color: '#fff',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                fontWeight: 600,
              }}
            >
              Xóa bộ lọc
            </button>
          </div>
        ) : (
          <div className="places-grid">
            {filteredPlaces.map((p) => (
              <article
                key={p.id}
                onClick={() => onOpenModal(p)}
                className="place-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="card-media" style={{ position: 'relative', overflow: 'hidden' }}>
                  <SafeImage
                    src={p.image || p.hero_image}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                  <span className="card-zone-tag">{p.zoneCode}</span>
                  <button
                    type="button"
                    onClick={(e) => onToggleBookmark(p.id, e)}
                    aria-label={bookmarkedIds.includes(p.id) ? `Bỏ lưu ${p.name}` : `Lưu ${p.name} vào sổ tay`}
                    className={`card-bookmark-btn ${bookmarkedIds.includes(p.id) ? 'bookmarked' : ''}`}
                    title="Lưu vào Sổ tay"
                  >
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 24 24"
                      fill={bookmarkedIds.includes(p.id) ? '#d97706' : 'none'}
                      stroke="currentColor"
                      strokeWidth="2"
                    >
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
                    <span className="card-ticket-preview">
                      {formatDualCurrency(p.ticket || 'Miễn phí', lang)}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        <div className="section-journey-footer" style={{ marginTop: '1.5rem' }}>
          <span className="journey-hint-text">
            💡 Chọn một vùng trên bản đồ để lọc nhanh điểm đến và ưu tiên gợi ý Lưu trú & Ẩm thực bên dưới.
          </span>
          <a href="#dich-vu" className="journey-next-link">
            Tiếp theo: Lưu trú & Dịch vụ bản địa ↓
          </a>
        </div>
      </div>
    </section>
  );
}
