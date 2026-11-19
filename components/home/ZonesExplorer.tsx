'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import { DEFAULT_ZONE_META } from '@/lib/normalize';
import type { Zone } from '@/lib/supabase/types';

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

  const getGroup = (z: Zone) => z.typeGroup || DEFAULT_ZONE_META[z.code]?.typeGroup || 'history';

  const counts = useMemo(() => {
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
    <section className="zones-section" id="vung-du-lich">
      <div className="container">
        <div className="zones-header-wrap">
          <div className="zones-badge-kicker">
            <span>🗺️</span>
            <span>HỆ THỐNG MÃ CUNG ĐƯỜNG ({zones.length} KHU VỰC)</span>
          </div>
          <h2 className="zones-main-title">{zones.length} Vùng Di Sản, Danh Thắng & Đặc Sản Bản Địa</h2>
          <p className="zones-lead-desc">
            Quảng Trị được chia tách theo {zones.length} mạch không gian trải nghiệm độc đáo — kết nối di tích lịch sử linh thiêng, bãi biển cát trắng, đại ngàn Trường Sơn săn mây và những đặc sản trứ danh của từng địa phương.
          </p>
        </div>

        <div className="zone-filter-tabs">
          {[
            { id: 'all', label: `Tất cả ${counts.all} vùng`, count: counts.all },
            { id: 'history', label: '🏛️ Di tích lịch sử & Tâm linh', count: counts.history },
            { id: 'mountain', label: '🏔️ Núi cao & Săn mây Sa Mù', count: counts.mountain },
            { id: 'coastal', label: '🏖️ Biển đảo & Sinh thái', count: counts.coastal },
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
            const def = DEFAULT_ZONE_META[z.code];
            const typeTag = z.typeTag || def?.typeTag || 'Điểm đến tiêu biểu';
            const specialty = z.specialty || def?.specialty || 'Ẩm thực & Đặc sản bản địa';
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
                  <span className="zone-type-badge">{typeTag}</span>
                  {z.featuredCount && <span className="zone-count-badge">📍 {z.featuredCount}</span>}
                </div>

                <div className="zone-card-body">
                  <h3 className="zone-card-title">{z.name}</h3>
                  <div className="zone-card-tagline">{z.tagline}</div>

                  <div className="zone-specialty-box">
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>🍲</span>
                    <div>
                      <span>Đặc sản: </span>
                      <strong>{specialty}</strong>
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
