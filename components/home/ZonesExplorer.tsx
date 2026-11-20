'use client';

import React, { useMemo, useState } from 'react';
import SafeImage from '@/components/common/SafeImage';
import { DEFAULT_ZONE_META } from '@/lib/normalize';
import type { Zone } from '@/lib/supabase/types';

interface ZonesExplorerProps {
  zones: Zone[];
  selectedZone: string;
  onSelectZone: (zoneCode: string) => void;
  /** Real number of places per zone code (from the places list) */
  placeCounts: Record<string, number>;
}

export default function ZonesExplorer({
  zones,
  selectedZone,
  onSelectZone,
  placeCounts,
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
            const count = placeCounts[z.code] || 0;
            const isEmpty = count === 0;

            return (
              <div
                key={z.code}
                role="button"
                tabIndex={0}
                aria-pressed={isSelected}
                onClick={() => onSelectZone(z.code)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectZone(z.code);
                  }
                }}
                className={`zone-card ${isSelected ? 'selected' : ''} ${isEmpty ? 'is-empty' : ''}`}
              >
                <div className="zone-card-media" style={{ position: 'relative', overflow: 'hidden' }}>
                  <SafeImage src={z.heroImage} alt={z.name} fill sizes="(max-width: 768px) 100vw, 320px" />
                  <div className="zone-media-gradient" />
                  <span className="zone-code-badge">{z.code}</span>
                  <span className="zone-type-badge">{typeTag}</span>
                  <span className="zone-count-badge">
                    {isEmpty ? '⏳ Sắp cập nhật' : `📍 ${count} điểm đến`}
                  </span>
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
                        <span>Đang xem {count} điểm đến · bấm để bỏ lọc</span>
                      </span>
                    ) : isEmpty ? (
                      <span className="zone-action-text zone-action-muted">
                        <span>Đang cập nhật điểm đến</span>
                      </span>
                    ) : (
                      <span className="zone-action-text">
                        <span>Xem {count} điểm đến</span>
                        <span style={{ fontSize: '1.05rem' }}>→</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
