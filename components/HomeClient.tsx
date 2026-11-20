'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import { useToast } from '@/components/common/ToastProvider';
import HeroSection from '@/components/home/HeroSection';
import PlacesExplorer from '@/components/home/PlacesExplorer';
import PlaceQuickModal from '@/components/home/PlaceQuickModal';
import PartnerRegistrationModal from '@/components/home/PartnerRegistrationModal';
import ThreadCreateModal from '@/components/home/ThreadCreateModal';
import { getBookmarkedIds, subscribeStorageSync, toggleBookmarkId } from '@/lib/storage';
import {
  PLACE_CATEGORY_IDS,
  matchesPlaceCategory,
  matchesPlaceSearch,
} from '@/lib/place-filters';
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
  const [resultsFocusToken, setResultsFocusToken] = useState(0);

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
    return initialPlaces.filter(
      (p) =>
        matchesPlaceCategory(p, placeCategory) &&
        (selectedZone === 'all' || p.zoneCode === selectedZone) &&
        matchesPlaceSearch(p, searchQuery)
    );
  }, [initialPlaces, placeCategory, selectedZone, searchQuery]);

  // Real number of places per zone (drives zone cards, so a zone never leads to an empty list)
  const zonePlaceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const p of initialPlaces) counts[p.zoneCode] = (counts[p.zoneCode] || 0) + 1;
    return counts;
  }, [initialPlaces]);

  // Category counts under the current zone + keyword, so empty categories can be disabled
  const categoryCounts = useMemo(() => {
    const scoped = initialPlaces.filter(
      (p) =>
        (selectedZone === 'all' || p.zoneCode === selectedZone) && matchesPlaceSearch(p, searchQuery)
    );
    const counts: Record<string, number> = { all: scoped.length };
    for (const id of PLACE_CATEGORY_IDS) {
      counts[id] = scoped.filter((p) => matchesPlaceCategory(p, id)).length;
    }
    return counts;
  }, [initialPlaces, selectedZone, searchQuery]);

  const handleSelectZone = useCallback(
    (zoneCode: string) => {
      if (zoneCode === 'all') {
        setSelectedZone('all');
        return;
      }
      setSelectedZone(zoneCode);
    },
    []
  );

  const selectedZoneObj = useMemo(
    () => zones.find((z) => z.code === selectedZone),
    [zones, selectedZone]
  );

  const filteredServices = useMemo(() => {
    const byCat = initialServices.filter((s) => {
      if (serviceCategory === 'all') return true;
      return s.type === serviceCategory || s.category === serviceCategory;
    });
    if (selectedZone === 'all') return byCat;
    // Prioritize services in the currently selected map zone while keeping others accessible
    return [...byCat].sort((a, b) => {
      const aMatch = a.zoneCode === selectedZone ? 1 : 0;
      const bMatch = b.zoneCode === selectedZone ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [initialServices, serviceCategory, selectedZone]);

  const prioritizedFoods = useMemo(() => {
    if (selectedZone === 'all' || !selectedZoneObj) return foods;
    const zoneKeywords = selectedZoneObj.name
      .toLowerCase()
      .split(/[&,-]/)
      .map((s) => s.trim())
      .filter((s) => s.length > 2);
    return [...foods].sort((a, b) => {
      const aOrigin = (a.origin || '').toLowerCase();
      const bOrigin = (b.origin || '').toLowerCase();
      const aMatch = zoneKeywords.some((kw) => aOrigin.includes(kw)) ? 1 : 0;
      const bMatch = zoneKeywords.some((kw) => bOrigin.includes(kw)) ? 1 : 0;
      return bMatch - aMatch;
    });
  }, [foods, selectedZone, selectedZoneObj]);

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

      {/* Connected Journey Navigation Bar */}
      <div className="hagiang-bottom-bar">
        <nav className="container home-quick-nav" aria-label="Hành trình khám phá Quảng Trị">
          <a href="#kham-pha">
            <span className="step-num">01</span>
            <span>✨ Trải nghiệm biểu tượng</span>
          </a>
          <span className="step-arrow" aria-hidden="true">→</span>
          <a href="#cung-duong">
            <span className="step-num">02</span>
            <span>🗺️ Bản đồ đa lớp ({initialPlaces.length})</span>
          </a>
          <span className="step-arrow" aria-hidden="true">→</span>
          <a href="#dich-vu">
            <span className="step-num">03</span>
            <span>🏕️ Lưu trú & Thuê xe</span>
          </a>
          <span className="step-arrow" aria-hidden="true">→</span>
          <a href="#am-thuc">
            <span className="step-num">04</span>
            <span>🍲 Ẩm thực đất lửa</span>
          </a>
          <span className="step-arrow" aria-hidden="true">→</span>
          <a href="#lich-trinh">
            <span className="step-num">05</span>
            <span>🧭 Lộ trình & Cộng đồng</span>
          </a>
        </nav>
      </div>

      {/* 01. INSPIRE SHOWCASE: 4 Trải Nghiệm Không Thể Bỏ Lỡ */}
      <section className="inspire-showcase-section" id="kham-pha">
        <div className="container">
          <div className="section-head-split">
            <div className="section-head-hagiang" style={{ marginBottom: 0 }}>
              <span className="sub-title-accent">BƯỚC 01 / 05 · CẢM HỨNG HÀNH TRÌNH</span>
              <h2 className="title-serif">4 Mảnh Ghép Không Thể Bỏ Lỡ Tại Quảng Trị</h2>
              <p className="desc-text">
                Từ kỳ quan hang động UNESCO phía Bắc đến đèo mây Trường Sơn, ký ức Vĩ tuyến 17 và đảo ngọc tiền tiêu giữa Biển Đông.
              </p>
            </div>
            <a href="#cung-duong" className="journey-back-map-chip">
              🗺️ Mở bản đồ tương tác ↓
            </a>
          </div>

          <div className="inspire-grid">
            {[
              {
                slug: 'dong-phong-nha',
                tag: 'QT-10 · DI SẢN UNESCO',
                title: 'Vương Quốc Hang Động Phong Nha – Kẻ Bàng',
                desc: 'Xuôi thuyền sông Son vào lòng động kỳ vĩ, khám phá Động Thiên Đường & suối Nước Moọc xanh ngọc.',
                image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=900&q=80',
              },
              {
                slug: 'thanh-co-quang-tri',
                tag: 'QT-02 & QT-03 · ĐẤT THIÊNG',
                title: 'Ký Ức Thành Cổ & Vĩ Tuyến 17 Hiền Lương',
                desc: 'Lắng đọng bên dòng Thạch Hãn, Cầu Hiền Lương – Bến Hải và kỳ quan ngầm Địa đạo Vịnh Mốc.',
                image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=900&q=80',
              },
              {
                slug: 'deo-sa-mu',
                tag: 'QT-05 · TRƯỜNG SƠN TÂY',
                title: 'Săn Mây Đỉnh Đèo Sa Mù & Cà Phê Khe Sanh',
                desc: 'Chinh phục độ cao 1.400m mờ sương, cánh đồng điện gió Hướng Linh và thưởng thức Arabica vùng cao.',
                image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=900&q=80',
              },
              {
                slug: 'dao-con-co',
                tag: 'QT-09 & QT-07 · BIỂN ĐẢO',
                title: 'Biển Nhật Lệ, Cửa Việt & Đảo Ngọc Cồn Cỏ',
                desc: 'Đón bình minh đồi cát Quang Phú, dạo biển Cửa Việt và lặn ngắm san hô tại đảo tiền tiêu Cồn Cỏ.',
                image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
              },
            ].map((item) => (
              <Link key={item.slug} href={`/diem-den/${item.slug}`} className="inspire-card">
                <SafeImage
                  src={item.image}
                  alt={item.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
                <div className="inspire-card-overlay" />
                <div className="inspire-card-body">
                  <span className="inspire-card-tag">{item.tag}</span>
                  <h3 className="inspire-card-title">{item.title}</h3>
                  <p className="inspire-card-desc">{item.desc}</p>
                  <span className="inspire-card-cta">Khám phá ngay →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Places Explorer + Google-Maps-Style Interactive Map */}
      <PlacesExplorer
        filteredPlaces={filteredPlaces}
        foods={foods}
        services={initialServices}
        zones={zones}
        guides={guides}
        placeCategory={placeCategory}
        onChangePlaceCategory={setPlaceCategory}
        selectedZone={selectedZone}
        onSelectZone={handleSelectZone}
        selectedZoneName={zones.find((z) => z.code === selectedZone)?.name}
        categoryCounts={categoryCounts}
        focusToken={resultsFocusToken}
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

      {/* BƯỚC 02. LƯU TRÚ & DỊCH VỤ ĐỐI TÁC BẢN ĐỊA */}
      <section className="services-section-curated" id="dich-vu">
        <div className="container">
          <div className="section-head-split">
            <div className="section-head-hagiang" style={{ marginBottom: 0 }}>
              <span className="sub-title-accent">BƯỚC 02 / 05 · ĐỐI TÁC BẢN ĐỊA ĐÃ XÁC MINH</span>
              <h2 className="title-serif">Lưu Trú, Thuê Xe & Hải Trình Cồn Cỏ</h2>
              <p className="desc-text">
                Sau khi chọn điểm đến trên bản đồ, kết nối trực tiếp chủ homestay Khe Sanh, dịch vụ xe máy vượt đèo Sa Mù và vé tàu Cồn Cỏ – 100% giá gốc niêm yết.
              </p>
            </div>

            {selectedZone !== 'all' && selectedZoneObj && (
              <div className="zone-context-pill">
                <span>🧭 Đang ưu tiên dịch vụ gần <strong>{selectedZoneObj.code} · {selectedZoneObj.name}</strong></span>
                <button type="button" onClick={() => setSelectedZone('all')}>
                  Xem toàn tỉnh ✕
                </button>
              </div>
            )}
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

          <div className="section-journey-footer">
            <Link href="/dich-vu" className="section-view-all-btn">
              Xem tất cả {initialServices.length} đối tác dịch vụ & lưu trú tại Quảng Trị →
            </Link>
            <a href="#am-thuc" className="journey-next-link">
              Bước tiếp theo: Thưởng thức ẩm thực bản địa ↓
            </a>
          </div>
        </div>
      </section>

      {/* BƯỚC 03. CẨM NANG ẨM THỰC ĐẶC SẢN */}
      <section className="food-section-curated" id="am-thuc">
        <div className="container">
          <div className="section-head-split">
            <div className="section-head-hagiang" style={{ marginBottom: 0 }}>
              <span className="sub-title-accent">BƯỚC 03 / 05 · HƯƠNG VỊ ĐẤT LỬA</span>
              <h2 className="title-serif">Ẩm Thực & Đặc Sản Nổi Tiếng</h2>
              <p className="desc-text">
                Nạp năng lượng trên mỗi cung đường với vị cay nồng của cháo vạt giường Hải Lăng, bún hến Mai Xá, gà đồi Cùa và cà phê Arabica Khe Sanh.
              </p>
            </div>
            <a href="#cung-duong" className="journey-back-map-chip">
              🗺️ Xem tọa độ quán ngon trên Bản đồ ↑
            </a>
          </div>

          <div className="food-curated-grid">
            {prioritizedFoods.slice(0, 4).map((f) => (
              <Link key={f.id} href="/am-thuc" className="curated-food-card" aria-label={`Xem ${f.name} trong cẩm nang ẩm thực`}>
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
              </Link>
            ))}
          </div>

          <div className="section-journey-footer">
            <Link href="/am-thuc" className="section-view-all-btn">
              Khám phá toàn bộ cẩm nang ẩm thực & địa chỉ quán ngon →
            </Link>
            <a href="#lich-trinh" className="journey-next-link">
              Bước tiếp theo: Lộ trình đi chậm theo ngày ↓
            </a>
          </div>
        </div>
      </section>

      {/* BƯỚC 04. LỘ TRÌNH ĐI CHẬM GỢI Ý */}
      <section className="itineraries-section-curated" id="lich-trinh">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">BƯỚC 04 / 05 · CUNG ĐƯỜNG ĐI CHẬM</span>
            <h2 className="title-serif">Hành Trình Gợi Ý Theo Ngày</h2>
            <p className="desc-text">
              Kết nối các điểm tham quan, quán ăn đặc sản và trạm nghỉ trên bản đồ thành lịch trình 1–3 ngày tối ưu thời gian di chuyển.
            </p>
          </div>

          <div className="itineraries-curated-grid">
            {itineraries.slice(0, 3).map((it) => (
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

          <div className="section-journey-footer">
            <Link href="/lich-trinh" className="section-view-all-btn">
              Xem tất cả {itineraries.length} lịch trình đi chậm →
            </Link>
            <a href="#dien-dan" className="journey-next-link">
              Bước tiếp theo: Kinh nghiệm thực tế & Cứu hộ 24/7 ↓
            </a>
          </div>
        </div>
      </section>

      {/* BƯỚC 05. CỘNG ĐỒNG LÃNG DU & CẨM NANG BẢO AN */}
      <section className="community-safety-section" id="dien-dan">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">BƯỚC 05 / 05 · AN TOÀN & SẺ CHIA TRÊN ĐƯỜNG PHƯỢT</span>
            <h2 className="title-serif">Kinh Nghiệm Cộng Đồng & Cứu Hộ Thực Địa</h2>
            <p className="desc-text">
              Lưu lại các số điện thoại cứu hộ 24/7, trạm xăng trọng yếu trước khi lên đèo và tham khảo chia sẻ mới nhất từ những người vừa đi về.
            </p>
          </div>
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
