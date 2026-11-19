'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useToast } from '@/components/common/ToastProvider';
import { STORAGE_KEYS } from '@/lib/storage';
import type { Itinerary } from '@/lib/supabase/types';

interface LichTrinhClientProps {
  initialItineraries: Itinerary[];
}

export default function LichTrinhClient({ initialItineraries }: LichTrinhClientProps) {
  const { showToast } = useToast();
  const [selectedItinId, setSelectedItinId] = useState(initialItineraries[0]?.id || '');

  const currentItinerary =
    initialItineraries.find((it) => it.id === selectedItinId) || initialItineraries[0];

  const handleSaveToNotebook = () => {
    if (!currentItinerary) return;
    try {
      const existing = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
      const list: string[] = existing ? JSON.parse(existing) : [];
      if (!list.includes(currentItinerary.id)) {
        list.push(currentItinerary.id);
        localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(list));
        showToast(`Đã lưu lộ trình "${currentItinerary.title}" vào Sổ tay!`);
      } else {
        showToast('Lộ trình này đã có trong Sổ tay của bạn.', 'info');
      }
    } catch {
      showToast('Không thể lưu vào trình duyệt.', 'error');
    }
  };

  const timelineSteps = currentItinerary
    ? currentItinerary.steps?.length
      ? currentItinerary.steps
      : currentItinerary.stops || []
    : [];

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        <div
          style={{
            backgroundColor: '#133e2f',
            color: '#fff',
            padding: '4rem 1.5rem 3.5rem',
            textAlign: 'center',
          }}
        >
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              GỢI Ý LỘ TRÌNH KHÁM PHÁ QUẢNG TRỊ
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Lịch Trình Hành Trình Bản Địa
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Được tối ưu cự ly di chuyển, thời gian đón bình minh săn mây và ghé thăm các di tích thiêng liêng nhất của Quảng Trị.
            </p>
          </div>
        </div>

        {/* Tab Selection */}
        <div style={{ maxWidth: '1100px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            {initialItineraries.map((it) => {
              const isActive = it.id === (currentItinerary?.id || '');
              return (
                <button
                  type="button"
                  key={it.id}
                  onClick={() => setSelectedItinId(it.id)}
                  style={{
                    padding: '1.25rem',
                    borderRadius: '12px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    border: isActive ? '2px solid #133e2f' : '1px solid #e5e7eb',
                    background: isActive ? '#fff' : 'rgba(255,255,255,0.65)',
                    boxShadow: isActive ? '0 6px 16px rgba(19, 62, 47, 0.08)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        background: isActive ? '#133e2f' : '#e5e7eb',
                        color: isActive ? '#fff' : '#4b5563',
                      }}
                    >
                      {it.duration}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{it.distance}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', fontWeight: 700, color: '#133e2f' }}>
                    {it.title}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Itinerary Details */}
        {currentItinerary && (
          <div style={{ maxWidth: '1100px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2.25rem',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    LỘ TRÌNH ĐỀ XUẤT
                  </span>
                  <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.1rem', color: '#133e2f', margin: '0.4rem 0 0.8rem' }}>
                    {currentItinerary.title}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.9rem', color: '#4b5563' }}>
                    <div>⏱️ <strong>Thời gian:</strong> {currentItinerary.duration}</div>
                    <div>🛣️ <strong>Cự ly:</strong> {currentItinerary.distance}</div>
                    <div>🎯 <strong>Phù hợp:</strong> {currentItinerary.suitability}</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={handleSaveToNotebook}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: '#133e2f',
                      color: '#fff',
                      padding: '0.75rem 1.4rem',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <span>Lưu vào Sổ tay của tôi</span>
                  </button>

                  <Link
                    href="/chi-phi"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      background: '#fef3c7',
                      color: '#92400e',
                      padding: '0.75rem 1.2rem',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                    }}
                  >
                    <span>Tính chi phí →</span>
                  </Link>
                </div>
              </div>

              {/* Highlights Chips */}
              <div style={{ margin: '1.5rem 0' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#133e2f', display: 'block', marginBottom: '0.6rem' }}>
                  CÁC TRẠM DỪNG CHÂN ĐẶC SẮC:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {(currentItinerary.highlights || []).map((hl, idx) => (
                    <span
                      key={idx}
                      style={{
                        padding: '5px 12px',
                        borderRadius: '20px',
                        background: '#e0f2fe',
                        color: '#0369a1',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      📍 {hl}
                    </span>
                  ))}
                </div>
              </div>

              {/* Step Timeline */}
              <div style={{ marginTop: '2.5rem' }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#133e2f', marginBottom: '1.8rem' }}>
                  Lộ Trình Từng Chặng Chi Tiết
                </h3>

                {timelineSteps.length === 0 ? (
                  <p style={{ color: '#6b7280', fontSize: '0.92rem' }}>
                    {currentItinerary.description}
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative' }}>
                    <div
                      style={{
                        position: 'absolute',
                        top: '20px',
                        bottom: '20px',
                        left: '18px',
                        width: '2px',
                        background: '#e5e7eb',
                        zIndex: 0,
                      }}
                    />

                    {timelineSteps.map((step, idx) => (
                      <div key={idx} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 1 }}>
                        <div
                          style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            background: '#133e2f',
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 700,
                            fontSize: '0.95rem',
                            flexShrink: 0,
                            boxShadow: '0 0 0 4px #f7f4ee',
                          }}
                        >
                          {idx + 1}
                        </div>

                        <div
                          style={{
                            flex: 1,
                            background: '#f9fafb',
                            padding: '1.25rem 1.5rem',
                            borderRadius: '12px',
                            border: '1px solid #e5e7eb',
                          }}
                        >
                          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', gap: '0.5rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#133e2f', fontWeight: 700 }}>
                              {step.name}
                            </h4>
                            <span
                              style={{
                                background: '#dcfce7',
                                color: '#15803d',
                                fontSize: '0.8rem',
                                fontWeight: 600,
                                padding: '3px 10px',
                                borderRadius: '12px',
                              }}
                            >
                              ⏱️ {step.time}
                            </span>
                          </div>
                          <p style={{ margin: 0, color: '#4b5563', lineHeight: 1.6, fontSize: '0.95rem' }}>
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div
                style={{
                  marginTop: '3rem',
                  background: '#fefce8',
                  border: '1px solid #fde047',
                  borderRadius: '12px',
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  gap: '1rem',
                  alignItems: 'flex-start',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>💡</span>
                <div style={{ fontSize: '0.92rem', color: '#854d0e', lineHeight: 1.6 }}>
                  <strong>Lưu ý cho chặng này:</strong> Nhớ kiểm tra áp suất lốp, đổ đầy bình xăng trước khi vào các cung đường đèo dốc hoặc đường nhánh Tây Trường Sơn. Tra cứu nhanh tại trang{' '}
                  <Link href="/tien-ich" style={{ color: '#133e2f', textDecoration: 'underline', fontWeight: 600 }}>
                    Cây xăng & Cứu hộ
                  </Link>
                  .
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
