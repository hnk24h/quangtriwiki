'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import type { Place } from '@/lib/supabase/types';

interface PlaceQuickModalProps {
  place: Place | null;
  isBookmarked?: boolean;
  onToggleBookmark?: (id: string) => void;
  onClose: () => void;
}

export default function PlaceQuickModal({
  place,
  isBookmarked = false,
  onToggleBookmark,
  onClose,
}: PlaceQuickModalProps) {
  useEffect(() => {
    if (!place) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [place, onClose]);

  if (!place) return null;

  return (
    <div className="modal-overlay active" onClick={onClose} role="dialog" aria-modal="true" aria-label={place.name}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Đóng cửa sổ">
          ×
        </button>

        <div className="modal-header-visual" style={{ position: 'relative' }}>
          <SafeImage
            src={place.image || place.hero_image}
            alt={place.name}
            fill
            sizes="(max-width: 768px) 100vw, 760px"
          />
          <div className="modal-title-overlay">
            <span className="modal-zone-badge">
              {place.zoneCode} · {place.zoneName}
            </span>
            <h2>{place.name}</h2>
          </div>
        </div>

        <div className="modal-content-body">
          <p className="modal-desc">{place.fullDesc || place.history || place.shortDesc}</p>

          {Array.isArray(place.highlights) && place.highlights.length > 0 && (
            <div className="modal-highlights-box">
              <h4>Điểm nhấn nổi bật:</h4>
              <ul>
                {place.highlights.map((hl, idx) => (
                  <li key={idx}>{hl}</li>
                ))}
              </ul>
            </div>
          )}

          {place.tips && (
            <div
              style={{
                background: '#fefce8',
                borderLeft: '3px solid #d97706',
                padding: '0.75rem 1rem',
                borderRadius: '0 8px 8px 0',
                fontSize: '0.86rem',
                color: '#854d0e',
                marginBottom: '1rem',
              }}
            >
              <strong>💡 Lời khuyên phượt thủ:</strong> {place.tips}
            </div>
          )}

          <div className="modal-meta-grid">
            <div>
              <strong>📍 Địa chỉ:</strong> {place.address}
            </div>
            <div>
              <strong>🕒 Giờ mở cửa:</strong> {place.openHours || '07:00 - 17:30'}
            </div>
            <div>
              <strong>🎟️ Giá vé:</strong> {place.ticket || 'Miễn phí'}
            </div>
            <div>
              <strong>🧭 Tọa độ:</strong> {place.coordinates}
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Quảng Trị')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="modal-map-link-btn"
              style={{ flex: '1 1 180px' }}
            >
              Mở Google Maps chỉ đường ↗
            </a>
            <Link
              href={`/diem-den/${place.id}`}
              onClick={onClose}
              className="modal-map-link-btn"
              style={{ flex: '1 1 180px', backgroundColor: '#fff', color: '#133e2f', border: '1px solid #133e2f' }}
            >
              Xem trang chi tiết ↗
            </Link>
            {onToggleBookmark && (
              <button
                type="button"
                onClick={() => onToggleBookmark(place.id)}
                className="modal-map-link-btn"
                style={{
                  backgroundColor: isBookmarked ? '#fef3c7' : '#f3f4f6',
                  color: isBookmarked ? '#92400e' : '#1f2937',
                  border: '1px solid #d1d5db',
                }}
              >
                {isBookmarked ? '★ Đã lưu sổ tay' : '☆ Lưu sổ tay'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
