'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import { useToast } from '@/components/common/ToastProvider';
import HeroSection from '@/components/home/HeroSection';
import ZonesExplorer from '@/components/home/ZonesExplorer';
import PlacesExplorer from '@/components/home/PlacesExplorer';
import PlaceQuickModal from '@/components/home/PlaceQuickModal';
import PartnerRegistrationModal from '@/components/home/PartnerRegistrationModal';
import ThreadCreateModal from '@/components/home/ThreadCreateModal';
import { getBookmarkedIds, subscribeStorageSync, toggleBookmarkId } from '@/lib/storage';
import type {
  BannerSlide,
  Food,
  GuidesData,
  Itinerary,
  Place,
  Service,
  Thread,
  Zone,
} from '@/lib/supabase/types';
import type { WeatherLocationData } from '@/lib/weather';

interface HomeClientProps {
  initialPlaces: Place[];
  initialServices: Service[];
  initialThreads: Thread[];
  zones: Zone[];
  foods: Food[];
  itineraries: Itinerary[];
  guides: GuidesData;
  bannerSlides: BannerSlide[];
  weatherData: Record<string, WeatherLocationData>;
  initialViews: number;
}

export default function HomeClient({
  initialPlaces = [],
  initialServices = [],
  initialThreads = [],
  zones = [],
  foods = [],
  itineraries = [],
  guides,
  bannerSlides = [],
  weatherData = {},
  initialViews = 0,
}: HomeClientProps) {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [placeCategory, setPlaceCategory] = useState('all');
  const [serviceCategory, setServiceCategory] = useState('all');

  const [activePlaceModal, setActivePlaceModal] = useState<Place | null>(null);
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);

  const [threads, setThreads] = useState<Thread[]>(initialThreads);
  const [likedThreadIds, setLikedThreadIds] = useState<Record<string, boolean>>({});
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);

  useEffect(() => {
    setThreads(initialThreads);
  }, [initialThreads]);

  useEffect(() => {
    setBookmarkedIds(getBookmarkedIds());
    return subscribeStorageSync(() => {
      setBookmarkedIds(getBookmarkedIds());
    });
  }, []);

  const handleToggleBookmark = useCallback(
    (id: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      const { ids, added } = toggleBookmarkId(id);
      setBookmarkedIds(ids);
      showToast(added ? 'Đã lưu điểm đến vào Sổ tay của bạn!' : 'Đã bỏ khỏi Sổ tay.');
    },
    [showToast]
  );

  const trackLead = useCallback(async (serviceId: string, serviceName: string, action: 'call' | 'zalo') => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, serviceName, action }),
      });
    } catch {
      // non-blocking lead analytics
    }
  }, []);

  const handleLikeThread = useCallback(
    async (threadId: string) => {
      if (likedThreadIds[threadId]) {
        showToast('Bạn đã thả tim bài viết này rồi!', 'info');
        return;
      }

      setLikedThreadIds((prev) => ({ ...prev, [threadId]: true }));
      setThreads((prev) =>
        prev.map((th) =>
          th.id === threadId
            ? {
                ...th,
                likes: (th.likes ?? th.likes_count ?? 0) + 1,
                likes_count: (th.likes_count ?? th.likes ?? 0) + 1,
              }
            : th
        )
      );

      try {
        const res = await fetch('/api/threads', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: threadId, action: 'like' }),
        });
        const data = await res.json();
        if (res.ok && typeof data?.likes_count === 'number') {
          setThreads((prev) =>
            prev.map((th) =>
              th.id === threadId
                ? { ...th, likes: data.likes_count, likes_count: data.likes_count }
                : th
            )
          );
        }
      } catch {
        // optimistic UI stays intact
      }
    },
    [likedThreadIds, showToast]
  );

  const filteredPlaces = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return initialPlaces.filter((p) => {
      let matchCat = placeCategory === 'all';
      if (!matchCat) {
        if (placeCategory === 'history') {
          matchCat = p.category === 'history' || p.categoryName.toLowerCase().includes('lịch sử');
        } else if (placeCategory === 'cloud') {
          matchCat =
            p.category === 'adventure' ||
            p.category === 'checkin' ||
            p.id.includes('sa-mu') ||
            p.id.includes('gio') ||
            p.id.includes('ta-con') ||
            p.name.includes('Sa Mù') ||
            p.name.includes('Gió') ||
            p.name.includes('Tà Cơn');
        } else if (placeCategory === 'beach') {
          matchCat =
            p.category === 'beach' ||
            p.id.includes('cua-viet') ||
            p.id.includes('cua-tung') ||
            p.id.includes('mui-treo') ||
            p.name.includes('Biển') ||
            p.name.includes('Mũi Trèo');
        } else if (placeCategory === 'island') {
          matchCat = p.category === 'island' || p.id.includes('con-co') || p.name.includes('Cồn Cỏ');
        } else if (placeCategory === 'waterfall') {
          matchCat =
            p.category === 'nature' ||
            p.id.includes('thac') ||
            p.id.includes('suoi') ||
            p.id.includes('dakrong') ||
            p.name.includes('Thác') ||
            p.name.includes('Suối') ||
            p.name.includes('Đakrông');
        } else {
          matchCat = p.category === placeCategory;
        }
      }

      const matchZone = selectedZone === 'all' || p.zoneCode === selectedZone;
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.shortDesc.toLowerCase().includes(q) ||
        p.zoneName.toLowerCase().includes(q) ||
        p.zoneCode.toLowerCase().includes(q);

      return matchCat && matchZone && matchSearch;
    });
  }, [initialPlaces, placeCategory, selectedZone, searchQuery]);

  const filteredServices = useMemo(() => {
    return initialServices.filter((s) => {
      if (serviceCategory === 'all') return true;
      return s.type === serviceCategory || s.category === serviceCategory;
    });
  }, [initialServices, serviceCategory]);

  const handleOpenPlaceModal = useCallback((place: Place) => {
    setActivePlaceModal(place);
  }, []);

  return (
    <div className="hagiang-theme" data-theme="light">
      <Navbar />

      <HeroSection
        slides={bannerSlides}
        initialViews={initialViews}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        weatherData={weatherData}
        places={initialPlaces}
        foods={foods}
        services={initialServices}
        itineraries={itineraries}
        filteredPlacesCount={filteredPlaces.length}
        onSelectPlace={handleOpenPlaceModal}
      />

      {/* Ribbon Bar */}
      <div className="hagiang-bottom-bar">
        <div className="container hagiang-bottom-bar-inner">
          <div className="bottom-bar-text">Bắt đầu từ toàn cảnh. Chọn nơi muốn đến.</div>
          <a href="#vung-du-lich" className="bottom-bar-select-btn">
            <span>Chọn vùng (QT-01 → QT-08)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </a>
        </div>
      </div>

      {/* 8 Zones Explorer */}
      <ZonesExplorer
        zones={zones}
        selectedZone={selectedZone}
        onSelectZone={setSelectedZone}
        filteredPlacesCount={filteredPlaces.length}
      />

      {/* Places Explorer + Dynamic Interactive Map */}
      <PlacesExplorer
        filteredPlaces={filteredPlaces}
        placeCategory={placeCategory}
        onChangePlaceCategory={setPlaceCategory}
        selectedZone={selectedZone}
        searchQuery={searchQuery}
        onResetFilters={() => {
          setPlaceCategory('all');
          setSelectedZone('all');
          setSearchQuery('');
        }}
        bookmarkedIds={bookmarkedIds}
        onToggleBookmark={handleToggleBookmark}
        onOpenModal={handleOpenPlaceModal}
      />

      {/* 1. LƯU TRÚ & DỊCH VỤ ĐỐI TÁC BẢN ĐỊA */}
      <section className="services-section-curated" id="dich-vu">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">✦ HỆ THỐNG ĐỐI TÁC BẢN ĐỊA · ĐÃ XÁC MINH</span>
            <h2 className="title-serif">Lưu Trú, Thuê Xe & Hải Trình Cồn Cỏ</h2>
            <p className="desc-text">
              Kết nối trực tiếp chủ homestay Khe Sanh, dịch vụ cào cào vượt đèo Sa Mù và vé tàu cao tốc Cồn Cỏ – 100% giá gốc niêm yết, không qua trung gian.
            </p>
          </div>

          <div className="services-trust-row">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <strong>100% Giá Niêm Yết Gốc</strong>
                <span>Không kê giá, cam kết theo giá chủ cơ sở</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div>
                <strong>Kết Nối Trực Tiếp Qua Hotline / Zalo</strong>
                <span>Chủ cơ sở phản hồi nhanh chóng, hỗ trợ đặt chỗ</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🤝</span>
              <div>
                <strong>Người Bản Địa Đồng Hành</strong>
                <span>Sẵn sàng hỗ trợ tư vấn và cứu hộ trên đường đi</span>
              </div>
            </div>
          </div>

          <div className="services-header-row">
            <div className="services-filter-track">
              {[
                { id: 'all', label: 'Tất cả dịch vụ' },
                { id: 'homestay', label: 'Homestay & Glamping' },
                { id: 'bike', label: 'Thuê xe máy' },
                { id: 'boat', label: 'Vé tàu Cồn Cỏ' },
                { id: 'tour', label: 'Tour Guide Di Sản' },
              ].map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => setServiceCategory(f.id)}
                  className={`services-filter-pill ${serviceCategory === f.id ? 'active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setIsPartnerModalOpen(true)}
              className="services-partner-btn"
            >
              + Đăng ký đối tác bản địa
            </button>
          </div>

          <div className="services-curated-grid">
            {filteredServices.slice(0, 4).map((srv) => (
              <article key={srv.id} className="curated-service-card">
                <div className="cservice-media" style={{ position: 'relative', overflow: 'hidden' }}>
                  <SafeImage src={srv.image} alt={srv.name} fill sizes="(max-width: 768px) 100vw, 320px" />
                  <span className="cservice-badge">{srv.typeLabel}</span>
                  {srv.verified && <span className="cservice-verified">✓ Đã xác minh</span>}
                </div>
                <div className="cservice-body">
                  <div className="cservice-meta">
                    <span className="cservice-zone">📍 {srv.zoneName}</span>
                    <span className="cservice-rating">★ {srv.rating} ({srv.reviewsCount})</span>
                  </div>
                  <h3 className="cservice-title">{srv.name}</h3>
                  <p className="cservice-address">{srv.address}</p>

                  <div className="cservice-price-block">
                    <span className="cservice-price-label">Giá niêm yết:</span>
                    <strong className="cservice-price-val">{srv.price}</strong>
                  </div>

                  <div className="cservice-actions">
                    <a
                      href={`tel:${srv.phone}`}
                      onClick={() => trackLead(srv.id, srv.name, 'call')}
                      className="cservice-call-btn"
                    >
                      📞 Gọi Hotline
                    </a>
                    <a
                      href={`https://zalo.me/${(srv.zalo || srv.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackLead(srv.id, srv.name, 'zalo')}
                      className="cservice-zalo-btn"
                    >
                      💬 Nhắn Zalo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="section-view-all-row">
            <Link href="/dich-vu" className="section-view-all-btn">
              Xem tất cả {initialServices.length} đối tác dịch vụ & lưu trú tại Quảng Trị →
            </Link>
          </div>
        </div>
      </section>

      {/* 2. CẨM NANG ẨM THỰC ĐẶC SẢN */}
      <section className="food-section-curated" id="am-thuc">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">✦ HƯƠNG VỊ ĐẤT LỬA</span>
            <h2 className="title-serif">Ẩm Thực & Đặc Sản Nổi Tiếng</h2>
            <p className="desc-text">
              Vị cay nồng của ớt hiểm, đằm thắm của cá tràu đồng Thạch Hãn và hương thơm đậm đà của hạt tiêu Khe Sanh.
            </p>
          </div>

          <div className="food-curated-grid">
            {foods.slice(0, 4).map((f) => (
              <article key={f.id} className="curated-food-card">
                <div className="cfood-media" style={{ position: 'relative', overflow: 'hidden' }}>
                  <SafeImage src={f.image} alt={f.name} fill sizes="(max-width: 768px) 100vw, 320px" />
                  <span className="cfood-zone">{f.origin || 'Quảng Trị'}</span>
                  <span className="cfood-price">{f.priceRange || 'Bình dân'}</span>
                </div>
                <div className="cfood-body">
                  <h3 className="cfood-title">{f.name}</h3>
                  <p className="cfood-desc">{f.description}</p>
                  <div className="cfood-spot">
                    <span>📍 Quán ngon gợi ý:</span>
                    <strong>{f.addressRecs?.[0] || 'Chợ Đông Hà'}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="section-view-all-row">
            <Link href="/am-thuc" className="section-view-all-btn">
              Khám phá toàn bộ cẩm nang ẩm thực & địa chỉ quán ngon →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. LỘ TRÌNH ĐI CHẬM GỢI Ý */}
      <section className="itineraries-section-curated" id="lich-trinh">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">✦ CUNG ĐƯỜNG ĐI CHẬM</span>
            <h2 className="title-serif">Hành Trình Gợi Ý Theo Ngày</h2>
            <p className="desc-text">
              Lộ trình được thiết kế tối ưu thời gian di chuyển, dừng chân nghỉ ngơi và đón hoàng hôn đẹp nhất.
            </p>
          </div>

          <div className="itineraries-curated-grid">
            {itineraries.map((it) => (
              <div key={it.id} className="curated-itinerary-card">
                <div className="citinerary-head">
                  <span className="citinerary-duration">{it.duration}</span>
                  <span className="citinerary-style">{it.suitability}</span>
                </div>
                <h3 className="citinerary-title">{it.title}</h3>
                <p className="citinerary-desc">{it.description}</p>

                <div className="citinerary-stops-wrap">
                  <span className="citinerary-stops-title">Trạm dừng chân nổi bật:</span>
                  <ul className="citinerary-stops-list">
                    {(it.highlights || []).slice(0, 4).map((hl, idx) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>

                <Link href="/lich-trinh" className="citinerary-link">
                  Xem chi tiết lộ trình từng ngày →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CỘNG ĐỒNG LÃNG DU & CẨM NANG BẢO AN */}
      <section className="community-safety-section" id="dien-dan">
        <div className="container">
          <div className="community-safety-grid">
            <div className="community-col">
              <div className="col-header-row">
                <div>
                  <span className="col-kicker">✦ KINH NGHIỆM THỰC TẾ</span>
                  <h3 className="col-title">Diễn Đàn Lãng Du Quảng Trị</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsThreadModalOpen(true)}
                  className="quick-thread-btn"
                >
                  ✍️ Đăng bài
                </button>
              </div>

              <div className="compact-threads-list">
                {threads.slice(0, 2).map((th) => (
                  <article key={th.id} className="compact-thread-card">
                    <div className="cthread-head">
                      <div className="cthread-author">
                        <SafeImage src={th.avatar} alt={th.author} width={40} height={40} sizes="40px" />
                        <div>
                          <strong>{th.author}</strong>
                          <span>{th.time}</span>
                        </div>
                      </div>
                      <span className="cthread-tag">{th.tag}</span>
                    </div>

                    <h4 className="cthread-title">{th.title}</h4>
                    <p className="cthread-content">{th.content}</p>

                    <div className="cthread-footer">
                      <button
                        type="button"
                        onClick={() => handleLikeThread(th.id)}
                        className={`cthread-like-btn ${likedThreadIds[th.id] ? 'active' : ''}`}
                      >
                        ❤️ Thích ({th.likes_count ?? th.likes ?? 0})
                      </button>
                      <Link href="/dien-dan" className="cthread-view-more">
                        Thảo luận trên diễn đàn →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <Link href="/dien-dan" className="section-inline-link">
                  Xem tất cả các bài viết & hình ảnh cộng đồng →
                </Link>
              </div>
            </div>

            <div className="safety-col">
              <div className="col-header-row">
                <div>
                  <span className="col-kicker">✦ CẨM NANG BẢO AN</span>
                  <h3 className="col-title">Cứu Hộ & Tiện Ích Trọng Yếu</h3>
                </div>
              </div>

              <div className="safety-cards-box">
                <div className="safety-item-group">
                  <h4 className="safety-group-title">🚨 Số Điện Thoại Cứu Hộ 24/7</h4>
                  <div className="hotlines-compact-list">
                    {(guides?.emergencyHotlines || []).slice(0, 3).map((em, idx) => (
                      <div key={idx} className="hotline-compact-row">
                        <div className="hotline-compact-info">
                          <strong>{em.name}</strong>
                          <span>{em.note || 'Hỗ trợ 24/7'}</span>
                        </div>
                        <a href={`tel:${em.phone}`} className="hotline-compact-btn">
                          📞 {em.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="safety-item-group">
                  <h4 className="safety-group-title">⛽ Cây Xăng Trọng Yếu Tuyến Đường Xa</h4>
                  <ul className="gas-compact-list">
                    {(guides?.gasStations || []).slice(0, 3).map((g, idx) => (
                      <li key={idx}>
                        <strong>{g.name}:</strong> <span>{g.route}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <Link href="/tien-ich" className="section-inline-link">
                  Xem toàn bộ danh bạ cứu hộ & trạm xăng toàn tỉnh →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <PlaceQuickModal
        place={activePlaceModal}
        isBookmarked={activePlaceModal ? bookmarkedIds.includes(activePlaceModal.id) : false}
        onToggleBookmark={(id) => handleToggleBookmark(id)}
        onClose={() => setActivePlaceModal(null)}
      />

      <PartnerRegistrationModal
        isOpen={isPartnerModalOpen}
        onClose={() => setIsPartnerModalOpen(false)}
      />

      <ThreadCreateModal
        isOpen={isThreadModalOpen}
        onClose={() => setIsThreadModalOpen(false)}
        onCreated={(newThread) => setThreads((prev) => [newThread, ...prev])}
      />
    </div>
  );
}
