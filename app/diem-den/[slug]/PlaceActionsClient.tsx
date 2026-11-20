'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import { getBookmarkedIds, subscribeStorageSync, toggleBookmarkId } from '@/lib/storage';

interface PlaceActionsClientProps {
  placeId: string;
  placeName: string;
  coordinates: string;
}

export default function PlaceActionsClient({
  placeId,
  placeName,
  coordinates,
}: PlaceActionsClientProps) {
  const { showToast } = useToast();
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    setIsBookmarked(getBookmarkedIds().includes(placeId));
    return subscribeStorageSync(() => {
      setIsBookmarked(getBookmarkedIds().includes(placeId));
    });
  }, [placeId]);

  const handleBookmark = () => {
    const { added } = toggleBookmarkId(placeId);
    setIsBookmarked(added);
    showToast(added ? `Đã lưu "${placeName}" vào Sổ tay!` : 'Đã bỏ khỏi Sổ tay.');
  };

  const handleCopyGps = async () => {
    try {
      await navigator.clipboard.writeText(coordinates);
      showToast(`Đã sao chép tọa độ GPS: ${coordinates}`);
    } catch {
      showToast('Trình duyệt không hỗ trợ sao chép tự động.', 'info');
    }
  };

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: `${placeName} · QuangTri.wiki`,
          text: `Khám phá ${placeName} trên cẩm nang du lịch QuangTri.wiki`,
          url: shareUrl,
        });
        return;
      } catch {
        // user cancelled or unsupported -> fallback to copy URL
      }
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      showToast('Đã sao chép đường dẫn chia sẻ!');
    } catch {
      showToast('Không thể sao chép liên kết.', 'error');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
      <button
        type="button"
        onClick={handleBookmark}
        style={{
          width: '100%',
          padding: '0.7rem 1rem',
          borderRadius: '10px',
          border: isBookmarked ? '1px solid #d97706' : '1px solid #d1d5db',
          backgroundColor: isBookmarked ? '#fef3c7' : '#f9fafb',
          color: isBookmarked ? '#92400e' : '#133e2f',
          fontWeight: 700,
          fontSize: '0.88rem',
          cursor: 'pointer',
        }}
      >
        {isBookmarked ? (
          <><i className="bi bi-star-fill" aria-hidden="true" /> Đã lưu trong Sổ tay</>
        ) : (
          <><i className="bi bi-star" aria-hidden="true" /> Lưu vào Sổ tay của tôi</>
        )}
      </button>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
        <button
          type="button"
          onClick={handleCopyGps}
          style={{
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            color: '#374151',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <i className="bi bi-geo-alt-fill" aria-hidden="true" /> Chép GPS
        </button>

        <button
          type="button"
          onClick={handleShare}
          style={{
            padding: '0.6rem 0.75rem',
            borderRadius: '10px',
            border: '1px solid #e5e7eb',
            backgroundColor: '#fff',
            color: '#374151',
            fontWeight: 600,
            fontSize: '0.82rem',
            cursor: 'pointer',
          }}
        >
          <i className="bi bi-share" aria-hidden="true" /> Chia sẻ
        </button>
      </div>
    </div>
  );
}
