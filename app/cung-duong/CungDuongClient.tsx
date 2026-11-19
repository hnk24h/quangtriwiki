'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import QuangTriInteractiveMap from '@/components/QuangTriInteractiveMap';

interface CungDuongClientProps {
  places: any[];
  zones: any[];
}

const ZONE_METAS: Record<string, { specialty: string; typeTag: string; typeGroup: 'history' | 'mountain' | 'coastal' }> = {
  'QT-01': {
    specialty: 'Bánh bột lọc & Cháo bột cá lóc',
    typeTag: '🏛️ Đô thị & Cửa ngõ',
    typeGroup: 'history',
  },
  'QT-02': {
    specialty: 'Cháo vạt giường Diên Sanh & Bánh lọc Mỹ Chánh',
    typeTag: '⚔️ Thành Cổ & Đất thiêng',
    typeGroup: 'history',
  },
  'QT-03': {
    specialty: 'Hải sản biển Cửa Tùng & Tôm cá Bến Hải',
    typeTag: '🕊️ Vĩ tuyến 17 & Làng hầm',
    typeGroup: 'history',
  },
  'QT-04': {
    specialty: 'Bún hến Mai Xá (Di sản ẩm thực Việt Nam)',
    typeTag: '🌊 Biển Cửa Việt & Mũi Trèo',
    typeGroup: 'coastal',
  },
  'QT-05': {
    specialty: 'Cà phê Arabica Khe Sanh & Thịt trâu lá trơng',
    typeTag: '☁️ Săn mây Sa Mù & Núi cao',
    typeGroup: 'mountain',
  },
  'QT-06': {
    specialty: 'Cơm lam, rượu cần & Suối khoáng Klu',
    typeTag: '🌲 Trường Sơn & Bản làng',
    typeGroup: 'mountain',
  },
  'QT-07': {
    specialty: 'Cua đá Cồn Cỏ & Rong biển đảo ngọc',
    typeTag: '🏝️ Đảo tiền tiêu & San hô',
    typeGroup: 'coastal',
  },
  'QT-08': {
    specialty: 'Gà đồi Cùa & Cao chè vằng Định Sơn',
    typeTag: '🌿 Căn cứ Tân Sở & Đồi Cùa',
    typeGroup: 'history',
  },
};

export default function CungDuongClient({ places, zones }: CungDuongClientProps) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [zoneTypeFilter, setZoneTypeFilter] = useState<'all' | 'history' | 'mountain' | 'coastal'>('all');
  const [placesViewMode, setPlacesViewMode] = useState<'map' | 'grid'>('map');
  const [activeModal, setActiveModal] = useState<any>(null);

  const phuotCategories = [
    {
      id: 'all',
      icon: '🧭',
      code: 'TỌA ĐỘ TOÀN CẢNH',
      label: 'Tất cả tọa độ',
      badge: '24 ĐIỂM',
      desc: 'Bao quát toàn tỉnh lộ',
    },
    {
      id: 'history',
      icon: '🏛️',
      code: 'VĨ TUYẾN 17 & DMZ',
      label: 'Di tích lịch sử',
      badge: 'HÀO HÙNG',
      desc: 'Thành Cổ · Vịnh Mốc',
    },
    {
      id: 'cloud',
      icon: '☁️',
      code: 'CAO ĐỘ 1.400M',
      label: 'Săn mây Sa Mù',
      badge: 'ĐÈO GIÓ',
      desc: 'Khe Sanh · Điện gió',
    },
    {
      id: 'beach',
      icon: '🏖️',
      code: '75KM BIỂN CÁT',
      label: 'Biển cát trắng',
      badge: 'HOANG SƠ',
      desc: 'Cửa Việt · Mũi Trèo',
    },
    {
      id: 'island',
      icon: '🏝️',
      code: '15 HẢI LÝ BIỂN ĐÔNG',
      label: 'Đảo Cồn Cỏ',
      badge: 'TIỀN ĐỒN',
      desc: 'Lặn ngắm san hô',
    },
    {
      id: 'waterfall',
      icon: '💦',
      code: 'RỪNG NGUYÊN SINH',
      label: 'Thác & Suối ngàn',
      badge: 'TREKKING',
      desc: 'Thác Chênh Vênh · Klu',
    },
  ];

  const filteredPlaces = useMemo(() => {
    return places.filter((p) => {
      let matchCat = selectedCategory === 'all';
      if (!matchCat) {
        if (selectedCategory === 'history') {
          matchCat = p.category === 'history' || p.categoryName?.includes('lịch sử');
        } else if (selectedCategory === 'cloud') {
          matchCat = p.category === 'adventure' || p.category === 'checkin' || p.id?.includes('sa-mu') || p.id?.includes('gio') || p.id?.includes('ta-con') || p.name?.includes('Sa Mù') || p.name?.includes('Gió') || p.name?.includes('Tà Cơn');
        } else if (selectedCategory === 'beach') {
          matchCat = p.category === 'beach' || p.id?.includes('cua-viet') || p.id?.includes('cua-tung') || p.id === 'mui-treo' || p.name?.includes('Biển') || p.name?.includes('Mũi Trèo');
        } else if (selectedCategory === 'island') {
          matchCat = p.category === 'island' || p.id?.includes('con-co') || p.name?.includes('Cồn Cỏ');
        } else if (selectedCategory === 'waterfall') {
          matchCat = p.category === 'nature' || p.id?.includes('thac') || p.id?.includes('suoi') || p.id?.includes('dakrong') || p.name?.includes('Thác') || p.name?.includes('Suối') || p.name?.includes('Đakrông');
        } else {
          matchCat = p.category === selectedCategory;
        }
      }

      const matchZone = selectedZone === 'all' || p.zoneCode === selectedZone || p.zone_code === selectedZone;
      const matchSearch =
        !search ||
        p.name?.toLowerCase().includes(search.toLowerCase()) ||
        p.shortDesc?.toLowerCase().includes(search.toLowerCase()) ||
        p.zoneName?.toLowerCase().includes(search.toLowerCase());
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

        {/* Filter tabs */}
        <div className="zone-filter-tabs">
          {[
            { id: 'all', label: 'Tất cả 8 vùng', count: zones.length },
            { id: 'history', label: '🏛️ Di tích lịch sử & Tâm linh', count: 4 },
            { id: 'mountain', label: '🏔️ Núi cao & Săn mây Sa Mù', count: 2 },
            { id: 'coastal', label: '🏖️ Biển đảo & Sinh thái', count: 2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setZoneTypeFilter(tab.id as any)}
              className={`zone-tab-btn ${zoneTypeFilter === tab.id ? 'active' : ''}`}
            >
              <span>{tab.label}</span>
              <span style={{
                fontSize: '0.75rem',
                opacity: zoneTypeFilter === tab.id ? 1 : 0.7,
                background: zoneTypeFilter === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                padding: '1px 6px',
                borderRadius: '10px'
              }}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="zone-grid">
          {filteredZones.map((z: any) => {
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
                <div className="zone-card-media">
                  <img
                    src={z.heroImage || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'}
                    alt={z.name}
                    loading="lazy"
                  />
                  <div className="zone-media-gradient" />
                  <span className="zone-code-badge">{z.code}</span>
                  <span className="zone-type-badge">{meta.typeTag}</span>
                  <span className="zone-count-badge">📍 {z.featuredCount}</span>
                </div>

                <div className="zone-card-body">
                  <h3 className="zone-card-title">{z.name}</h3>
                  <div className="zone-card-tagline">{z.tagline}</div>

                  {/* Local Specialty Box */}
                  <div className="zone-specialty-box">
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>🍲</span>
                    <div>
                      <span>Đặc sản: </span>
                      <strong>{meta.specialty}</strong>
                    </div>
                  </div>

                  <p className="zone-card-desc">{z.description}</p>

                  <div className="zone-card-footer">
                    {isSelected ? (
                      <span className="zone-selected-indicator">
                        <span>✓</span>
                        <span>Đang lọc {places.filter(p => p.zoneCode === z.code || p.zone_code === z.code).length} điểm đến</span>
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
          <div style={{
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
          }}>
            <div>
              Đang lọc theo phân vùng <strong>{zones.find((z) => z.code === selectedZone)?.name || selectedZone}</strong> ({filteredPlaces.length} điểm đến)
            </div>
            <button
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
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#133e2f', margin: '0.2rem 0 0' }}>
              Trạm Dừng Chân Khám Phá
            </h3>
          </div>

          <div style={{ position: 'relative', minWidth: '280px', flex: '1 1 280px', maxWidth: '400px' }}>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên điểm đến, di tích, bãi biển..."
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

        {/* Phượt Explorer Waypoints Bar */}
        <div className="phuot-filter-wrapper">
          <div className="phuot-filter-track">
            {phuotCategories.map((f) => {
              const isActive = selectedCategory === f.id;
              return (
                <button
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

          {/* Status Readout Strip */}
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

            {(selectedCategory !== 'all' || selectedZone !== 'all') && (
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedZone('all');
                }}
                className="phuot-status-reset-btn"
              >
                ✕ Xem toàn bộ tọa độ
              </button>
            )}
          </div>
        </div>

        {/* View Mode Switcher: Interactive Map vs Grid */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          margin: '1.2rem 0 1.5rem',
        }}>
          <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(19, 62, 47, 0.08)', padding: '4px', borderRadius: '12px' }}>
            <button
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
            places={places}
            onOpenModal={(p) => setActiveModal(p)}
          />
        ) : (
          <div className="places-grid">
            {filteredPlaces.map((p: any) => (
              <article
                key={p.id}
                onClick={() => setActiveModal(p)}
                className="place-card"
                style={{ cursor: 'pointer' }}
              >
                <div className="card-media">
                  <img
                    src={p.image || p.hero_image || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80'}
                    alt={p.name}
                    loading="lazy"
                  />
                  <span className="card-zone-tag">{p.zoneCode || p.zone_code}</span>
                </div>
                <div className="card-body">
                  <div className="card-meta-row">
                    <span className="card-cat">{p.categoryName || p.category_name}</span>
                    <span className="card-rating">★ {p.rating || 4.8} ({p.reviewsCount || p.rating_count || 100})</span>
                  </div>
                  <h3 className="card-title">{p.name}</h3>
                  <p className="card-short-desc">{p.shortDesc || p.short_desc}</p>
                  <div className="card-footer-info">
                    <span className="card-coord">📍 {p.zoneName || p.zone_name}</span>
                    <span className="card-ticket-preview">{p.ticket || p.ticket_price || 'Miễn phí'}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* Place Detail Modal */}
      {activeModal && (
        <div className="modal-overlay active" onClick={() => setActiveModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveModal(null)}>×</button>
            <div className="modal-header-visual">
              <img src={activeModal.image || activeModal.hero_image} alt={activeModal.name} />
              <div className="modal-title-overlay">
                <span className="modal-zone-badge">{activeModal.zoneCode || activeModal.zone_code} · {activeModal.zoneName || activeModal.zone_name}</span>
                <h2>{activeModal.name}</h2>
              </div>
            </div>
            <div className="modal-content-body">
              <p className="modal-desc">{activeModal.fullDesc || activeModal.history || activeModal.shortDesc || activeModal.short_desc}</p>
              {Array.isArray(activeModal.highlights) && activeModal.highlights.length > 0 && (
                <div className="modal-highlights-box">
                  <h4>Điểm nhấn nổi bật:</h4>
                  <ul>
                    {activeModal.highlights.map((hl: string, idx: number) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="modal-meta-grid">
                <div><strong>📍 Địa chỉ:</strong> {activeModal.address}</div>
                <div><strong>🕒 Giờ mở cửa:</strong> {activeModal.openHours || activeModal.open_time || '07:00 - 17:30'}</div>
                <div><strong>🎟️ Giá vé:</strong> {activeModal.ticket || activeModal.ticket_price || 'Miễn phí'}</div>
                <div><strong>🧭 Tọa độ:</strong> {activeModal.coordinates}</div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activeModal.name + ' Quảng Trị')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-map-link-btn"
                >
                  Mở Google Maps chỉ đường ↗
                </a>
                <Link
                  href={`/diem-den/${activeModal.id}`}
                  className="modal-map-link-btn"
                  style={{ backgroundColor: '#fff', color: '#133e2f', border: '1px solid #133e2f' }}
                >
                  Trang SEO chi tiết ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
