'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import ClockCalendarWidget from '@/components/home/ClockCalendarWidget';
import WeatherWidget from '@/components/home/WeatherWidget';
import { useLanguage } from '@/lib/i18n';
import type { BannerSlide, Food, Itinerary, Place, Service } from '@/lib/supabase/types';
import type { WeatherLocationData } from '@/lib/weather';

interface HeroSectionProps {
  slides: BannerSlide[];
  initialViews: number;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  weatherData: Record<string, WeatherLocationData>;
  places: Place[];
  foods: Food[];
  services: Service[];
  itineraries: Itinerary[];
  filteredPlacesCount: number;
  onSelectPlace?: (place: Place) => void;
}

function pickRandomPlaces(list: Place[], count = 4): Place[] {
  const shuffled = [...list];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const picked: Place[] = [];
  const usedZones = new Set<string>();
  for (const p of shuffled) {
    if (picked.length >= count) break;
    if (!usedZones.has(p.zoneCode)) {
      usedZones.add(p.zoneCode);
      picked.push(p);
    }
  }
  for (const p of shuffled) {
    if (picked.length >= count) break;
    if (!picked.includes(p)) picked.push(p);
  }
  return picked;
}

export default function HeroSection({
  slides,
  initialViews,
  searchQuery,
  onSearchChange,
  weatherData,
  places,
  foods,
  services,
  itineraries,
  filteredPlacesCount,
  onSelectPlace,
}: HeroSectionProps) {
  const { lang } = useLanguage();
  const heroSlides = useMemo(() => {
    if (Array.isArray(slides) && slides.length > 0) return slides;
    return [
      {
        id: 'deo-sa-mu',
        image:
          'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1600&q=85',
        badge: '🏔️ SĂN MÂY ĐỈNH ĐÈO SA MÙ',
        title: "Biển Mây Bồng Bềnh Trên 'Cổng Trời' Trường Sơn",
        subtitle:
          'Độ cao gần 1.400m quanh năm mát lạnh, biển mây cuộn trôi qua những tán rừng già nguyên sinh.',
      },
    ];
  }, [slides]);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [suggestedPlaces, setSuggestedPlaces] = useState<Place[]>(() => places.slice(0, 4));

  // Randomize only after mount to keep SSR/hydration deterministic
  useEffect(() => {
    if (places.length > 0) {
      setSuggestedPlaces(pickRandomPlaces(places, 4));
    }
  }, [places]);

  const handleShuffleSuggestions = () => setSuggestedPlaces(pickRandomPlaces(places, 4));

  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchWrapRef = useRef<HTMLDivElement>(null);

  const nextSlideIdx = heroSlides.length > 1 ? (currentSlide + 1) % heroSlides.length : 0;
  const activeSlide = heroSlides[currentSlide] || heroSlides[0];

  // Auto advance slideshow (isolated in HeroSection so the rest of page never re-renders)
  useEffect(() => {
    if (heroSlides.length <= 1 || isPaused || isSearchOpen || searchQuery.trim().length > 0) {
      return;
    }
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length, isPaused, isSearchOpen, searchQuery]);

  // Global Cmd/Ctrl + K keyboard shortcut & Escape close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setIsSearchOpen(true);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
        searchInputRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (searchWrapRef.current && !searchWrapRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onMouseDown);
    return () => document.removeEventListener('mousedown', onMouseDown);
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return null;

    const matchedPlaces = places
      .filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDesc.toLowerCase().includes(q) ||
          p.zoneName.toLowerCase().includes(q) ||
          p.zoneCode.toLowerCase().includes(q)
      )
      .slice(0, 4);

    const matchedFoods = foods
      .filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.origin.toLowerCase().includes(q) ||
          f.description.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedServices = services
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.typeLabel.toLowerCase().includes(q) ||
          s.zoneName.toLowerCase().includes(q)
      )
      .slice(0, 3);

    const matchedItineraries = itineraries
      .filter(
        (it) =>
          it.title.toLowerCase().includes(q) ||
          it.description.toLowerCase().includes(q)
      )
      .slice(0, 2);

    const total =
      matchedPlaces.length +
      matchedFoods.length +
      matchedServices.length +
      matchedItineraries.length;

    return { matchedPlaces, matchedFoods, matchedServices, matchedItineraries, total };
  }, [searchQuery, places, foods, services, itineraries]);

  const scrollToPlaces = () => {
    setIsSearchOpen(false);
    const el = document.getElementById('places-results') || document.getElementById('cung-duong');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      className="hagiang-hero-section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="hagiang-hero-bg-track" style={{ overflow: 'hidden' }}>
        {heroSlides.map((slide, idx) => {
          const shouldRender = idx === currentSlide || idx === nextSlideIdx;
          if (!shouldRender) return null;
          return (
            <div
              key={slide.id || idx}
              className={`hagiang-hero-bg-slide ${idx === currentSlide ? 'active' : ''}`}
            >
              <SafeImage
                src={slide.image}
                alt={slide.title}
                fill
                priority={idx === 0}
                sizes="100vw"
              />
            </div>
          );
        })}
      </div>
      <div className="hagiang-hero-mist-overlay" />

      <div className="container hagiang-hero-content">
        <div className="hagiang-hero-left">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            <div className="hagiang-kicker" style={{ margin: 0 }}>
              {lang === 'en'
                ? 'CENTRAL VIETNAM · GO WHERE THE WIND BLOWS'
                : lang === 'ja'
                ? 'ベトナム中部 · 風の吹く場所へ'
                : activeSlide.badge || 'MIỀN TRUNG VIỆT NAM · ĐI ĐẾN NƠI CÓ GIÓ'}
            </div>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.2rem 0.65rem',
                borderRadius: '20px',
                background: 'rgba(16, 185, 129, 0.22)',
                color: '#34d399',
                fontSize: '0.74rem',
                fontWeight: 700,
                border: '1px solid rgba(52, 211, 153, 0.4)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
              {initialViews.toLocaleString('vi-VN')}{' '}
              {lang === 'en' ? 'views' : lang === 'ja' ? '閲覧' : 'lượt xem'}
            </span>
          </div>

          <h1 className="hagiang-main-title" key={`title-${currentSlide}`}>
            {lang === 'en'
              ? 'From Phong Nha Caves to DMZ & Con Co Island.'
              : lang === 'ja'
              ? 'フォンニャ洞窟からDMZ、コンコー島へ。'
              : activeSlide.title || 'Gần hơn với Quảng Trị chân thật.'}
          </h1>
          <p className="hagiang-main-subtitle" key={`sub-${currentSlide}`} style={{ maxWidth: '520px', lineHeight: 1.6 }}>
            {lang === 'en'
              ? 'An independent local travel guide to Vietnam’s Phong Nha - Ke Bang, Hien Luong 17th Parallel, Sa Mu cloud pass, and Nhat Le coast.'
              : lang === 'ja'
              ? '世界遺産フォンニャ＝ケバン、歴史的な17度線ヒエンルオン橋、雲海のサームー峠、ニャットレー海岸を巡るローカル旅ガイド。'
              : activeSlide.subtitle || 'Đèo núi. Miền đất thiêng yên bình. Hành trình đáng để đi chậm.'}
          </p>

          {/* Live Search Bar + Dropdown */}
          <div
            ref={searchWrapRef}
            className="hagiang-search-box"
            style={{ position: 'relative', width: '100%', maxWidth: '520px', margin: '1.25rem 0 0', zIndex: 25 }}
          >
            <svg
              className="hagiang-search-icon"
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

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchOpen(true)}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setIsSearchOpen(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchQuery.trim()) {
                  scrollToPlaces();
                }
              }}
              className="hagiang-search-input"
              aria-label={
                lang === 'en'
                  ? 'Search destinations, food, stays in Quang Tri'
                  : lang === 'ja'
                  ? 'クアンチの観光地、グルメ、宿泊を検索'
                  : 'Tìm kiếm điểm đến, món ngon, dịch vụ tại Quảng Trị'
              }
              placeholder={
                lang === 'en'
                  ? 'Search Phong Nha, DMZ, Sa Mu Pass, Nhat Le... (⌘K)'
                  : lang === 'ja'
                  ? 'フォンニャ、DMZ、サームー峠、ニャットレーを検索... (⌘K)'
                  : 'Tìm Phong Nha, Thành Cổ, Đèo Sa Mù, Cồn Cỏ... (⌘K)'
              }
            />

            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                aria-label="Xóa từ khóa tìm kiếm"
                className="hagiang-search-clear"
              >
                ✕
              </button>
            ) : (
              <kbd className="hagiang-search-shortcut">⌘K</kbd>
            )}

            {isSearchOpen && searchResults && (
              <div className="qt-live-search-dropdown" role="listbox" aria-label="Kết quả tìm kiếm">
                {searchResults.total === 0 ? (
                  <div className="qt-search-empty">
                    Không tìm thấy kết quả cho &ldquo;{searchQuery}&rdquo;.
                  </div>
                ) : (
                  <>
                    {searchResults.matchedPlaces.length > 0 && (
                      <div className="qt-search-group">
                        <div className="qt-search-group-label">📍 Điểm đến ({searchResults.matchedPlaces.length})</div>
                        {searchResults.matchedPlaces.map((p) => (
                          <div key={p.id} className="qt-search-row">
                            <Link
                              href={`/diem-den/${p.id}`}
                              onClick={() => setIsSearchOpen(false)}
                              className="qt-search-link"
                            >
                              <strong>{p.name}</strong>
                              <span>{p.zoneCode} · {p.zoneName}</span>
                            </Link>
                            {onSelectPlace && (
                              <button
                                type="button"
                                onClick={() => {
                                  setIsSearchOpen(false);
                                  onSelectPlace(p);
                                }}
                                className="qt-search-quick-btn"
                              >
                                Xem nhanh
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.matchedFoods.length > 0 && (
                      <div className="qt-search-group">
                        <div className="qt-search-group-label">🍲 Ẩm thực ({searchResults.matchedFoods.length})</div>
                        {searchResults.matchedFoods.map((f) => (
                          <div key={f.id} className="qt-search-row">
                            <Link href="/am-thuc" onClick={() => setIsSearchOpen(false)} className="qt-search-link">
                              <strong>{f.name}</strong>
                              <span>{f.origin} · {f.priceRange}</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.matchedServices.length > 0 && (
                      <div className="qt-search-group">
                        <div className="qt-search-group-label">🏕️ Dịch vụ ({searchResults.matchedServices.length})</div>
                        {searchResults.matchedServices.map((s) => (
                          <div key={s.id} className="qt-search-row">
                            <Link href="/dich-vu" onClick={() => setIsSearchOpen(false)} className="qt-search-link">
                              <strong>{s.name}</strong>
                              <span>{s.typeLabel} · {s.price}</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {searchResults.matchedItineraries.length > 0 && (
                      <div className="qt-search-group">
                        <div className="qt-search-group-label">🧭 Lịch trình ({searchResults.matchedItineraries.length})</div>
                        {searchResults.matchedItineraries.map((it) => (
                          <div key={it.id} className="qt-search-row">
                            <Link href="/lich-trinh" onClick={() => setIsSearchOpen(false)} className="qt-search-link">
                              <strong>{it.title}</strong>
                              <span>{it.duration} · {it.distance}</span>
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    <button type="button" onClick={scrollToPlaces} className="qt-search-map-cta">
                      Xem {filteredPlacesCount} điểm đến phù hợp trên bản đồ ↓
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          {suggestedPlaces.length > 0 && (
            <div className="hero-quick-picks">
              <span className="hero-quick-label">
                {lang === 'en' ? '✨ Quick picks:' : lang === 'ja' ? '✨ おすすめ:' : '✨ Gợi ý hôm nay:'}
              </span>
              {suggestedPlaces.map((place) => (
                <button
                  type="button"
                  key={place.id}
                  onClick={() => onSelectPlace?.(place)}
                  className="hagiang-tag-chip"
                >
                  {place.name}
                </button>
              ))}
              {places.length > 4 && (
                <button
                  type="button"
                  onClick={handleShuffleSuggestions}
                  className="hero-picks-shuffle"
                  title="Đổi gợi ý điểm đến"
                  aria-label="Đổi gợi ý điểm đến"
                >
                  🎲
                </button>
              )}
            </div>
          )}
        </div>

        <div className="hagiang-hero-right">
          <div className="hero-glass-stack">
            <ClockCalendarWidget />
            <WeatherWidget weatherData={weatherData} />
          </div>
        </div>
      </div>

      {/* Hero Slider Dots */}
      <div className="hagiang-capsule-dots">
        {heroSlides.map((slide, idx) => (
          <button
            type="button"
            key={slide.id || idx}
            onClick={() => setCurrentSlide(idx)}
            aria-label={`Chuyển tới slide ${idx + 1}: ${slide.title}`}
            className={`hagiang-dot ${idx === currentSlide ? 'active' : ''}`}
          />
        ))}
      </div>
    </section>
  );
}
