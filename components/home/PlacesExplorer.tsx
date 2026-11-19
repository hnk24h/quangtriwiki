'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import SafeImage from '@/components/common/SafeImage';
import type { Place } from '@/lib/supabase/types';

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
  placeCategory: string;
  onChangePlaceCategory: (cat: string) => void;
  selectedZone: string;
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
  placeCategory,
  onChangePlaceCategory,
  selectedZone,
  searchQuery,
  onResetFilters,
  bookmarkedIds,
  onToggleBookmark,
  onOpenModal,
}: PlacesExplorerProps) {
  const [placesViewMode, setPlacesViewMode] = useState<'map' | 'grid'>('map');

  return (
    <section className="places-section" id="cung-duong">
      <div className="container">
        <div className="section-head-hagiang">
          <span className="sub-title-accent">TỌA ĐỘ DU LỊCH & LỊCH SỬ</span>
          <h2 className="title-serif">Khám Phá Điểm Đến</h2>
          <p className="desc-text">
            Được xác minh kỹ lưỡng với đầy đủ tọa độ GPS, giá vé, giờ mở cửa và lời khuyên phượt thủ.
          </p>
        </div>

        {/* Phượt Explorer Waypoints Bar */}
        <div className="phuot-filter-wrapper">
          <div className="phuot-filter-track">
            {WAYPOINTS.map((f) => {
              const isActive = placeCategory === f.id;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => onChangePlaceCategory(f.id)}
                  className={`phuot-waypoint-btn ${isActive ? 'active' : ''}`}
                >
                  <div className="phuot-btn-top">
                    <span className="phuot-btn-code">{f.code}</span>
                    <span className="phuot-btn-badge">{f.badge}</span>
                  </div>
                  <div className="phuot-btn-main">
                    <span className="phuot-btn-icon">{f.icon}</span>
                    <span className="phuot-btn-label">{f.label}</span>
                    {isActive && <span className="phuot-radar-dot" title="Tọa độ đang mở" />}
                  </div>
                  <div className="phuot-btn-desc">{f.desc}</div>
                </button>
              );
            })}
          </div>

          <div className="phuot-status-strip">
            <div className="phuot-status-left">
              <span style={{ fontSize: '1.1rem' }}>🧭</span>
              <span>
                Đang mở <strong>{filteredPlaces.length}</strong> trạm dừng chân
                {placeCategory !== 'all' && (
                  <span style={{ color: '#059669', fontWeight: 600 }}> · Đã bật chế độ lọc chủ đề</span>
                )}
                {selectedZone !== 'all' && (
                  <span style={{ color: '#d97706', fontWeight: 600 }}> · Phân vùng {selectedZone}</span>
                )}
                {searchQuery.trim() && (
                  <span style={{ color: '#2563eb', fontWeight: 600 }}> · Từ khóa &ldquo;{searchQuery.trim()}&rdquo;</span>
                )}
              </span>
            </div>

            {(placeCategory !== 'all' || selectedZone !== 'all' || searchQuery.trim() !== '') && (
              <button
                type="button"
                onClick={onResetFilters}
                className="phuot-status-reset-btn"
              >
                ✕ Xem toàn bộ tọa độ
              </button>
            )}
          </div>
        </div>

        {/* View Mode Toggle: Interactive Map vs Grid */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            margin: '1.2rem 0 1.5rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(19, 62, 47, 0.08)', padding: '4px', borderRadius: '12px' }}>
            <button
              type="button"
              onClick={() => setPlacesViewMode('map')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: placesViewMode === 'map' ? '#133e2f' : 'transparent',
                color: placesViewMode === 'map' ? '#ffffff' : '#4b5563',
                boxShadow: placesViewMode === 'map' ? '0 2px 8px rgba(19, 62, 47, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>🗺️</span>
              <span>Bản Đồ Tương Tác & Cung Đường</span>
            </button>

            <button
              type="button"
              onClick={() => setPlacesViewMode('grid')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                fontSize: '0.88rem',
                fontWeight: 700,
                cursor: 'pointer',
                backgroundColor: placesViewMode === 'grid' ? '#133e2f' : 'transparent',
                color: placesViewMode === 'grid' ? '#ffffff' : '#4b5563',
                boxShadow: placesViewMode === 'grid' ? '0 2px 8px rgba(19, 62, 47, 0.25)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              <span>📋</span>
              <span>Danh Sách Thẻ Tọa Độ ({filteredPlaces.length})</span>
            </button>
          </div>

          <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
            Hiển thị <strong>{filteredPlaces.length}</strong> tọa độ danh thắng tại Quảng Trị
          </div>
        </div>

        {/* Conditional Rendering: Interactive Map or Grid */}
        {placesViewMode === 'map' ? (
          <QuangTriInteractiveMap
            places={filteredPlaces}
            onOpenModal={onOpenModal}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={onToggleBookmark}
          />
        ) : filteredPlaces.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#fff', borderRadius: '16px' }}>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Không tìm thấy điểm đến phù hợp với bộ lọc hiện tại.
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
                    <span className="card-ticket-preview">{p.ticket || 'Miễn phí'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
