'use client';

import React, { useEffect, useMemo, useState } from 'react';

interface ClockCalendarWidgetProps {
  forecastIsoDates?: string[];
  selectedIsoDate?: string | null;
  onSelectIsoDate?: (isoDate: string) => void;
}

const VN_WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
];

const SHORT_DAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

interface VnDateParts {
  year: number;
  month: number;
  day: number;
  hourNum: number;
  hour: string;
  minute: string;
  second: string;
  isoDate: string;
  weekdayIndex: number;
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

function getVnDateParts(date: Date): VnDateParts {
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

  const mm = String(month).padStart(2, '0');
  const dd = String(day).padStart(2, '0');
  const isoDate = `${year}-${mm}-${dd}`;
  const weekdayIndex = new Date(Date.UTC(year, month - 1, day)).getUTCDay();

  return {
    year,
    month,
    day,
    hourNum,
    hour,
    minute,
    second,
    isoDate,
    weekdayIndex,
    weekdayLabel: VN_WEEKDAYS[weekdayIndex],
    sessionLabel: getVnSessionLabel(hourNum),
  };
}

function formatUtcIso(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function ClockCalendarWidget({
  forecastIsoDates = [],
  selectedIsoDate,
  onSelectIsoDate,
}: ClockCalendarWidgetProps) {
  const [now, setNow] = useState<Date | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [viewYear, setViewYear] = useState(2026);
  const [viewMonth, setViewMonth] = useState(1);

  useEffect(() => {
    const initial = new Date();
    const parts = getVnDateParts(initial);
    setNow(initial);
    setViewYear(parts.year);
    setViewMonth(parts.month);

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const vn = useMemo(() => (now ? getVnDateParts(now) : null), [now]);

  const forecastSet = useMemo(() => new Set(forecastIsoDates), [forecastIsoDates]);

  const weekDays = useMemo(() => {
    if (!vn) return [];
    const mondayOffset = (vn.weekdayIndex + 6) % 7;
    return SHORT_DAYS.map((shortLabel, idx) => {
      const d = new Date(Date.UTC(vn.year, vn.month - 1, vn.day - mondayOffset + idx));
      const iso = formatUtcIso(d);
      return {
        shortLabel,
        dayNum: d.getUTCDate(),
        iso,
        isToday: iso === vn.isoDate,
        isWeekend: idx >= 5,
        hasForecast: forecastSet.has(iso),
      };
    });
  }, [vn, forecastSet]);

  const monthCells = useMemo(() => {
    const firstDayOffset = (new Date(Date.UTC(viewYear, viewMonth - 1, 1)).getUTCDay() + 6) % 7;
    const daysInMonth = new Date(Date.UTC(viewYear, viewMonth, 0)).getUTCDate();
    const cells: Array<{
      key: string;
      dayNum: number | null;
      iso?: string;
      isWeekend?: boolean;
    }> = [];

    for (let i = 0; i < firstDayOffset; i++) {
      cells.push({ key: `empty-${i}`, dayNum: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const utcDay = new Date(Date.UTC(viewYear, viewMonth - 1, d)).getUTCDay();
      const mm = String(viewMonth).padStart(2, '0');
      const dd = String(d).padStart(2, '0');
      const iso = `${viewYear}-${mm}-${dd}`;
      cells.push({
        key: iso,
        dayNum: d,
        iso,
        isWeekend: utcDay === 0 || utcDay === 6,
      });
    }
    return cells;
  }, [viewYear, viewMonth]);

  const goPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    const d = new Date();
    const parts = getVnDateParts(d);
    setViewYear(parts.year);
    setViewMonth(parts.month);
    onSelectIsoDate?.(parts.isoDate);
  };

  const fullDateStr = vn
    ? `${String(vn.day).padStart(2, '0')}/${String(vn.month).padStart(2, '0')}/${vn.year}`
    : '--/--/----';

  return (
    <div className="hero-clock-calendar-glass" id="clock-calendar-widget">
      {/* Top Row: Live VN Clock + Date + Calendar Toggle */}
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
          <div className="clock-weekday-text">{vn ? vn.weekdayLabel : 'Đang đồng bộ lịch'}</div>
          <div className="clock-full-date">{fullDateStr}</div>
          <button
            type="button"
            onClick={() => setIsCalendarOpen((prev) => !prev)}
            className="clock-cal-toggle-btn"
            aria-expanded={isCalendarOpen}
          >
            <span>📅</span>
            <span>{isCalendarOpen ? 'Thu gọn' : 'Lịch tháng'}</span>
          </button>
        </div>
      </div>

      {/* Compact 7-day Week Strip */}
      {!isCalendarOpen && weekDays.length > 0 && (
        <div className="clock-week-strip" role="group" aria-label="Lịch tuần hiện tại">
          {weekDays.map((item) => {
            const isSelected = selectedIsoDate ? selectedIsoDate === item.iso : item.isToday;
            return (
              <button
                type="button"
                key={item.iso}
                onClick={() => onSelectIsoDate?.(item.iso)}
                title={
                  item.hasForecast
                    ? `${item.shortLabel} (${item.iso}) · Xem dự báo thời tiết`
                    : `${item.shortLabel} (${item.iso})`
                }
                className={[
                  'clock-week-day',
                  item.isToday ? 'is-today' : '',
                  isSelected ? 'is-selected' : '',
                  item.isWeekend ? 'is-weekend' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
              >
                <span className="week-day-name">{item.shortLabel}</span>
                <span className="week-day-num">{item.dayNum}</span>
                {item.hasForecast && <span className="clock-forecast-dot" aria-hidden="true" />}
              </button>
            );
          })}
        </div>
      )}

      {/* Expandable Full Month Calendar */}
      {isCalendarOpen && (
        <div className="clock-month-panel" role="region" aria-label={`Lịch tháng ${viewMonth} năm ${viewYear}`}>
          <div className="clock-month-nav">
            <div className="clock-month-title">
              Tháng {viewMonth}, {viewYear}
            </div>
            <div className="clock-month-actions">
              <button type="button" onClick={goPrevMonth} className="clock-nav-btn" aria-label="Tháng trước">
                ‹
              </button>
              <button type="button" onClick={goToday} className="clock-today-btn">
                Hôm nay
              </button>
              <button type="button" onClick={goNextMonth} className="clock-nav-btn" aria-label="Tháng sau">
                ›
              </button>
            </div>
          </div>

          <div className="clock-month-weekdays">
            {SHORT_DAYS.map((lbl, idx) => (
              <span key={lbl} className={idx >= 5 ? 'is-weekend' : ''}>
                {lbl}
              </span>
            ))}
          </div>

          <div className="clock-month-grid">
            {monthCells.map((cell) => {
              if (!cell.dayNum || !cell.iso) {
                return <div key={cell.key} className="clock-month-cell empty" aria-hidden="true" />;
              }
              const isToday = vn?.isoDate === cell.iso;
              const isSelected = selectedIsoDate ? selectedIsoDate === cell.iso : isToday;
              const hasForecast = forecastSet.has(cell.iso);

              return (
                <button
                  type="button"
                  key={cell.key}
                  onClick={() => onSelectIsoDate?.(cell.iso!)}
                  className={[
                    'clock-month-cell',
                    isToday ? 'is-today' : '',
                    isSelected ? 'is-selected' : '',
                    cell.isWeekend ? 'is-weekend' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                >
                  <span>{cell.dayNum}</span>
                  {hasForecast && <span className="clock-forecast-dot" aria-hidden="true" />}
                </button>
              );
            })}
          </div>

          <div className="clock-month-legend">
            <span>
              <i className="legend-dot forecast" /> Có dự báo 7 ngày
            </span>
            <span>
              <i className="legend-dot today" /> Hôm nay
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
