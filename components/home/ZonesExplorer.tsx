'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import type { Zone } from '@/lib/supabase/types';

export const ZONE_METAS: Record<
  string,
  { specialty: string; typeTag: string; typeGroup: 'history' | 'mountain' | 'coastal' }
> = {
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

interface ZonesExplorerProps {
  zones: Zone[];
  selectedZone: string;
  onSelectZone: (zoneCode: string) => void;
  filteredPlacesCount: number;
}

export default function ZonesExplorer({
  zones,
  selectedZone,
  onSelectZone,
  filteredPlacesCount,
}: ZonesExplorerProps) {
  const [zoneTypeFilter, setZoneTypeFilter] = useState<'all' | 'history' | 'mountain' | 'coastal'>('all');

  const filteredZones = useMemo(() => {
    if (zoneTypeFilter === 'all') return zones;
    return zones.filter((z) => {
      const meta = ZONE_METAS[z.code];
      return meta && meta.typeGroup === zoneTypeFilter;
    });
  }, [zones, zoneTypeFilter]);

  return (
    <section className="zones-section" id="vung-du-lich">
      <div className="container">
        <div className="zones-header-wrap">
          <div className="zones-badge-kicker">
            <span>🗺️</span>
            <span>HỆ THỐNG MÃ CUNG ĐƯỜNG QT-01 → QT-08</span>
          </div>
          <h2 className="zones-main-title">8 Vùng Di Sản, Danh Thắng & Đặc Sản Bản Địa</h2>
          <p className="zones-lead-desc">
            Quảng Trị được chia tách theo 8 mạch không gian trải nghiệm độc đáo — kết nối di tích lịch sử linh thiêng, bãi biển cát trắng, đại ngàn Trường Sơn săn mây và những đặc sản trứ danh của từng địa phương.
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
                onClick={() => {
                  if (isSelected) {
                    onSelectZone('all');
                  } else {
                    onSelectZone(z.code);
                    const el = document.getElementById('cung-duong');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
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
                        <span>Đang chọn lọc điểm đến</span>
                      </span>
                    ) : (
                      <span className="zone-action-text">
                        <span>Xem điểm đến & đặc sản</span>
                        <span style={{ fontSize: '1.05rem' }}>→</span>
                      </span>
                    )}
                    <Link
                      href="/cung-duong"
                      onClick={(e) => e.stopPropagation()}
                      style={{ fontSize: '0.78rem', color: '#6b7280', textDecoration: 'none' }}
                      title="Xem trang chi tiết cung đường"
                    >
                      Chi tiết
                    </Link>
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
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div>
              Đang lọc các điểm đến thuộc{' '}
              <strong>{zones.find((z) => z.code === selectedZone)?.name || selectedZone}</strong> (
              {filteredPlacesCount} địa danh)
            </div>
            <button
              type="button"
              onClick={() => onSelectZone('all')}
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
              ✕ Xóa bộ lọc vùng
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
