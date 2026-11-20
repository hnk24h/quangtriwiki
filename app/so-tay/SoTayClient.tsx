'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import ScrollReveal from '@/components/common/ScrollReveal';
import SubpageHero from '@/components/common/SubpageHero';
import { useToast } from '@/components/common/ToastProvider';
import {
  ChecklistItem,
  getBookmarkedIds,
  getPackingChecklist,
  getPersonalNotes,
  savePackingChecklist,
  savePersonalNotes,
  STORAGE_KEYS,
  subscribeStorageSync,
  toggleBookmarkId,
} from '@/lib/storage';

export interface MinimalPlaceSummary {
  id: string;
  name: string;
  zoneCode: string;
  zoneName: string;
  image: string;
  shortDesc: string;
  coordinates: string;
}

export interface MinimalItinerarySummary {
  id: string;
  title: string;
  duration: string;
  distance: string;
  suitability: string;
}

interface SoTayClientProps {
  places: MinimalPlaceSummary[];
  itineraries: MinimalItinerarySummary[];
  defaultChecklist: string[];
}

export default function SoTayClient({
  places,
  itineraries,
  defaultChecklist,
}: SoTayClientProps) {
  const { showToast } = useToast();
  const [bookmarkedPlaceIds, setBookmarkedPlaceIds] = useState<string[]>([]);
  const [savedItineraryIds, setSavedItineraryIds] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [notes, setNotes] = useState('');
  const [savedEstimate, setSavedEstimate] = useState<any>(null);

  useEffect(() => {
    const load = () => {
      setBookmarkedPlaceIds(getBookmarkedIds());
      setChecklist(getPackingChecklist(defaultChecklist));
      setNotes(getPersonalNotes());
      try {
        const itin = localStorage.getItem(STORAGE_KEYS.ITINERARIES);
        setSavedItineraryIds(itin ? JSON.parse(itin) : []);
        const est = localStorage.getItem(STORAGE_KEYS.ESTIMATE);
        setSavedEstimate(est ? JSON.parse(est) : null);
      } catch {
        // ignore
      }
    };

    load();
    return subscribeStorageSync(load);
  }, [defaultChecklist]);

  const toggleChecklistItem = (index: number) => {
    const next = checklist.map((item, i) =>
      i === index ? { ...item, done: !item.done } : item
    );
    setChecklist(next);
    savePackingChecklist(next);
  };

  const addChecklistItem = () => {
    if (!newItemText.trim()) return;
    const next = [...checklist, { text: newItemText.trim(), done: false }];
    setChecklist(next);
    savePackingChecklist(next);
    setNewItemText('');
    showToast('Đã thêm vật dụng vào danh sách chuẩn bị!');
  };

  const removeChecklistItem = (index: number) => {
    const next = checklist.filter((_, i) => i !== index);
    setChecklist(next);
    savePackingChecklist(next);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    savePersonalNotes(val);
  };

  const removeBookmark = (id: string) => {
    const { ids } = toggleBookmarkId(id);
    setBookmarkedPlaceIds(ids);
    showToast('Đã bỏ điểm đến khỏi Sổ tay.');
  };

  const removeItinerary = (id: string) => {
    const next = savedItineraryIds.filter((it) => it !== id);
    setSavedItineraryIds(next);
    try {
      localStorage.setItem(STORAGE_KEYS.ITINERARIES, JSON.stringify(next));
    } catch {
      // ignore
    }
    showToast('Đã bỏ lộ trình khỏi Sổ tay.');
  };

  const bookmarkedPlaces = places.filter((p) => bookmarkedPlaceIds.includes(p.id));
  const bookmarkedItineraries = itineraries.filter((it) => savedItineraryIds.includes(it.id));

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        <SubpageHero
          kicker="SỔ TAY CÁ NHÂN CỦA BẠN"
          kickerIcon="bi-journal-bookmark"
          title="Sổ Tay Hành Trình Quảng Trị"
          subtitle="Lưu giữ điểm đến yêu thích, lịch trình đã chọn, danh mục hành trang và ghi chú chuyến đi hoàn toàn riêng tư trên trình duyệt."
          highlights={[
            { icon: 'bi-geo-alt-fill', label: `${bookmarkedPlaces.length} điểm đến đã lưu` },
            { icon: 'bi-calendar3', label: `${bookmarkedItineraries.length} lịch trình đã chọn` },
            { icon: 'bi-printer', label: 'Hỗ trợ in / lưu PDF' },
          ]}
          slides={[
            {
              image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
              tag: 'LƯU TRỮ RIÊNG TƯ',
              title: 'Checklist Hành Trang Chuẩn Cung Đèo',
              caption: 'Đánh dấu áo ấm, giấy tờ xe, thuốc men và pin dự phòng trước khi lên đường.',
            },
            {
              image: '/images/phong-nha-cave.jpg',
              tag: 'ĐIỂM ĐẾN YÊU THÍCH',
              title: 'Gom Gọn Điểm Đến & Lộ Trình',
              caption: 'Lưu nhanh các tọa độ muốn ghé để mở xem ngay cả khi di chuyển qua vùng sóng yếu.',
            },
            {
              image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
              tag: 'GHI CHÚ CÁ NHÂN',
              title: 'Lưu Số Tài Xế & Homestay Đã Hẹn',
              caption: 'Tự động lưu trên trình duyệt của bạn, có thể in ra bản PDF cầm tay tiện lợi.',
            },
          ]}
        />

        {/* Summary Bar */}
        <ScrollReveal variant="fade-in">
        <div style={{ maxWidth: '1150px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem',
              background: '#fff',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(27,42,34,0.08)',
            }}
          >
            <div style={{ fontSize: '0.95rem', color: '#4b5563' }}>
              <i className="bi bi-geo-alt-fill" aria-hidden="true" /> <strong>{bookmarkedPlaces.length}</strong> điểm đến · <i className="bi bi-calendar3" aria-hidden="true" /> <strong>{bookmarkedItineraries.length}</strong> lịch trình · <i className="bi bi-backpack" aria-hidden="true" /> <strong>{checklist.filter((c) => c.done).length}/{checklist.length}</strong> hành trang đã sẵn sàng
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: '#133e2f',
                color: '#fff',
                padding: '0.6rem 1.2rem',
                borderRadius: '8px',
                border: 'none',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
              }}
            >
              <span><i className="bi bi-printer" aria-hidden="true" /> In / Lưu file PDF</span>
            </button>
          </div>
        </div>
        </ScrollReveal>

        <div style={{ maxWidth: '1150px', margin: '2.5rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* 1. Bookmarked Places */}
          <ScrollReveal>
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', margin: 0 }}>
                <i className="bi bi-geo-alt-fill" aria-hidden="true" /> Điểm Đến Đã Đánh Dấu ({bookmarkedPlaces.length})
              </h2>
              <Link href="/cung-duong" style={{ color: '#133e2f', fontSize: '0.9rem', fontWeight: 600 }}>
                + Khám phá thêm điểm đến →
              </Link>
            </div>

            {bookmarkedPlaces.length === 0 ? (
              <div style={{ background: '#fff', padding: '3rem', borderRadius: '12px', textAlign: 'center', border: '1px solid #e5e7eb' }}>
                <p style={{ color: '#6b7280', fontSize: '1.05rem', margin: '0 0 1rem 0' }}>
                  Bạn chưa lưu điểm đến nào. Hãy bấm biểu tượng bookmark trên các điểm đến tại trang Khám phá cung đường.
                </p>
                <Link
                  href="/cung-duong"
                  style={{
                    display: 'inline-block',
                    background: '#133e2f',
                    color: '#fff',
                    padding: '0.65rem 1.4rem',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Xem Điểm Đến Quảng Trị
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {bookmarkedPlaces.map((place) => (
                  <div
                    key={place.id}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      border: '1px solid rgba(27,42,34,0.08)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: '180px' }}>
                      <SafeImage src={place.image} alt={place.name} fill sizes="(max-width: 768px) 100vw, 360px" />
                      <button
                        type="button"
                        onClick={() => removeBookmark(place.id)}
                        title="Bỏ lưu"
                        aria-label={`Bỏ lưu ${place.name}`}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(255,255,255,0.92)',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                          zIndex: 2,
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
                        {place.zoneCode} · {place.zoneName}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#133e2f', margin: '0.3rem 0 0.5rem' }}>
                        {place.name}
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                        {place.shortDesc}
                      </p>
                      <Link
                        href={`/diem-den/${place.id}`}
                        style={{
                          marginTop: 'auto',
                          textAlign: 'center',
                          background: '#f3f4f6',
                          color: '#133e2f',
                          padding: '0.55rem',
                          borderRadius: '6px',
                          textDecoration: 'none',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                        }}
                      >
                        Xem chi tiết điểm đến →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          </ScrollReveal>

          {/* 2. Saved Itineraries */}
          {bookmarkedItineraries.length > 0 && (
            <ScrollReveal delayMs={60}>
            <section>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.65rem', color: '#133e2f', margin: 0 }}>
                  <i className="bi bi-calendar3" aria-hidden="true" /> Lộ Trình Đã Lưu ({bookmarkedItineraries.length})
                </h2>
                <Link href="/lich-trinh" style={{ color: '#133e2f', fontSize: '0.9rem', fontWeight: 600 }}>
                  Xem toàn bộ lộ trình →
                </Link>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {bookmarkedItineraries.map((it) => (
                  <div
                    key={it.id}
                    style={{
                      background: '#fff',
                      borderRadius: '12px',
                      padding: '1.25rem 1.5rem',
                      border: '1px solid #e5e7eb',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#047857', background: '#ecfdf5', padding: '2px 8px', borderRadius: '6px' }}>
                        {it.duration} · {it.distance}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#133e2f', margin: '0.5rem 0 0.25rem' }}>
                        {it.title}
                      </h3>
                      <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>{it.suitability}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItinerary(it.id)}
                      aria-label={`Bỏ lưu lộ trình ${it.title}`}
                      style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '0.95rem' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </section>
            </ScrollReveal>
          )}

          {/* 3. Packing Checklist & Personal Notes */}
          <ScrollReveal delayMs={80}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <div
              style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              }}
            >
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#133e2f', margin: '0 0 1.2rem 0' }}>
                <i className="bi bi-backpack" aria-hidden="true" /> Hành Trang Cần Chuẩn Bị
              </h2>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Thêm món đồ cần mang..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') addChecklistItem();
                  }}
                  style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
                <button
                  type="button"
                  onClick={addChecklistItem}
                  style={{ background: '#133e2f', color: '#fff', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Thêm
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                {checklist.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0.8rem',
                      background: item.done ? '#f0fdf4' : '#f9fafb',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                    }}
                  >
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', cursor: 'pointer', flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={item.done}
                        onChange={() => toggleChecklistItem(idx)}
                        style={{ width: '18px', height: '18px', accentColor: '#133e2f' }}
                      />
                      <span
                        style={{
                          fontSize: '0.92rem',
                          color: item.done ? '#15803d' : '#374151',
                          textDecoration: item.done ? 'line-through' : 'none',
                        }}
                      >
                        {item.text}
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => removeChecklistItem(idx)}
                      aria-label={`Xóa ${item.text}`}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', padding: '2px 6px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {savedEstimate && (
                <div
                  style={{
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid #fde047',
                    backgroundColor: '#fefce8',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                      DỰ TOÁN ĐÃ LƯU ({savedEstimate.date})
                    </span>
                    <Link href="/chi-phi" style={{ fontSize: '0.85rem', color: '#854d0e', textDecoration: 'underline' }}>
                      Tính lại →
                    </Link>
                  </div>
                  <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', fontWeight: 700, color: '#133e2f' }}>
                    {new Intl.NumberFormat('vi-VN').format(savedEstimate.grandTotal)} đ
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.3rem' }}>
                    Cho đoàn {savedEstimate.people} người · {savedEstimate.days} ngày (
                    {new Intl.NumberFormat('vi-VN').format(savedEstimate.costPerPerson)} đ/người)
                  </div>
                </div>
              )}

              <div
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '2rem',
                  border: '1px solid rgba(27,42,34,0.08)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', color: '#133e2f', margin: '0 0 0.5rem 0' }}>
                  <i className="bi bi-journal-text" aria-hidden="true" /> Ghi Chú & Lịch Trình Riêng
                </h2>
                <p style={{ fontSize: '0.85rem', color: '#6b7280', margin: '0 0 1rem 0' }}>
                  Ghi lại số điện thoại tài xế, homestay đã hẹn hoặc các điểm muốn ghé thêm. Tự động lưu trên máy của bạn.
                </p>
                <textarea
                  value={notes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Ví dụ: Đã hẹn anh Hùng homestay Khe Sanh lúc 14h chiều thứ 7..."
                  style={{
                    flex: 1,
                    minHeight: '180px',
                    padding: '1rem',
                    borderRadius: '8px',
                    border: '1px solid #d1d5db',
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>
            </div>
          </div>
          </ScrollReveal>
        </div>
      </main>

      <Footer />
    </div>
  );
}
