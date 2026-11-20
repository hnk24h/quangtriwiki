'use client';

import React from 'react';
import Link from 'next/link';
import type { AnalyticsSummary } from '@/lib/supabase/types';

interface AdminAnalyticsTabProps {
  analytics: AnalyticsSummary | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function AdminAnalyticsTab({ analytics, loading, onRefresh }: AdminAnalyticsTabProps) {
  const data = analytics || {
    totalViews: 0,
    todayViews: 0,
    last7DaysViews: 0,
    prev7DaysViews: 0,
    growthPercent: null,
    hourlyDistribution: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      label: `${String(hour).padStart(2, '0')}h`,
      count: 0,
    })),
    peakHourRange: 'Chưa có dữ liệu',
    peakHourSharePercent: 0,
    topPages: [],
    deviceBreakdown: [],
    regionBreakdown: [],
  };

  const maxHourCount = Math.max(1, ...data.hourlyDistribution.map((b) => b.count));

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#133e2f', margin: 0 }}>
              Phân Tích Lượt Xem Thực Tế (Database)
            </h2>
            <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
              ● Supabase Live
            </span>
          </div>
          <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0.35rem 0 0' }}>
            Thống kê trực tiếp từ bảng <code>page_views</code> theo múi giờ Việt Nam (UTC+7), loại trừ bot & crawler.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button
            onClick={onRefresh}
            disabled={loading}
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
          >
            {loading ? <><i className="bi bi-hourglass-split" aria-hidden="true" /> Đang tải...</> : <><i className="bi bi-arrow-clockwise" aria-hidden="true" /> Đồng bộ từ Database</>}
          </button>
          <Link
            href="/"
            target="_blank"
            style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#133e2f', color: '#fff', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
          >
            <i className="bi bi-eye" aria-hidden="true" /> Xem trang chủ ↗
          </Link>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Tổng lượt xem tích lũy</span>
          <strong style={{ fontSize: '2.1rem', color: '#0f172a', display: 'block', margin: '0.35rem 0' }}>
            {data.totalViews.toLocaleString('vi-VN')}
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            7 ngày gần nhất: <strong>{data.last7DaysViews.toLocaleString('vi-VN')}</strong>
          </span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Lượt xem hôm nay (UTC+7)</span>
          <strong style={{ fontSize: '2.1rem', color: '#059669', display: 'block', margin: '0.35rem 0' }}>
            {data.todayViews.toLocaleString('vi-VN')}
          </strong>
          <span style={{ fontSize: '0.78rem', color: data.growthPercent !== null && data.growthPercent >= 0 ? '#059669' : '#6b7280', fontWeight: 600 }}>
            {data.growthPercent !== null
              ? `${data.growthPercent >= 0 ? '↑ +' : '↓ '}${data.growthPercent}% so với 7 ngày trước`
              : 'Đang thu thập dữ liệu so sánh tuần'}
          </span>
        </div>

        <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Khung giờ cao điểm (30 ngày)</span>
          <strong style={{ fontSize: '1.8rem', color: '#2563eb', display: 'block', margin: '0.35rem 0' }}>
            {data.peakHourRange}
          </strong>
          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>
            Chiếm <strong>{data.peakHourSharePercent}%</strong> lưu lượng đo được
          </span>
        </div>

        <div style={{ background: '#133e2f', color: '#ffffff', padding: '1.4rem', borderRadius: '16px' }}>
          <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>Trang được xem nhiều nhất</span>
          <strong style={{ fontSize: '1.35rem', color: '#fde047', display: 'block', margin: '0.45rem 0', wordBreak: 'break-all' }}>
            {data.topPages[0]?.path || '/'}
          </strong>
          <span style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)' }}>
            {data.topPages[0] ? `${data.topPages[0].count} lượt (${data.topPages[0].percent}%)` : 'Chưa ghi nhận phiên xem'}
          </span>
        </div>
      </div>

      {/* Hourly Chart */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.35rem' }}>
          1. Phân Bổ Lượt Xem Theo Khung Giờ (30 ngày qua · Giờ Việt Nam)
        </h3>
        <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: '0 0 1.25rem' }}>
          Biểu đồ cột thực tế giúp xác định khung giờ người dùng tra cứu lịch trình nhiều nhất.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gap: '0.3rem', alignItems: 'end', height: '160px', padding: '0.5rem 0', borderBottom: '1px solid #e5e7eb' }}>
          {data.hourlyDistribution.map((b) => {
            const heightPct = b.count > 0 ? Math.max(8, Math.round((b.count / maxHourCount) * 100)) : 3;
            return (
              <div key={b.hour} title={`${b.label}: ${b.count} lượt`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                <div
                  style={{
                    width: '100%',
                    height: `${heightPct}%`,
                    backgroundColor: b.count > 0 ? '#133e2f' : '#e5e7eb',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.2s ease',
                  }}
                />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))', gap: '0.3rem', marginTop: '0.35rem', textAlign: 'center', fontSize: '0.68rem', color: '#6b7280' }}>
          {data.hourlyDistribution.map((b) => (
            <span key={b.hour}>{b.hour % 3 === 0 ? b.label : ''}</span>
          ))}
        </div>
      </div>

      {/* 2-Column Split: Top Pages + Device / Geo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        {/* Top Pages */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#133e2f', margin: '0 0 1rem' }}>
            2. Đường Dẫn Phổ Biến Nhất
          </h3>
          {data.topPages.length === 0 ? (
            <p style={{ color: '#6b7280', fontSize: '0.86rem' }}>Chưa có dữ liệu truy cập trang.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {data.topPages.map((pg) => (
                <div key={pg.path}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', marginBottom: '0.25rem' }}>
                    <code style={{ color: '#133e2f', fontWeight: 700 }}>{pg.path}</code>
                    <span style={{ color: '#4b5563' }}>
                      <strong>{pg.count}</strong> ({pg.percent}%)
                    </span>
                  </div>
                  <div style={{ height: '6px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                    <div style={{ width: `${pg.percent}%`, height: '100%', background: '#059669' }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Devices & Regions */}
        <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.85rem' }}>
              3. Thiết Bị Truy Cập (User-Agent)
            </h3>
            {data.deviceBreakdown.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.86rem' }}>Chưa có dữ liệu thiết bị.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {data.deviceBreakdown.map((d) => (
                  <div key={d.device} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', padding: '0.5rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>
                      <i className={`bi ${d.device === 'Mobile' ? 'bi-phone' : d.device === 'Tablet' ? 'bi-tablet' : 'bi-laptop'}`} aria-hidden="true" /> {d.device}
                    </span>
                    <span style={{ color: '#059669', fontWeight: 700 }}>
                      {d.count} lượt ({d.percent}%)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.85rem' }}>
              4. Khu Vực Địa Lý (Vercel Edge Headers)
            </h3>
            {data.regionBreakdown.length === 0 ? (
              <p style={{ color: '#6b7280', fontSize: '0.83rem', lineHeight: 1.5, margin: 0 }}>
                Chưa ghi nhận dữ liệu khu vực (thông tin tỉnh/thành phố từ header <code>x-vercel-ip-city</code> chỉ được gắn tự động khi chạy trên môi trường production Vercel).
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {data.regionBreakdown.map((r) => (
                  <div key={r.region} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', padding: '0.45rem 0.75rem', background: '#f8fafc', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 600, color: '#133e2f' }}><i className="bi bi-geo-alt-fill" aria-hidden="true" /> {r.region}</span>
                    <span style={{ color: '#4b5563' }}>{r.count} ({r.percent}%)</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Honest Demographics Notice */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '14px', padding: '1.15rem 1.4rem', fontSize: '0.85rem', color: '#1e3a8a', lineHeight: 1.6 }}>
        <strong>ℹ️ Lưu ý về Nhân khẩu học (Tỷ lệ Nam / Nữ & Độ tuổi):</strong> Hệ thống Database nội bộ chỉ thu thập dữ liệu kỹ thuật ẩn danh (đường dẫn, thời điểm, thiết bị, vùng IP). Để theo dõi nhân khẩu học (giới tính, độ tuổi, sở thích), hãy gắn thêm mã <strong>Google Analytics 4 (GA4)</strong> có bật Google Signals vào <code>app/layout.tsx</code>.
      </div>
    </div>
  );
}
