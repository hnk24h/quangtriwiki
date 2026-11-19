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
        <Link href="/" className="brand" title="Quangtri Wiki · Đôi bờ Hiền Lương & Cánh chim hòa bình">
          <div className="brand-logo-icon">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
              <path d="M16 13C16 7.8 20.8 4.2 25.8 4.2C23.2 8.4 19.6 10.5 16 13Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <path d="M16 13C16 7.8 11.2 4.2 6.2 4.2C8.8 8.4 12.4 10.5 16 13Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
              <circle cx="16" cy="6.2" r="1.3" fill="currentColor" />
              <path d="M4 22C9.5 15.2 22.5 15.2 28 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M3 22.5H29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <line x1="9.5" y1="22" x2="9.5" y2="18.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <line x1="16" y1="22" x2="16" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="22.5" y1="22" x2="22.5" y2="18.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              <path d="M6 26.5C10 24.8 14 27.5 18 25.8C22 24.2 25 26.8 28 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <div className="brand-title">Quangtri Wiki</div>
            <span className="brand-subtitle">ĐI CHẬM · KHÁM PHÁ</span>
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
