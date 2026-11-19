'use client';

import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import SafeImage from '@/components/common/SafeImage';
import { useToast } from '@/components/common/ToastProvider';
import { ZONE_METAS } from '@/components/home/ZonesExplorer';
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
    const q = search.trim().toLowerCase();
    return places.filter((p) => {
      let matchCat = selectedCategory === 'all';
      if (!matchCat) {
        if (selectedCategory === 'history') {
          matchCat = p.category === 'history' || p.categoryName.toLowerCase().includes('lịch sử');
        } else if (selectedCategory === 'cloud') {
          matchCat =
            p.category === 'adventure' ||
            p.category === 'checkin' ||
            p.id.includes('sa-mu') ||
            p.id.includes('gio') ||
            p.id.includes('ta-con') ||
            p.name.includes('Sa Mù') ||
            p.name.includes('Gió') ||
            p.name.includes('Tà Cơn');
        } else if (selectedCategory === 'beach') {
          matchCat =
            p.category === 'beach' ||
            p.id.includes('cua-viet') ||
            p.id.includes('cua-tung') ||
            p.id.includes('mui-treo') ||
            p.name.includes('Biển') ||
            p.name.includes('Mũi Trèo');
        } else if (selectedCategory === 'island') {
          matchCat = p.category === 'island' || p.id.includes('con-co') || p.name.includes('Cồn Cỏ');
        } else if (selectedCategory === 'waterfall') {
          matchCat =
            p.category === 'nature' ||
            p.id.includes('thac') ||
            p.id.includes('suoi') ||
            p.id.includes('dakrong') ||
            p.name.includes('Thác') ||
            p.name.includes('Suối') ||
            p.name.includes('Đakrông');
        } else {
          matchCat = p.category === selectedCategory;
        }
      }

      const matchZone = selectedZone === 'all' || p.zoneCode === selectedZone;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.zoneName.toLowerCase().includes(q);
      return matchCat && matchZone && matchSearch;
    });
  }, [places, selectedCategory, selectedZone, search]);

  const filteredZones = useMemo(() => {
    if (zoneTypeFilter === 'all') return zones;
    return zones.filter((z) => {
      const meta = ZONE_METAS[z.code];
      return meta && meta.typeGroup === zoneTypeFilter;
    });
  }, [zones, zoneTypeFilter]);

  return (
    <div className="container" style={{ marginTop: '3rem' }}>
      {/* 8 Zones Overview */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="zones-header-wrap">
          <div className="zones-badge-kicker">
            <span>🗺️</span>
            <span>HỆ THỐNG MÃ CUNG ĐƯỜNG QT-01 → QT-08</span>
          </div>
          <h2 className="zones-main-title">8 Vùng Di Sản, Danh Thắng & Đặc Sản Bản Địa</h2>
          <p className="zones-lead-desc">
            Chọn một phân vùng để lọc danh sách tọa độ, xem đặc sản địa phương và lời khuyên phượt thủ.
          </p>
        </div>

        <div className="zone-filter-tabs">
          {[
            { id: 'all', label: 'Tất cả 8 vùng', count: zones.length },
            { id: 'history', label: '🏛️ Di tích lịch sử & Tâm linh', count: 4 },
            { id: 'mountain', label: '🏔️ Núi cao & Săn mây Sa Mù', count: 2 },
            { id: 'coastal', label: '🏖️ Biển đảo & Sinh thái', count: 2 },
          ].map((tab) => (
            <button
              type="button"
              key={tab.id}
              onClick={() => setZoneTypeFilter(tab.id as any)}
              className={`zone-tab-btn ${zoneTypeFilter === tab.id ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  fontSize: '0.75rem',
                  opacity: zoneTypeFilter === tab.id ? 1 : 0.7,
                  background: zoneTypeFilter === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="zone-grid">
          {filteredZones.map((z) => {
            const meta = ZONE_METAS[z.code] || {
              specialty: 'Ẩm thực & Đặc sản bản địa',
              typeTag: 'Điểm đến tiêu biểu',
              typeGroup: 'history',
            };
            const isSelected = selectedZone === z.code;

            return (
              <div
                key={z.code}
                onClick={() => setSelectedZone(selectedZone === z.code ? 'all' : z.code)}
                className={`zone-card ${isSelected ? 'selected' : ''}`}
              >
                <div className="zone-card-media" style={{ position: 'relative', overflow: 'hidden' }}>
                  <SafeImage src={z.heroImage} alt={z.name} fill sizes="(max-width: 768px) 100vw, 320px" />
                  <div className="zone-media-gradient" />
                  <span className="zone-code-badge">{z.code}</span>
                  <span className="zone-type-badge">{meta.typeTag}</span>
                  {z.featuredCount && <span className="zone-count-badge">📍 {z.featuredCount}</span>}
                </div>

                <div className="zone-card-body">
                  <h3 className="zone-card-title">{z.name}</h3>
                  <div className="zone-card-tagline">{z.tagline}</div>

                  <div className="zone-specialty-box">
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>🍲</span>
                    <div>
                      <span>Đặc sản: </span>
                      <strong>{meta.specialty}</strong>
                    </div>
                  </div>

                  <p className="zone-card-desc">{z.description || z.desc}</p>

                  <div className="zone-card-footer">
                    {isSelected ? (
                      <span className="zone-selected-indicator">
                        <span>✓</span>
                        <span>Đang lọc {places.filter((p) => p.zoneCode === z.code).length} điểm đến</span>
                      </span>
                    ) : (
                      <span className="zone-action-text">
                        <span>Lọc điểm đến vùng này</span>
                        <span style={{ fontSize: '1.05rem' }}>→</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedZone !== 'all' && (
          <div
            style={{
              marginTop: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '0.8rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.92rem',
              color: '#166534',
            }}
          >
            <div>
              Đang lọc theo phân vùng <strong>{zones.find((z) => z.code === selectedZone)?.name || selectedZone}</strong> ({filteredPlaces.length} điểm đến)
            </div>
            <button
              type="button"
              onClick={() => setSelectedZone('all')}
              style={{
                background: '#133e2f',
                color: '#fff',
                border: 'none',
                padding: '4px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 600,
              }}
            >
              ✕ Hiển thị tất cả điểm đến
            </button>
          </div>
        )}
      </section>

      {/* Search & Phượt Waypoint Filters */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.2rem' }}>
          <div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              📍 RADAR TỌA ĐỘ DU LỊCH & PHƯỢT THỦ
            </span>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: '0.2rem 0 0' }}>
              Trạm Dừng Chân Khám Phá
            </h3>
          </div>

          <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 280px', maxWidth: '400px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên điểm đến, di tích, bãi biển..."
              aria-label="Tìm điểm đến"
              style={{
                width: '100%',
                padding: '0.75rem 1rem 0.75rem 2.5rem',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                fontSize: '0.92rem',
                backgroundColor: '#fff',
                outline: 'none',
              }}
            />
            <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>
              🔍
            </span>
          </div>
        </div>

        <div className="phuot-filter-wrapper">
          <div className="phuot-filter-track">
            {phuotCategories.map((f) => {
              const isActive = selectedCategory === f.id;
              return (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setSelectedCategory(f.id)}
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
                Đang mở <strong>{filteredPlaces.length}</strong> tọa độ
                {selectedCategory !== 'all' && (
                  <span style={{ color: '#059669', fontWeight: 600 }}> · Lọc chủ đề phượt</span>
                )}
                {selectedZone !== 'all' && (
                  <span style={{ color: '#d97706', fontWeight: 600 }}> · Vùng {selectedZone}</span>
                )}
              </span>
            </div>

            {(selectedCategory !== 'all' || selectedZone !== 'all' || search.trim() !== '') && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedZone('all');
                  setSearch('');
                }}
                className="phuot-status-reset-btn"
              >
                ✕ Xem toàn bộ tọa độ
              </button>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', margin: '1.2rem 0 1.5rem' }}>
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

        {placesViewMode === 'map' ? (
          <QuangTriInteractiveMap
            places={filteredPlaces}
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
