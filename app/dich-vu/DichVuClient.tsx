'use client';

import React, { useMemo, useState } from 'react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import ScrollReveal from '@/components/common/ScrollReveal';
import SubpageHero from '@/components/common/SubpageHero';
import PartnerRegistrationModal from '@/components/home/PartnerRegistrationModal';
import type { Service } from '@/lib/supabase/types';

interface DichVuClientProps {
  initialServices: Service[];
}

export default function DichVuClient({ initialServices }: DichVuClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedZone, setSelectedZone] = useState('all');
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);

  const trackLead = async (serviceId: string, serviceName: string, action: 'call' | 'zalo') => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, serviceName, action }),
      });
    } catch {
      // non-blocking lead tracking
    }
  };

  const filteredServices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return initialServices.filter((s) => {
      const matchCat =
        selectedCategory === 'all' || s.type === selectedCategory || s.category === selectedCategory;
      const matchZone = selectedZone === 'all' || s.zoneCode === selectedZone;
      const matchSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.zoneName.toLowerCase().includes(q);
      return matchCat && matchZone && matchSearch;
    });
  }, [initialServices, searchQuery, selectedCategory, selectedZone]);

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <Navbar />

      <main style={{ paddingBottom: '4rem' }}>
        <SubpageHero
          kicker="KẾT NỐI TRỰC TIẾP VỚI NGƯỜI BẢN ĐỊA"
          kickerIcon="bi-building"
          title="Lưu Trú & Dịch Vụ Du Lịch Quảng Trị"
          subtitle="Tất cả đối tác đều được đội ngũ khảo sát thực tế, cam kết đúng giá niêm yết, không chèo kéo, hỗ trợ tận tình cho phượt thủ."
          highlights={[
            { icon: 'bi-patch-check', label: `${initialServices.length} đối tác xác minh` },
            { icon: 'bi-telephone-fill', label: 'Gọi Hotline / Zalo trực tiếp' },
            { icon: 'bi-shield-check', label: '100% đúng giá niêm yết' },
          ]}
          slides={[
            {
              image: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=900&q=80',
              tag: 'GLAMPING & HOMESTAY',
              title: 'Nghỉ Dưỡng Giữa Thiên Nhiên Khe Sanh',
              caption: 'Cabin gỗ, lều glamping săn mây buổi sớm và vườn cà phê yên tĩnh.',
            },
            {
              image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=900&q=80',
              tag: 'THUÊ XE MÁY PHƯỢT',
              title: 'Xe Số & Tay Côn Chuẩn Cung Đèo',
              caption: 'Giao xe tận ga Đông Hà, kèm mũ bảo hiểm, áo mưa và hỗ trợ kỹ thuật dọc tuyến.',
            },
            {
              image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=900&q=80',
              tag: 'TÀU CAO TỐC CỒN CỎ',
              title: 'Hành Trình Ra Đảo Tiền Tiêu',
              caption: 'Đặt vé tàu khứ hồi Cửa Việt – Cồn Cỏ và tour lặn ngắm san hô bản địa.',
            },
          ]}
        >
          <button
            type="button"
            onClick={() => setIsPartnerModalOpen(true)}
            style={{
              background: '#fbbf24',
              color: '#092118',
              padding: '0.7rem 1.4rem',
              borderRadius: '999px',
              border: 'none',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
            }}
          >
            + Đăng ký trở thành đối tác bản địa
          </button>
        </SubpageHero>

        {/* Search & Filters */}
        <ScrollReveal variant="fade-in">
        <div style={{ maxWidth: '1200px', margin: '2rem auto 0', padding: '0 1.5rem' }}>
          <div
            style={{
              background: '#fff',
              padding: '1.25rem 1.5rem',
              borderRadius: '14px',
              border: '1px solid rgba(27,42,34,0.08)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.9rem',
            }}
          >
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm tên homestay, thuê xe, tàu Cồn Cỏ, địa chỉ..."
                aria-label="Tìm dịch vụ"
                style={{ flex: '1 1 260px', padding: '0.68rem 0.9rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.92rem' }}
              />
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                aria-label="Lọc khu vực dịch vụ"
                style={{ padding: '0.68rem 0.9rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.92rem', background: '#fff' }}
              >
                <option value="all">Tất cả phân vùng</option>
                <option value="QT-01">QT-01 · Đông Hà</option>
                <option value="QT-02">QT-02 · Thành Cổ</option>
                <option value="QT-04">QT-04 · Cửa Việt</option>
                <option value="QT-05">QT-05 · Khe Sanh & Sa Mù</option>
                <option value="QT-07">QT-07 · Đảo Cồn Cỏ</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {[
                { id: 'all', label: `Tất cả (${initialServices.length})` },
                { id: 'homestay', label: 'Homestay & Glamping' },
                { id: 'bike', label: 'Thuê xe máy' },
                { id: 'boat', label: 'Vé tàu Cồn Cỏ' },
                { id: 'tour', label: 'Tour Guide Di Sản' },
              ].map((c) => (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: '20px',
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    background: selectedCategory === c.id ? '#133e2f' : '#f3f4f6',
                    color: selectedCategory === c.id ? '#fff' : '#4b5563',
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        </ScrollReveal>

        {/* Services Grid */}
        <div style={{ maxWidth: '1200px', margin: '2.25rem auto 0', padding: '0 1.5rem' }}>
          {filteredServices.length === 0 ? (
            <div style={{ background: '#fff', padding: '3rem', borderRadius: '16px', textAlign: 'center', color: '#6b7280' }}>
              Không tìm thấy đối tác phù hợp. Hãy thử bỏ bớt điều kiện lọc.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
              {filteredServices.map((srv, idx) => (
                <ScrollReveal key={srv.id} delayMs={(idx % 3) * 80} style={{ display: 'flex' }}>
                <article
                  style={{
                    flex: 1,
                    backgroundColor: '#fff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid rgba(27,42,34,0.08)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div style={{ position: 'relative', height: '190px' }}>
                    <SafeImage src={srv.image} alt={srv.name} fill sizes="320px" />
                    <span
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(19, 62, 47, 0.88)',
                        color: '#fff',
                        padding: '4px 10px',
                        borderRadius: '12px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        zIndex: 2,
                      }}
                    >
                      {srv.typeLabel}
                    </span>
                    {srv.verified && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          backgroundColor: '#10b981',
                          color: '#fff',
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '0.72rem',
                          fontWeight: 600,
                          zIndex: 2,
                        }}
                      >
                        <i className="bi bi-check-lg" aria-hidden="true" /> Đã xác minh
                      </span>
                    )}
                  </div>

                  <div style={{ padding: '1.4rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>{srv.zoneName}</span>
                      <span style={{ fontSize: '0.85rem', color: '#d97706', fontWeight: 600 }}><i className="bi bi-star-fill" aria-hidden="true" /> {srv.rating} ({srv.reviewsCount})</span>
                    </div>

                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#133e2f', margin: '0 0 0.5rem 0' }}>
                      {srv.name}
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#4b5563', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                      {srv.address}
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #f3f4f6' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <span style={{ fontSize: '0.8rem', color: '#9ca3af', display: 'block' }}>Mức giá tham khảo</span>
                        <strong style={{ fontSize: '1.1rem', color: '#133e2f' }}>{srv.price}</strong>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                        <a
                          href={`tel:${srv.phone}`}
                          onClick={() => trackLead(srv.id, srv.name, 'call')}
                          style={{
                            textAlign: 'center',
                            padding: '0.65rem 0',
                            borderRadius: '10px',
                            border: '1px solid #133e2f',
                            color: '#133e2f',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                          }}
                        >
                          Gọi Hotline
                        </a>
                        <a
                          href={`https://zalo.me/${(srv.zalo || srv.phone || '').replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackLead(srv.id, srv.name, 'zalo')}
                          style={{
                            textAlign: 'center',
                            padding: '0.65rem 0',
                            borderRadius: '10px',
                            backgroundColor: '#0068ff',
                            color: '#fff',
                            textDecoration: 'none',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                          }}
                        >
                          Nhắn Zalo
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      <PartnerRegistrationModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />
    </div>
  );
}
