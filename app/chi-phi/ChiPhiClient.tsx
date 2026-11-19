'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { useToast } from '@/components/common/ToastProvider';
import { STORAGE_KEYS } from '@/lib/storage';

export default function ChiPhiClient() {
  const { showToast } = useToast();
  const [days, setDays] = useState(2);
  const [people, setPeople] = useState(2);
  const [vehicle, setVehicle] = useState<'motorbike' | 'car' | 'bus'>('motorbike');
  const [stayType, setStayType] = useState<'homestay' | 'hotel' | 'resort'>('homestay');
  const [foodLevel, setFoodLevel] = useState<'saving' | 'standard' | 'seafood'>('standard');
  const [includeConCo, setIncludeConCo] = useState(false);
  const [includeTickets, setIncludeTickets] = useState(true);

  let vehicleCost = 0;
  if (vehicle === 'motorbike') {
    const bikeCount = Math.ceil(people / 2);
    vehicleCost = bikeCount * (150000 + 70000) * days;
  } else if (vehicle === 'car') {
    vehicleCost = (800000 + 250000) * days;
  } else {
    vehicleCost = 350000 * people;
  }

  const nights = Math.max(1, days - 1);
  let stayRatePerPersonPerNight = 200000;
  if (stayType === 'hotel') stayRatePerPersonPerNight = 350000;
  if (stayType === 'resort') stayRatePerPersonPerNight = 750000;
  const stayCost = stayRatePerPersonPerNight * people * nights;

  let foodRatePerPersonPerDay = 300000;
  if (foodLevel === 'saving') foodRatePerPersonPerDay = 160000;
  if (foodLevel === 'seafood') foodRatePerPersonPerDay = 500000;
  const foodCost = foodRatePerPersonPerDay * people * days;

  let ticketCost = 0;
  if (includeTickets) ticketCost += 150000 * people;
  if (includeConCo) ticketCost += 300000 * people;

  const subtotal = vehicleCost + stayCost + foodCost + ticketCost;
  const contingency = Math.round(subtotal * 0.1);
  const grandTotal = subtotal + contingency;
  const costPerPerson = Math.round(grandTotal / Math.max(1, people));

  const formatVND = (num: number) => `${new Intl.NumberFormat('vi-VN').format(num)} đ`;

  const handleSaveEstimate = () => {
    try {
      const estimate = {
        days,
        people,
        vehicle,
        stayType,
        foodLevel,
        grandTotal,
        costPerPerson,
        date: new Date().toLocaleDateString('vi-VN'),
      };
      localStorage.setItem(STORAGE_KEYS.ESTIMATE, JSON.stringify(estimate));
      showToast('Đã lưu dự toán chi phí vào Sổ tay của bạn!');
    } catch {
      showToast('Không thể lưu dự toán vào trình duyệt.', 'error');
    }
  };

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
              DỰ TOÁN MINH BẠCH · KHÔNG PHÁT SINH
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Dự Toán Chi Phí Chuyến Đi
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Tùy chỉnh số ngày, số lượng người, phương tiện và phong cách trải nghiệm để nhận bảng dự toán ngân sách chi tiết nhất.
            </p>
          </div>
        </div>

        <div style={{ maxWidth: '1150px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', alignItems: 'start' }}>
            {/* Control Form */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.5rem',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: '#133e2f', margin: 0 }}>
                1. Thông Số Chuyến Đi
              </h2>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Số ngày lưu trú:
                  </label>
                  <select
                    value={days}
                    onChange={(e) => setDays(Number(e.target.value))}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                  >
                    <option value={1}>1 ngày (Đi trong ngày)</option>
                    <option value={2}>2 ngày 1 đêm</option>
                    <option value={3}>3 ngày 2 đêm</option>
                    <option value={4}>4 ngày 3 đêm</option>
                    <option value={5}>5 ngày 4 đêm</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.4rem' }}>
                    Số lượng người:
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    value={people}
                    onChange={(e) => setPeople(Math.max(1, Number(e.target.value)))}
                    style={{ width: '100%', padding: '0.65rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.95rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.6rem' }}>
                  Phương tiện di chuyển:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  {[
                    { id: 'motorbike', label: '🛵 Xe máy phượt', note: '150k/xe/ngày' },
                    { id: 'car', label: '🚗 Thuê ô tô tự lái', note: '800k/ngày' },
                    { id: 'bus', label: '🚌 Xe khách / Tàu', note: '350k/người' },
                  ].map((v) => (
                    <button
                      type="button"
                      key={v.id}
                      onClick={() => setVehicle(v.id as any)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: vehicle === v.id ? '2px solid #133e2f' : '1px solid #e5e7eb',
                        background: vehicle === v.id ? '#f0fdf4' : '#fff',
                        fontWeight: vehicle === v.id ? 600 : 400,
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', color: '#133e2f' }}>{v.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{v.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.6rem' }}>
                  Hình thức lưu trú:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  {[
                    { id: 'homestay', label: '🏡 Homestay / Glamping', note: '200k/người/đêm' },
                    { id: 'hotel', label: '🏨 Khách sạn 2-3 sao', note: '350k/người/đêm' },
                    { id: 'resort', label: '✨ Khách sạn cao cấp', note: '750k/người/đêm' },
                  ].map((s) => (
                    <button
                      type="button"
                      key={s.id}
                      onClick={() => setStayType(s.id as any)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: stayType === s.id ? '2px solid #133e2f' : '1px solid #e5e7eb',
                        background: stayType === s.id ? '#f0fdf4' : '#fff',
                        fontWeight: stayType === s.id ? 600 : 400,
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', color: '#133e2f' }}>{s.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{s.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#374151', marginBottom: '0.6rem' }}>
                  Mức độ ẩm thực:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.6rem' }}>
                  {[
                    { id: 'saving', label: '🍜 Tiết kiệm', note: '160k/người/ngày' },
                    { id: 'standard', label: '🍲 Chuẩn đặc sản', note: '300k/người/ngày' },
                    { id: 'seafood', label: '🦀 Hải sản / Rừng', note: '500k/người/ngày' },
                  ].map((f) => (
                    <button
                      type="button"
                      key={f.id}
                      onClick={() => setFoodLevel(f.id as any)}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        cursor: 'pointer',
                        border: foodLevel === f.id ? '2px solid #133e2f' : '1px solid #e5e7eb',
                        background: foodLevel === f.id ? '#f0fdf4' : '#fff',
                        fontWeight: foodLevel === f.id ? 600 : 400,
                      }}
                    >
                      <div style={{ fontSize: '0.9rem', color: '#133e2f' }}>{f.label}</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280', marginTop: '2px' }}>{f.note}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeTickets}
                    onChange={(e) => setIncludeTickets(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#133e2f' }}
                  />
                  <span>Bao gồm vé tham quan di tích (~150k/người)</span>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', color: '#374151', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={includeConCo}
                    onChange={(e) => setIncludeConCo(e.target.checked)}
                    style={{ width: '18px', height: '18px', accentColor: '#133e2f' }}
                  />
                  <span>Có đi tàu cao tốc khứ hồi đảo Cồn Cỏ (+300k/người)</span>
                </label>
              </div>
            </div>

            {/* Cost Breakdown Display */}
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2.5rem',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 6px 20px rgba(19, 62, 47, 0.06)',
                position: 'sticky',
                top: '100px',
              }}
            >
              <span style={{ fontSize: '0.8rem', color: '#d97706', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                KẾT QUẢ DỰ TOÁN TỔNG THỂ
              </span>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: '0.3rem 0 1.5rem' }}>
                Ngân Sách Ước Tính
              </h2>

              <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', marginBottom: '1.5rem', textAlign: 'center' }}>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Chi phí trung bình mỗi người:</div>
                <div style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', fontWeight: 700, color: '#133e2f', margin: '0.2rem 0' }}>
                  {formatVND(costPerPerson)}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  Tổng chi phí nhóm ({people} người · {days} ngày): <strong>{formatVND(grandTotal)}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem', fontSize: '0.92rem', color: '#4b5563', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>🛵 Phương tiện & Xăng cộ:</span>
                  <strong style={{ color: '#1e293b' }}>{formatVND(vehicleCost)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>🏡 Lưu trú ({nights} đêm):</span>
                  <strong style={{ color: '#1e293b' }}>{formatVND(stayCost)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>🍲 Ẩm thực ({days} ngày):</span>
                  <strong style={{ color: '#1e293b' }}>{formatVND(foodCost)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>🎟️ Vé tham quan & Tàu biển:</span>
                  <strong style={{ color: '#1e293b' }}>{formatVND(ticketCost)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#94a3b8' }}>
                  <span>🛡️ Dự phòng phát sinh (10%):</span>
                  <strong>{formatVND(contingency)}</strong>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                <button
                  type="button"
                  onClick={handleSaveEstimate}
                  style={{
                    width: '100%',
                    padding: '0.85rem',
                    background: '#133e2f',
                    color: '#fff',
                    borderRadius: '8px',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                  }}
                >
                  Lưu dự toán vào Sổ tay
                </button>

                <Link
                  href="/dich-vu"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    background: '#fef3c7',
                    color: '#92400e',
                    borderRadius: '8px',
                    textAlign: 'center',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    display: 'block',
                  }}
                >
                  Liên hệ Homestay & Thuê xe giá tốt →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
