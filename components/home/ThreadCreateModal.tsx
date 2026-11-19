'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';
import type { Thread } from '@/lib/supabase/types';

interface ThreadCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: (thread: Thread) => void;
}

export default function ThreadCreateModal({
  isOpen,
  onClose,
  onCreated,
}: ThreadCreateModalProps) {
  const { showToast } = useToast();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const imageUrl = String(fd.get('image') || '').trim();
    setSubmitting(true);

    try {
      const res = await fetch('/api/threads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: fd.get('author'),
          tag: fd.get('tag'),
          zoneCode: fd.get('zoneCode'),
          title: fd.get('title'),
          content: fd.get('content'),
          images: imageUrl ? [imageUrl] : [],
        }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success || !data?.thread) {
        showToast(data?.error || 'Không thể đăng bài viết. Vui lòng kiểm tra nội dung.', 'error');
        return;
      }

      onCreated(data.thread);
      showToast('Bài viết của bạn đã được đăng lên diễn đàn!');
      form.reset();
      onClose();
    } catch {
      showToast('Lỗi kết nối máy chủ khi đăng bài.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="modal-overlay active"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Chia sẻ chuyến đi"
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#133e2f', marginTop: 0 }}>
            Chia Sẻ Chuyến Đi Của Bạn
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Họ tên hoặc Nickname *
              </label>
              <input
                name="author"
                type="text"
                required
                placeholder="Ví dụ: Hoàng Nam (Phượt Sa Mù)..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Chủ đề *
                </label>
                <select name="tag" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                  <option value="Kinh nghiệm">Kinh nghiệm</option>
                  <option value="Hỏi đáp">Hỏi đáp</option>
                  <option value="Review ẩm thực">Review ẩm thực</option>
                  <option value="Săn mây Sa Mù">Săn mây Sa Mù</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Khu vực *
                </label>
                <select name="zoneCode" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                  <option value="QT-05">QT-05 (Sa Mù - Khe Sanh)</option>
                  <option value="QT-02">QT-02 (Thành Cổ Quảng Trị)</option>
                  <option value="QT-03">QT-03 (Vĩ tuyến 17 - Vịnh Mốc)</option>
                  <option value="QT-04">QT-04 (Cửa Việt & Mũi Trèo)</option>
                  <option value="QT-06">QT-06 (Đakrông & Trường Sơn)</option>
                  <option value="QT-07">QT-07 (Đảo Cồn Cỏ)</option>
                  <option value="QT-01">QT-01 (Đông Hà)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Tiêu đề bài viết *
              </label>
              <input
                name="title"
                type="text"
                required
                minLength={3}
                placeholder="Tóm tắt trải nghiệm hoặc câu hỏi..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Nội dung chi tiết (tối thiểu 10 ký tự) *
              </label>
              <textarea
                name="content"
                required
                minLength={10}
                rows={4}
                placeholder="Chia sẻ kinh nghiệm đường đi, chỗ ở, thời tiết..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db', font: 'inherit' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Link ảnh check-in (Tùy chọn)
              </label>
              <input
                name="image"
                type="url"
                placeholder="https://..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: '#133e2f',
                color: '#fff',
                padding: '0.8rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: submitting ? 'wait' : 'pointer',
                marginTop: '0.5rem',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Đang đăng bài...' : 'Đăng Bài Viết'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
