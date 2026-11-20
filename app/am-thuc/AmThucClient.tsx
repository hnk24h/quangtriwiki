'use client';

import React, { useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import ScrollReveal from '@/components/common/ScrollReveal';
import type { Food } from '@/lib/supabase/types';

interface AmThucClientProps {
  initialFoods: Food[];
}

export default function AmThucClient({ initialFoods }: AmThucClientProps) {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const types = [
    { key: 'all', label: 'Tất cả món ngon' },
    { key: 'Món mặn truyền thống', label: 'Món mặn truyền thống' },
    { key: 'Bánh truyền thống', label: 'Bánh truyền thống' },
    { key: 'Món nhậu đặc sản rừng', label: 'Đặc sản rừng núi' },
    { key: 'Di sản ẩm thực Việt Nam', label: 'Di sản ẩm thực' },
    { key: 'Đặc sản gà đồi', label: 'Gà đồi Cùa' },
    { key: 'Đồ uống & Nông sản di sản', label: 'Cà phê Khe Sanh' },
  ];

  const q = searchQuery.trim().toLowerCase();
  const filteredFoods = initialFoods.filter((f) => {
    const matchType =
      activeType === 'all' || (f.type || '').toLowerCase().includes(activeType.toLowerCase());
    const matchSearch =
      !q ||
      f.name.toLowerCase().includes(q) ||
      (f.origin || '').toLowerCase().includes(q) ||
      (f.description || '').toLowerCase().includes(q) ||
      (f.addressRecs || []).some((addr) => addr.toLowerCase().includes(q));
    return matchType && matchSearch;
  });

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        {/* Hero Section */}
        <div
          style={{
            backgroundColor: '#133e2f',
            color: '#fff',
            padding: '4rem 1.5rem 3.5rem',
            textAlign: 'center',
          }}
        >
          <div className="subpage-hero-animate" style={{ maxWidth: '850px', margin: '0 auto' }}>
            <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#86efac', fontWeight: 700 }}>
              HƯƠNG VỊ XỨ GIÓ LÀO CÁT TRẮNG
            </span>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 4vw, 3rem)', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Ẩm Thực & Món Ngon Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Đậm đà, cay nồng và mộc mạc như chính con người miền Trung kiên cường. Từ cháo vạt giường nóng hổi đến thịt trâu lá trơng đại ngàn Trường Sơn.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <ScrollReveal variant="fade-in">
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '1rem',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: '#fff',
              padding: '1.25rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(27,42,34,0.08)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ position: 'relative', flex: '1 1 280px' }}>
              <input
                type="text"
                placeholder="Tìm món ăn, địa chỉ quán, xuất xứ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Tìm kiếm món ăn"
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.5rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
              <svg
                style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {types.map((t) => (
                <button
                  type="button"
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: activeType === t.key ? 600 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    backgroundColor: activeType === t.key ? '#133e2f' : '#f3f4f6',
                    color: activeType === t.key ? '#fff' : '#4b5563',
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Food List Grid */}
        <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
          {filteredFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Không tìm thấy món ăn phù hợp với từ khóa tìm kiếm.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveType('all');
                }}
                style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#133e2f', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
              {filteredFoods.map((food, idx) => (
                <ScrollReveal key={food.id} delayMs={(idx % 3) * 80} style={{ display: 'flex' }}>
                <div
                  style={{
                    flex: 1,
                    background: '#fff',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(27,42,34,0.08)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <SafeImage
                      src={food.image}
                      alt={food.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'rgba(19, 62, 47, 0.9)',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '20px',
                        zIndex: 2,
                      }}
                    >
                      {food.type}
                    </div>
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        right: '12px',
                        background: 'rgba(0, 0, 0, 0.75)',
                        color: '#fbbf24',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        padding: '4px 10px',
                        borderRadius: '6px',
                        zIndex: 2,
                      }}
                    >
                      <i className="bi bi-cash-coin" aria-hidden="true" /> {food.priceRange}
                    </div>
                  </div>

                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#d97706', fontSize: '0.85rem', fontWeight: 600 }}>
                      <span><i className="bi bi-geo-alt-fill" aria-hidden="true" /> {food.origin}</span>
                    </div>

                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.45rem', color: '#133e2f', margin: '0 0 0.8rem 0' }}>
                      {food.name}
                    </h2>

                    <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.2rem 0' }}>
                      {food.description}
                    </p>

                    {food.tasteNotes && (
                      <div
                        style={{
                          background: '#fef3c7',
                          borderLeft: '3px solid #d97706',
                          padding: '0.75rem 1rem',
                          borderRadius: '0 8px 8px 0',
                          fontSize: '0.85rem',
                          color: '#92400e',
                          marginBottom: '1.2rem',
                          lineHeight: 1.5,
                        }}
                      >
                        <strong>Đặc trưng hương vị:</strong> {food.tasteNotes}
                      </div>
                    )}

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#133e2f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Địa chỉ thưởng thức gợi ý:
                      </span>
                      <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.6 }}>
                        {(food.addressRecs || []).map((addr, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>{addr}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>

        {/* Culinary Tips Section */}
        <ScrollReveal>
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', border: '1px solid rgba(27,42,34,0.08)' }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.8rem', color: '#133e2f', marginBottom: '1.2rem' }}>
              Bí Quyết Ẩm Thực Quảng Trị - Cay Nồng & Đậm Vị
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.7 }}>
              <div>
                <strong style={{ color: '#133e2f' }}><i className="bi bi-fire" aria-hidden="true" /> Hành tăm (Củ nén) & Ớt hiểm:</strong>
                <p style={{ margin: '0.4rem 0 0' }}>
                  Hầu hết các món ăn Quảng Trị như cháo vạt giường, bún hến đều phi thơm củ nén với dầu phụng, tạo nên mùi hương thơm nồng đặc trưng.
                </p>
              </div>
              <div>
                <strong style={{ color: '#133e2f' }}><i className="bi bi-tree" aria-hidden="true" /> Lá trơng rừng đại ngàn:</strong>
                <p style={{ margin: '0.4rem 0 0' }}>
                  Lá trơng là thảo mộc rừng miền Tây Hướng Hóa giúp cân bằng hương vị khi nướng hoặc xào cùng thịt trâu bản địa.
                </p>
              </div>
              <div>
                <strong style={{ color: '#133e2f' }}><i className="bi bi-cup-hot" aria-hidden="true" /> Cà phê Arabica Khe Sanh:</strong>
                <p style={{ margin: '0.4rem 0 0' }}>
                  Thung lũng Khe Sanh có khí hậu mát lạnh cho ra hạt Arabica Catimor có vị chua thanh trái cây và hậu vị ngọt sâu.
                </p>
              </div>
            </div>
          </div>
        </div>
        </ScrollReveal>
      </main>

      <Footer />
    </div>
  );
}
