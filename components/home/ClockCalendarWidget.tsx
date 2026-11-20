'use client';

import React, { useEffect, useMemo, useState } from 'react';

const VN_WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

interface VnClockParts {
  year: number;
  month: number;
  day: number;
  hour: string;
  minute: string;
  second: string;
  weekdayLabel: string;
  sessionLabel: string;
}

function getVnSessionLabel(hour: number): string {
  if (hour >= 5 && hour <= 10) return '🌅 Buổi sáng';
  if (hour >= 11 && hour <= 13) return '☀️ Buổi trưa';
  if (hour >= 14 && hour <= 17) return '🌤️ Buổi chiều';
  if (hour >= 18 && hour <= 21) return '🌆 Buổi tối';
  return '🌙 Đêm khuya';
}

function getVnClockParts(date: Date): VnClockParts {
  const formatter = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });

  const partsMap: Record<string, string> = {};
  for (const part of formatter.formatToParts(date)) {
    if (part.type !== 'literal') {
      partsMap[part.type] = part.value;
    }
  }

  const year = Number(partsMap.year || 2026);
  const month = Number(partsMap.month || 1);
  const day = Number(partsMap.day || 1);
  const hourNum = Number(partsMap.hour || 0) % 24;
  const hour = String(hourNum).padStart(2, '0');
  const minute = String(partsMap.minute || '00').padStart(2, '0');
  const second = String(partsMap.second || '00').padStart(2, '0');
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekdayLabel: VN_WEEKDAYS[weekdayIndex],
    sessionLabel: getVnSessionLabel(hourNum),
  };
}

export default function ClockCalendarWidget() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const vn = useMemo(() => (now ? getVnClockParts(now) : null), [now]);

  const fullDateStr = vn
    ? `${String(vn.day).padStart(2, '0')}/${String(vn.month).padStart(2, '0')}/${vn.year}`
    : '--/--/----';

  return (
    <div className="hero-clock-calendar-glass" id="clock-calendar-widget">
      <div className="clock-cal-top">
        <div className="clock-live-block">
          <div className="clock-session-kicker">
            {vn ? `${vn.sessionLabel} · GMT+7` : '🕒 Giờ Việt Nam · GMT+7'}
          </div>
          <div className="clock-time-readout" aria-live="off">
            {vn ? (
              <>
                <span>{vn.hour}:{vn.minute}</span>
                <span className="clock-seconds">:{vn.second}</span>
              </>
            ) : (
              <span>--:--</span>
            )}
          </div>
        </div>

        <div className="clock-date-block">
          <div className="clock-weekday-text">{vn ? vn.weekdayLabel : 'Đang đồng bộ'}</div>
          <div className="clock-full-date">{fullDateStr}</div>
          <div className="clock-loc-label">Quảng Trị · Giờ địa phương</div>
        </div>
      </div>
    </div>
  );
}
