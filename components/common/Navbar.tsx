'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getBookmarkedIds, subscribeStorageSync } from '@/lib/storage';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    setBookmarkCount(getBookmarkedIds().length);
    return subscribeStorageSync(() => {
      setBookmarkCount(getBookmarkedIds().length);
    });
  }, []);

  // Close mobile menu on route change or Escape key
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileMenuOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: '/cung-duong', label: 'Khám phá cung đường' },
    { href: '/am-thuc', label: 'Ăn uống' },
    { href: '/dich-vu', label: 'Lưu trú & Dịch vụ' },
    { href: '/lich-trinh', label: 'Hành trình' },
    { href: '/dien-dan', label: 'Diễn đàn' },
    { href: '/tien-ich', label: 'Cây xăng & Trạm sạc' },
    { href: '/chi-phi', label: 'Chi Phí' },
    { href: '/so-tay', label: 'Sổ tay của tôi' },
  ];

  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" title="QuangTri.wiki · Đi đến nơi có gió">
          <div className="brand-logo-icon">
            <svg width="36" height="36" viewBox="0 0 64 64" fill="none" aria-hidden="true">
              <defs>
                <linearGradient id="navQtBg" x1="6" y1="4" x2="58" y2="60" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#174d3a" />
                  <stop offset="100%" stopColor="#0b261c" />
                </linearGradient>
              </defs>
              <rect width="64" height="64" rx="16" fill="url(#navQtBg)" />
              <circle cx="44" cy="18" r="5.5" fill="#fde047" />
              <path d="M12 43L25.5 24.5L35 36L42.5 27.5L52 43H12Z" fill="#ffffff" fillOpacity="0.16" stroke="#ffffff" strokeWidth="2.4" strokeLinejoin="round" />
              <path d="M11 23C18 18.5 26 26.5 34.5 21.5C37.5 19.8 39 17.2 37.5 15.2C36 13.4 33.2 14.2 32.5 16.3" stroke="#6ee7b7" strokeWidth="2.8" strokeLinecap="round" />
              <path d="M9 30.5C17 26.5 25.5 33.5 34 29.5" stroke="#fde047" strokeWidth="2.4" strokeLinecap="round" />
              <path d="M12 49C18 46.2 24 51.8 30.5 49C37 46.2 43 51.8 52 48.5" stroke="#6ee7b7" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="brand-title">QuangTri.wiki</div>
            <span className="brand-subtitle">ĐI ĐẾN NƠI CÓ GIÓ</span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="main-nav" aria-label="Điều hướng chính">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                {link.label}
                {link.href === '/so-tay' && bookmarkCount > 0 && (
                  <span style={{ marginLeft: '4px', background: '#133e2f', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '0.72rem' }}>
                    {bookmarkCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          <Link href="/dich-vu" className="header-contact-btn">
            <span>Kết nối với chúng tôi</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </Link>

          <Link
            href="/so-tay"
            className="notebook-trigger-btn"
            title="Mở Sổ tay phượt"
            aria-label={`Mở Sổ tay phượt (${bookmarkCount} điểm đã lưu)`}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
            {bookmarkCount > 0 && <span className="badge-counter">{bookmarkCount}</span>}
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            title="Menu"
            aria-label={mobileMenuOpen ? 'Đóng menu di động' : 'Mở menu di động'}
            aria-expanded={mobileMenuOpen}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>
      </div>

      <div className="sub-header-strip">
        <span>Lên lịch trình · Trải nghiệm · Lưu nhật ký</span>
      </div>

      {mobileMenuOpen && (
        <nav
          aria-label="Menu di động"
          style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem 1.25rem',
            background: '#fff',
            borderBottom: '1px solid #e5e7eb',
            gap: '0.6rem',
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`nav-link ${pathname === link.href ? 'active' : ''}`}
            >
              {link.label}
              {link.href === '/so-tay' && bookmarkCount > 0 ? ` (${bookmarkCount})` : ''}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
