'use client';

import React, { useEffect, useState } from 'react';
import SafeImage from '@/components/common/SafeImage';

export interface SubpageHeroSlide {
  image: string;
  tag: string;
  title: string;
  caption: string;
}

interface SubpageHeroProps {
  kicker: string;
  kickerIcon?: string;
  title: string;
  subtitle: string;
  slides: SubpageHeroSlide[];
  highlights?: { icon: string; label: string }[];
  children?: React.ReactNode;
}

export default function SubpageHero({
  kicker,
  kickerIcon = 'bi-compass',
  title,
  subtitle,
  slides,
  highlights = [],
  children,
}: SubpageHeroProps) {
  const safeSlides = slides.length > 0 ? slides : [
    {
      image: '/images/deo-sa-mu-clouds.jpg',
      tag: 'Quảng Trị',
      title: 'Đi đến nơi có gió',
      caption: 'Hành trình khám phá di sản, đèo mây và biển đảo miền Trung.',
    },
  ];

  const [activeIdx, setActiveIdx] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (safeSlides.length <= 1 || isPaused) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % safeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [safeSlides.length, isPaused]);

  const activeSlide = safeSlides[activeIdx] || safeSlides[0];
  const prevSlide = () => setActiveIdx((prev) => (prev - 1 + safeSlides.length) % safeSlides.length);
  const nextSlide = () => setActiveIdx((prev) => (prev + 1) % safeSlides.length);

  return (
    <section
      className="subpage-hero-wrap"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Animated Ken Burns Background Slides */}
      <div className="subpage-hero-bg-layer" aria-hidden="true">
        {safeSlides.map((slide, idx) => (
          <div
            key={`${slide.image}-${idx}`}
            className={`subpage-hero-bg-slide ${idx === activeIdx ? 'is-active' : ''}`}
          >
            <SafeImage
              src={slide.image}
              alt=""
              fill
              priority={idx === 0}
              sizes="100vw"
              style={{ objectFit: 'cover' }}
            />
          </div>
        ))}
        <div className="subpage-hero-overlay" />
      </div>

      <div className="subpage-hero-inner">
        {/* Left: Editorial Copy + Highlights + CTA */}
        <div className="subpage-hero-copy subpage-hero-animate">
          <div className="subpage-hero-kicker">
            <i className={`bi ${kickerIcon}`} aria-hidden="true" />
            <span>{kicker}</span>
          </div>

          <h1 className="subpage-hero-title">{title}</h1>
          <p className="subpage-hero-subtitle">{subtitle}</p>

          {highlights.length > 0 && (
            <div className="subpage-hero-highlights">
              {highlights.map((item, idx) => (
                <span key={idx} className="subpage-hero-chip">
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </span>
              ))}
            </div>
          )}

          {children && <div className="subpage-hero-cta">{children}</div>}
        </div>

        {/* Right: Interactive Side Slide Card */}
        <div className="subpage-hero-side-card" aria-label="Trình chiếu hình ảnh nổi bật">
          <div className="subpage-side-media">
            {safeSlides.map((slide, idx) => (
              <div
                key={`card-${slide.image}-${idx}`}
                className={`subpage-side-img ${idx === activeIdx ? 'is-active' : ''}`}
              >
                <SafeImage
                  src={slide.image}
                  alt={slide.title}
                  fill
                  sizes="(max-width: 900px) 100vw, 380px"
                  style={{ objectFit: 'cover' }}
                />
              </div>
            ))}
            <span className="subpage-side-tag">{activeSlide.tag}</span>
            <span className="subpage-side-counter">
              {String(activeIdx + 1).padStart(2, '0')} / {String(safeSlides.length).padStart(2, '0')}
            </span>
          </div>

          <div className="subpage-side-body">
            <h2 className="subpage-side-title">{activeSlide.title}</h2>
            <p className="subpage-side-caption">{activeSlide.caption}</p>

            {safeSlides.length > 1 && (
              <div className="subpage-side-controls">
                <div className="subpage-side-dots">
                  {safeSlides.map((slide, idx) => (
                    <button
                      type="button"
                      key={`dot-${idx}`}
                      onClick={() => setActiveIdx(idx)}
                      aria-label={`Xem ảnh ${idx + 1}: ${slide.title}`}
                      className={`subpage-side-dot ${idx === activeIdx ? 'active' : ''}`}
                    />
                  ))}
                </div>
                <div className="subpage-side-arrows">
                  <button
                    type="button"
                    onClick={prevSlide}
                    aria-label="Ảnh trước"
                    className="subpage-arrow-btn"
                  >
                    <i className="bi bi-chevron-left" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={nextSlide}
                    aria-label="Ảnh tiếp theo"
                    className="subpage-arrow-btn"
                  >
                    <i className="bi bi-chevron-right" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
