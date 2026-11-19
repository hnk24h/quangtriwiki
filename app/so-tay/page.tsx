'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { QUANGTRI_DATA } from '@/lib/data';

export default function SoTayPage() {
  const [bookmarkedPlaceIds, setBookmarkedPlaceIds] = useState<string[]>([]);
  const [savedItineraryIds, setSavedItineraryIds] = useState<string[]>([]);
  const [checklist, setChecklist] = useState<{ text: string; done: boolean }[]>([]);
  const [newItemText, setNewItemText] = useState('');
  const [notes, setNotes] = useState('');
  const [savedEstimate, setSavedEstimate] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      // Bookmarks
      const bm = localStorage.getItem('qt_bookmarks');
      if (bm) setBookmarkedPlaceIds(JSON.parse(bm));

      // Itineraries
      const itin = localStorage.getItem('qt_saved_itineraries');
      if (itin) setSavedItineraryIds(JSON.parse(itin));

      // Checklist
      const savedCl = localStorage.getItem('qt_packing_checklist');
      if (savedCl) {
        setChecklist(JSON.parse(savedCl));
      } else {
        const defaultItems = (QUANGTRI_DATA.guides?.packingChecklist || []).map((t) => ({
          text: t,
          done: false,
        }));
        setChecklist(defaultItems);
      }

      // Notes
      const savedNotes = localStorage.getItem('qt_personal_notes');
      if (savedNotes) setNotes(savedNotes);

      // Estimate
      const est = localStorage.getItem('qt_saved_estimate');
      if (est) setSavedEstimate(JSON.parse(est));
    } catch (e) {}
  }, []);

  const saveChecklist = (newList: { text: string; done: boolean }[]) => {
    setChecklist(newList);
    try {
      localStorage.setItem('qt_packing_checklist', JSON.stringify(newList));
    } catch (e) {}
  };

  const toggleChecklistItem = (index: number) => {
    const next = [...checklist];
    next[index].done = !next[index].done;
    saveChecklist(next);
  };

  const addChecklistItem = () => {
    if (!newItemText.trim()) return;
    const next = [...checklist, { text: newItemText.trim(), done: false }];
    saveChecklist(next);
    setNewItemText('');
  };

  const removeChecklistItem = (index: number) => {
    const next = checklist.filter((_, i) => i !== index);
    saveChecklist(next);
  };

  const handleNotesChange = (val: string) => {
    setNotes(val);
    try {
      localStorage.setItem('qt_personal_notes', val);
    } catch (e) {}
  };

  const removeBookmark = (id: string) => {
    const next = bookmarkedPlaceIds.filter((p) => p !== id);
    setBookmarkedPlaceIds(next);
    try {
      localStorage.setItem('qt_bookmarks', JSON.stringify(next));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {}
  };

  const removeItinerary = (id: string) => {
    const next = savedItineraryIds.filter((it) => it !== id);
    setSavedItineraryIds(next);
    try {
      localStorage.setItem('qt_saved_itineraries', JSON.stringify(next));
    } catch (e) {}
  };

  // Matched places
  const bookmarkedPlaces = (QUANGTRI_DATA.places || []).filter((p) =>
    bookmarkedPlaceIds.includes(p.id)
  );

  // Matched itineraries
  const bookmarkedItineraries = (QUANGTRI_DATA.itineraries || []).filter((it) =>
    savedItineraryIds.includes(it.id)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <div style={{
          backgroundColor: '#133e2f',
          color: '#fff',
          padding: '4rem 1.5rem 3.5rem',
          textAlign: 'center',
          position: 'relative',
        }}>
          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              SỔ TAY CÁ NHÂN CỦA BẠN
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Sổ Tay Hành Trình Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Lưu giữ những điểm đến yêu thích, lịch trình đã chọn, danh mục hành trang và ghi chú chuyến đi hoàn toàn riêng tư trên trình duyệt.
            </p>
          </div>
        </div>

        {/* Notebook Actions Bar */}
        <div style={{ maxWidth: '1150px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            background: '#fff',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(27,42,34,0.08)',
          }}>
            <div style={{ fontSize: '0.95rem', color: '#4b5563' }}>
              📍 <strong>{bookmarkedPlaces.length}</strong> điểm đến đã lưu · 📅 <strong>{bookmarkedItineraries.length}</strong> lịch trình · 🎒 <strong>{checklist.filter(c => c.done).length}/{checklist.length}</strong> hành trang đã chuẩn bị
            </div>

            <button
              onClick={handlePrint}
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
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              <span>In / Lưu file PDF</span>
            </button>
          </div>
        </div>

        {/* Main Columns */}
        <div style={{ maxWidth: '1150px', margin: '2.5rem auto 0', padding: '0 1.5rem', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* 1. Bookmarked Places */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#133e2f', margin: 0 }}>
                📍 Điểm Đến Đã Đánh Dấu ({bookmarkedPlaces.length})
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
                  Xem 24 Điểm Đến Quảng Trị
                </Link>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
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
                      <img src={place.image} alt={place.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button
                        onClick={() => removeBookmark(place.id)}
                        title="Bỏ lưu"
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(255,255,255,0.9)',
                          color: '#dc2626',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>
                        {place.zoneCode} · {place.zoneName}
                      </span>
                      <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.25rem', color: '#133e2f', margin: '0.3rem 0 0.5rem' }}>
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
                          padding: '0.5rem',
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

          {/* 2. Packing Checklist & Personal Notes */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
            {/* Checklist */}
            <div style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '2rem',
              border: '1px solid rgba(27,42,34,0.08)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
            }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#133e2f', margin: '0 0 1.2rem 0' }}>
                🎒 Hành Trang Cần Chuẩn Bị
              </h2>

              {/* Add item */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  placeholder="Thêm món đồ cần mang..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') addChecklistItem(); }}
                  style={{ flex: 1, padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.9rem' }}
                />
                <button
                  onClick={addChecklistItem}
                  style={{ background: '#133e2f', color: '#fff', padding: '0.6rem 1rem', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                >
                  Thêm
                </button>
              </div>

              {/* List */}
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
                      <span style={{
                        fontSize: '0.92rem',
                        color: item.done ? '#15803d' : '#374151',
                        textDecoration: item.done ? 'line-through' : 'none',
                      }}>
                        {item.text}
                      </span>
                    </label>
                    <button
                      onClick={() => removeChecklistItem(idx)}
                      style={{ background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '0.9rem', padding: '2px 6px' }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes & Saved Estimate */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Saved Estimate Card */}
              {savedEstimate && (
                <div style={{
                  background: '#fff',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  border: '1px solid #fde047',
                  backgroundColor: '#fefce8',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#854d0e', textTransform: 'uppercase' }}>
                      DỰ TOÁN ĐÃ LƯU ({savedEstimate.date})
                    </span>
                    <Link href="/chi-phi" style={{ fontSize: '0.85rem', color: '#854d0e', textDecoration: 'underline' }}>
                      Tính lại →
                    </Link>
                  </div>
                  <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', fontWeight: 700, color: '#133e2f' }}>
                    {new Intl.NumberFormat('vi-VN').format(savedEstimate.grandTotal)} đ
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#4b5563', marginTop: '0.3rem' }}>
                    Cho đoàn {savedEstimate.people} người · {savedEstimate.days} ngày ({new Intl.NumberFormat('vi-VN').format(savedEstimate.costPerPerson)} đ/người)
                  </div>
                </div>
              )}

              {/* Private Notes */}
              <div style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '2rem',
                border: '1px solid rgba(27,42,34,0.08)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
              }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#133e2f', margin: '0 0 0.5rem 0' }}>
                  📝 Ghi Chú & Lịch Trình Riêng
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
        </div>
      </main>

      <Footer />
    </div>
  );
}