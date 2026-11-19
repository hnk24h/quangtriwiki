'use client';

import React, { useEffect, useState } from 'react';
import { useToast } from '@/components/common/ToastProvider';

interface PartnerRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PartnerRegistrationModal({
  isOpen,
  onClose,
}: PartnerRegistrationModalProps) {
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
    setSubmitting(true);

    try {
      const res = await fetch('/api/partner-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          business_name: fd.get('business_name'),
          service_type: fd.get('service_type'),
          zone_code: fd.get('zone_code'),
          contact_name: fd.get('contact_name'),
          phone: fd.get('phone'),
          address: fd.get('address'),
          price_range: fd.get('price_range'),
        }),
      });
      const data = await res.json();

      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể gửi hồ sơ lúc này.', 'error');
        return;
      }

      showToast('Đã gửi hồ sơ đăng ký đối tác! Ban quản trị sẽ xác minh trong 24 giờ.');
      form.reset();
      onClose();
    } catch {
      showToast('Lỗi kết nối máy chủ. Vui lòng thử lại.', 'error');
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
      aria-label="Đăng ký đối tác bản địa"
    >
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          ×
        </button>
        <div style={{ padding: '2rem' }}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#133e2f', marginTop: 0 }}>
            Đưa Dịch Vụ Của Bạn Lên QuangTri.wiki
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
            Dành cho chủ homestay, nhà xe máy, nhà tàu cao tốc Cồn Cỏ và hướng dẫn viên bản địa tại Quảng Trị.
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.95rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Tên cơ sở / Dịch vụ *
              </label>
              <input
                name="business_name"
                type="text"
                required
                placeholder="Ví dụ: Sa Mù Homestay, Thuê xe máy Đông Hà..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Loại hình dịch vụ *
                </label>
                <select name="service_type" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                  <option value="homestay">Homestay & Glamping</option>
                  <option value="bike">Cho thuê xe máy</option>
                  <option value="boat">Vé tàu cao tốc Cồn Cỏ</option>
                  <option value="tour">Tour Guide Bản Địa</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Khu vực *
                </label>
                <select name="zone_code" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                  <option value="QT-01">QT-01 · Đông Hà</option>
                  <option value="QT-02">QT-02 · Thành Cổ & Hải Lăng</option>
                  <option value="QT-03">QT-03 · Vĩnh Linh & Vịnh Mốc</option>
                  <option value="QT-04">QT-04 · Cửa Việt & Gio Linh</option>
                  <option value="QT-05">QT-05 · Hướng Hóa & Đèo Sa Mù</option>
                  <option value="QT-06">QT-06 · Đakrông & Trường Sơn</option>
                  <option value="QT-07">QT-07 · Đảo Cồn Cỏ</option>
                  <option value="QT-08">QT-08 · Cam Lộ & Vùng Cùa</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Người liên hệ *
                </label>
                <input
                  name="contact_name"
                  type="text"
                  required
                  placeholder="Anh / Chị..."
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                  Số điện thoại / Zalo *
                </label>
                <input
                  name="phone"
                  type="tel"
                  required
                  placeholder="09xx xxx xxx"
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Địa chỉ cụ thể *
              </label>
              <input
                name="address"
                type="text"
                required
                placeholder="Số nhà, đường, huyện/thị xã..."
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.84rem', fontWeight: 600, marginBottom: '0.3rem' }}>
                Mức giá tham khảo (Tùy chọn)
              </label>
              <input
                name="price_range"
                type="text"
                placeholder="Ví dụ: 350.000đ / đêm hoặc 150.000đ / ngày"
                style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              style={{
                backgroundColor: '#133e2f',
                color: '#fff',
                padding: '0.85rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                cursor: submitting ? 'wait' : 'pointer',
                marginTop: '0.4rem',
                opacity: submitting ? 0.7 : 1,
              }}
            >
              {submitting ? 'Đang gửi hồ sơ...' : 'Gửi Hồ Sơ Xác Minh'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
