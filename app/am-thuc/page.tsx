'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { QUANGTRI_DATA } from '@/lib/data';

export default function AmThucPage() {
  const [activeType, setActiveType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const foodList = QUANGTRI_DATA.foods || [];

  const types = [
    { key: 'all', label: 'Tất cả món ngon' },
    { key: 'Món mặn truyền thống', label: 'Món mặn truyền thống' },
    { key: 'Bánh truyền thống', label: 'Bánh truyền thống' },
    { key: 'Món nhậu đặc sản rừng', label: 'Đặc sản rừng núi' },
    { key: 'Di sản ẩm thực Việt Nam', label: 'Di sản ẩm thực' },
    { key: 'Đặc sản gà đồi', label: 'Gà đồi Cùa' },
    { key: 'Đồ uống & Nông sản di sản', label: 'Cà phê Khe Sanh' },
  ];

  const filteredFoods = foodList.filter((f) => {
    const matchType = activeType === 'all' || f.type.toLowerCase().includes(activeType.toLowerCase());
    const matchSearch =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchType && matchSearch;
  });

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
              HƯƠNG VỊ XỨ GIÓ LÀO CÁT TRẮNG
            </span>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '3rem', margin: '0.8rem 0 1rem', lineHeight: 1.2 }}>
              Ẩm Thực & Món Ngon Quảng Trị
            </h1>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>
              Đậm đà, cay nồng và mộc mạc như chính con người miền Trung kiên cường. Từ cháo vạt giường nóng hổi đến thịt trâu lá trơng đại ngàn Trường Sơn.
            </p>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: '#fff',
            padding: '1.25rem 1.5rem',
            borderRadius: '12px',
            border: '1px solid rgba(27,42,34,0.08)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.03)'
          }}>
            {/* Search Input */}
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <input
                type="text"
                placeholder="Tìm món ăn, địa chỉ quán, xuất xứ..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </div>

            {/* Filter Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {types.map((t) => (
                <button
                  key={t.key}
                  onClick={() => setActiveType(t.key)}
                  style={{
                    padding: '0.5rem 0.9rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: activeType === t.key ? 600 : 500,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
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

        {/* Food List Grid */}
        <div style={{ maxWidth: '1200px', margin: '2.5rem auto 0', padding: '0 1.5rem' }}>
          {filteredFoods.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', background: '#fff', borderRadius: '12px' }}>
              <p style={{ fontSize: '1.1rem', color: '#6b7280' }}>Không tìm thấy món ăn phù hợp với từ khóa tìm kiếm.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveType('all'); }}
                style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', background: '#133e2f', color: '#fff', borderRadius: '6px', border: 'none', cursor: 'pointer' }}
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
              {filteredFoods.map((food) => (
                <div
                  key={food.id}
                  style={{
                    background: '#fff',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    border: '1px solid rgba(27,42,34,0.08)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Food Image */}
                  <div style={{ position: 'relative', height: '220px', overflow: 'hidden' }}>
                    <img
                      src={food.image}
                      alt={food.name}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      loading="lazy"
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(19, 62, 47, 0.9)',
                      color: '#fff',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {food.type}
                    </div>
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      right: '12px',
                      background: 'rgba(0, 0, 0, 0.75)',
                      color: '#fbbf24',
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '6px',
                    }}>
                      💰 {food.priceRange}
                    </div>
                  </div>

                  {/* Food Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: '#d97706', fontSize: '0.85rem', fontWeight: 600 }}>
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      <span>{food.origin}</span>
                    </div>

                    <h2 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.45rem', color: '#133e2f', margin: '0 0 0.8rem 0' }}>
                      {food.name}
                    </h2>

                    <p style={{ color: '#4b5563', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.2rem 0' }}>
                      {food.description}
                    </p>

                    {/* Taste Notes */}
                    {food.tasteNotes && (
                      <div style={{
                        background: '#fef3c7',
                        borderLeft: '3px solid #d97706',
                        padding: '0.75rem 1rem',
                        borderRadius: '0 8px 8px 0',
                        fontSize: '0.85rem',
                        color: '#92400e',
                        marginBottom: '1.2rem',
                        lineHeight: 1.5
                      }}>
                        <strong>Đặc trưng hương vị:</strong> {food.tasteNotes}
                      </div>
                    )}

                    {/* Recommended Addresses */}
                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#133e2f', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Địa chỉ thưởng thức gợi ý:
                      </span>
                      <ul style={{ margin: '0.5rem 0 0 0', paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#4b5563', lineHeight: 1.6 }}>
                        {food.addressRecs.map((addr, idx) => (
                          <li key={idx} style={{ marginBottom: '0.2rem' }}>{addr}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Culinary Tips Section */}
        <div style={{ maxWidth: '1200px', margin: '4rem auto 0', padding: '0 1.5rem' }}>
          <div style={{ background: '#fff', borderRadius: '16px', padding: '2.5rem', border: '1px solid rgba(27,42,34,0.08)' }}>
            <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.8rem', color: '#133e2f', marginBottom: '1.2rem' }}>
              Bí Quyết Ẩm Thực Quảng Trị - Cay Nồng & Đậm Vị
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', color: '#4b5563', fontSize: '0.95rem', lineHeight: 1.7 }}>
              <div>
                <strong style={{ color: '#133e2f' }}>🔥 Hành tăm (Củ nén) & Ớt hiểm:</strong>
                <p style={{ margin: '0.4rem 0 0' }}>
                  Hầu hết các món ăn Quảng Trị như cháo vạt giường, bún hến đều phi thơm củ nén với dầu phụng, tạo nên mùi hương thơm nồng không thể nhầm lẫn cùng vị ớt cay nồng xua tan cái lạnh vùng sông nước.
                </p>
              </div>
              <div>
                <strong style={{ color: '#133e2f' }}>🌿 Lá trơng rừng đại ngàn:</strong>
                <p style={{ margin: '0.4rem 0 0' }}>
                  Lá trơng là thảo mộc rừng đặc trưng miền Tây Hướng Hóa. Khi nướng cùng thịt trâu hay xào nóng, tinh dầu lá trơng the the cay nhẹ giúp cân bằng tính hàn của thịt trâu và giữ ấm cơ thể.
                </p>
              </div>
              <div>
                <strong style={{ color: '#133e2f' }}>☕ Hương vị cà phê Khe Sanh:</strong>
                <p style={{ margin: '0.4rem 0 0' }}>
                  Thung lũng Khe Sanh ở độ cao gần 1.000m với khí hậu ôn đới mát lạnh cho ra hạt Arabica Catimor có độ chua thanh trái cây và hậu vị ngọt sâu, được du khách khắp nơi săn đón làm quà.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}