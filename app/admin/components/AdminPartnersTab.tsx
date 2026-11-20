'use client';

import React from 'react';
import type { PartnerRegistration } from '@/lib/supabase/types';

interface AdminPartnersTabProps {
  registrations: PartnerRegistration[];
  onUpdateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => Promise<void>;
  onRefresh: () => void;
}

export default function AdminPartnersTab({
  registrations,
  onUpdateStatus,
  onRefresh,
}: AdminPartnersTabProps) {
  const statusStyle = (status: string) => {
    if (status === 'approved') return { bg: '#ecfdf5', color: '#047857', label: '✓ Đã duyệt' };
    if (status === 'rejected') return { bg: '#fef2f2', color: '#b91c1c', label: '✕ Từ chối' };
    return { bg: '#fefce8', color: '#a16207', label: '⏳ Chờ duyệt' };
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
            Hồ Sơ Đăng Ký Đối Tác Bản Địa ({registrations.length})
          </h2>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
            Danh sách homestay, nhà xe, vé tàu gửi yêu cầu hợp tác trực tiếp từ website.
          </p>
        </div>
        <button
          onClick={onRefresh}
          style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#f3f4f6', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
        >
          <i className="bi bi-arrow-clockwise" aria-hidden="true" /> Tải lại danh sách
        </button>
      </div>

      <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
        {registrations.length === 0 ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#6b7280', fontSize: '0.9rem' }}>
            Chưa có hồ sơ đăng ký đối tác mới nào trong hệ thống.
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '0.85rem 1rem' }}>Cơ sở / Dịch vụ</th>
                <th style={{ padding: '0.85rem 1rem' }}>Loại & Vùng</th>
                <th style={{ padding: '0.85rem 1rem' }}>Liên hệ</th>
                <th style={{ padding: '0.85rem 1rem' }}>Địa chỉ</th>
                <th style={{ padding: '0.85rem 1rem' }}>Trạng thái</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Duyệt hồ sơ</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((reg) => {
                const st = statusStyle(reg.status);
                return (
                  <tr key={reg.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <strong style={{ color: '#133e2f', display: 'block' }}>{reg.business_name}</strong>
                      <span style={{ fontSize: '0.76rem', color: '#6b7280' }}>
                        {new Date(reg.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700, marginRight: '0.35rem' }}>
                        {reg.service_type}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#4b5563' }}>{reg.zone_code}</span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div>{reg.contact_name}</div>
                      <a href={`tel:${reg.phone}`} style={{ color: '#059669', fontWeight: 700, textDecoration: 'none' }}>
                        {reg.phone}
                      </a>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', maxWidth: '220px', color: '#4b5563' }}>
                      {reg.address}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ background: st.bg, color: st.color, padding: '0.25rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {st.label}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      {reg.status !== 'approved' && (
                        <button
                          onClick={() => onUpdateStatus(reg.id, 'approved')}
                          style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#047857', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700 }}
                        >
                          ✓ Duyệt
                        </button>
                      )}
                      {reg.status !== 'rejected' && (
                        <button
                          onClick={() => onUpdateStatus(reg.id, 'rejected')}
                          style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700 }}
                        >
                          ✕ Từ chối
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
