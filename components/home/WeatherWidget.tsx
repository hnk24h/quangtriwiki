'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import {
  buildOpenMeteoBatchUrl,
  parseOpenMeteoResponse,
  type WeatherLocationData,
  type WeatherTargetZone,
} from '@/lib/weather';

interface WeatherWidgetProps {
  weatherData: Record<string, WeatherLocationData>;
}

function getWeatherEmoji(icon?: string): string {
  if (icon === 'sun') return '☀️';
  if (icon === 'fog') return '🌫️';
  if (icon === 'rain' || icon === 'cloud-rain') return '🌧️';
  if (icon === 'storm') return '⛈️';
  return '⛅';
}

function formatVnTime(isoString?: string): string {
  if (!isoString) return '';
  try {
    return new Intl.DateTimeFormat('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Ho_Chi_Minh',
    }).format(new Date(isoString));
  } catch {
    return '';
  }
}

export default function WeatherWidget({ weatherData }: WeatherWidgetProps) {
  const { lang } = useLanguage();
  const [liveWeather, setLiveWeather] = useState<Record<string, WeatherLocationData>>(weatherData || {});
  const keys = useMemo(() => Object.keys(liveWeather), [liveWeather]);

  const [weatherLocKey, setWeatherLocKey] = useState(() =>
    weatherData?.['QT-05'] ? 'QT-05' : Object.keys(weatherData || {})[0] || 'QT-05'
  );
  const [weatherDayIdx, setWeatherDayIdx] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const didAutoRefresh = useRef(false);
  const liveWeatherRef = useRef(liveWeather);
  liveWeatherRef.current = liveWeather;

  useEffect(() => {
    if (weatherData && Object.keys(weatherData).length > 0) {
      setLiveWeather(weatherData);
    }
  }, [weatherData]);

  const fetchBrowserDirectOpenMeteo = useCallback(
    async (currentMap: Record<string, WeatherLocationData>) => {
      const entries = Object.values(currentMap);
      if (entries.length === 0) return null;

      const targets: WeatherTargetZone[] = entries.map((loc) => ({
        key: loc.key,
        zoneCode: loc.zoneCode,
        name: loc.name,
        region: loc.region,
        lat: loc.lat,
        lon: loc.lon,
        typeGroup: loc.typeGroup || 'history',
      }));

      const url = buildOpenMeteoBatchUrl(targets);
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const res = await fetch(url, { cache: 'no-store', signal: controller.signal });
        if (!res.ok) return null;
        const rawJson = await res.json();
        return parseOpenMeteoResponse(rawJson, targets);
      } finally {
        clearTimeout(timeoutId);
      }
    },
    []
  );

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const directData = await fetchBrowserDirectOpenMeteo(liveWeatherRef.current);
      if (directData) {
        setLiveWeather(directData);
      }
    } catch {
      // retain current forecast gracefully
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchBrowserDirectOpenMeteo]);

  // Auto-upgrade fallback SSR weather to real Open-Meteo readings on mount
  useEffect(() => {
    if (didAutoRefresh.current) return;
    didAutoRefresh.current = true;
    const sample = Object.values(liveWeatherRef.current)[0];
    if (!sample || sample.source !== 'open-meteo') {
      handleRefresh();
    }
  }, [handleRefresh]);

  const currentLoc = liveWeather[weatherLocKey] || liveWeather[keys[0]];
  if (!currentLoc) return null;

  const forecastList = Array.isArray(currentLoc.forecast) ? currentLoc.forecast : [];
  const selectedDay = forecastList[weatherDayIdx] || forecastList[0];
  const isToday = weatherDayIdx === 0;

  const displayCondition = isToday
    ? currentLoc.current?.condition || selectedDay?.condition
    : selectedDay?.condition || currentLoc.current?.condition;

  const displayIcon = isToday ? currentLoc.current?.icon || selectedDay?.icon : selectedDay?.icon;
  const displayRain = selectedDay?.rain || currentLoc.current?.rainChance || '20%';
  const displayRainMm = isToday ? currentLoc.current?.rainMm ?? 0 : selectedDay?.rainMm ?? 0;
  const displayWind = isToday
    ? currentLoc.current?.wind || selectedDay?.windMax || '10 km/h'
    : selectedDay?.windMax || '10 km/h';
  const displayUv = selectedDay?.uvMax ?? currentLoc.current?.uvMax ?? 5;
  const displaySunrise = selectedDay?.sunrise || currentLoc.current?.sunrise || '05:45';
  const displaySunset = selectedDay?.sunset || currentLoc.current?.sunset || '17:40';
  const hourlySlots = selectedDay?.hourly || [];
  const updatedTime = formatVnTime(currentLoc.updatedAt);

  return (
    <div className="weather-card-glass" id="weather-card-widget">
      {/* Header */}
      <div className="weather-card-header" style={{ gap: '0.75rem' }}>
        <div style={{ minWidth: 0 }}>
          <div className="weather-live-strip">
            <span className="weather-region-tag">
              {currentLoc.source === 'open-meteo' ? '● Open-Meteo Live' : 'Dự báo khu vực'}
              {updatedTime ? ` · ${updatedTime}` : ''}
            </span>
            <span className="weather-coords-tag">
              {currentLoc.lat.toFixed(2)}°N, {currentLoc.lon.toFixed(2)}°E
            </span>
          </div>
          <h3 className="weather-card-title">
            {lang === 'en'
              ? `Weather ${currentLoc.zoneCode}`
              : lang === 'ja'
              ? `${currentLoc.zoneCode}の天気`
              : `Thời tiết ${currentLoc.zoneCode}`}
          </h3>
          <p className="weather-card-meta">
            {currentLoc.region} ·{' '}
            {lang === 'en'
              ? '7-day Vietnam forecast'
              : lang === 'ja'
              ? 'ベトナム時間 7日間予報'
              : '7 ngày theo giờ VN'}
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexShrink: 0 }}>
          <select
            value={currentLoc.key}
            aria-label="Chọn khu vực dự báo thời tiết"
            onChange={(e) => {
              setWeatherLocKey(e.target.value);
              setWeatherDayIdx(0);
            }}
            className="weather-district-dropdown"
            style={{ maxWidth: '175px' }}
          >
            {keys.map((k) => (
              <option key={k} value={k}>
                {liveWeather[k]?.zoneCode} · {liveWeather[k]?.name}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Cập nhật dữ liệu thời tiết mới nhất"
            aria-label="Làm mới thời tiết thực tế"
            className="weather-refresh-btn"
          >
            <span style={{ display: 'inline-block', transform: isRefreshing ? 'rotate(180deg)' : 'none', transition: 'transform 0.4s ease' }}>
              🔄
            </span>
          </button>
        </div>
      </div>

      {/* Hero Temperature & Current Condition Summary */}
      <div className="weather-now-hero">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <span style={{ fontSize: '2.1rem', lineHeight: 1 }}>{getWeatherEmoji(displayIcon)}</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
              <strong className="weather-now-temp">
                {isToday ? `${currentLoc.current?.temp ?? 22}°C` : `${selectedDay?.low}°–${selectedDay?.high}°C`}
              </strong>
              <span className="weather-now-sub">
                {isToday
                  ? `Cảm giác ${currentLoc.current?.feelsLike ?? currentLoc.current?.temp}°C · Mây ${currentLoc.current?.cloudCover || '40%'}`
                  : `${selectedDay?.day} (${selectedDay?.date})`}
              </span>
            </div>
            <div className="weather-now-condition">
              {displayCondition}
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Interactive Strip */}
      <div className="weather-days-row">
        {forecastList.map((fc, idx) => (
          <button
            type="button"
            key={fc.isoDate || idx}
            onClick={() => setWeatherDayIdx(idx)}
            className={`weather-day-card ${idx === weatherDayIdx ? 'active' : ''}`}
            style={{ cursor: 'pointer', textAlign: 'center', font: 'inherit', color: 'inherit' }}
          >
            <div className="weather-day-name">{fc.day}</div>
            <div className="weather-day-date">{fc.date}</div>
            <div className="weather-day-icon">{getWeatherEmoji(fc.icon)}</div>
            <div className="weather-day-temp-high">{fc.high}°</div>
            <div className="weather-day-temp-low">{fc.low}°</div>
            <div className="weather-day-rain">{fc.rain}</div>
          </button>
        ))}
      </div>

      {/* Expand / Collapse Hourly & Metrics Details */}
      <button
        type="button"
        onClick={() => setIsExpanded((prev) => !prev)}
        className="weather-expand-btn"
        aria-expanded={isExpanded}
      >
        <span>
          {isExpanded
            ? lang === 'en'
              ? 'Hide hourly & wind/UV details'
              : lang === 'ja'
              ? '時間別予報・詳細を閉じる'
              : 'Thu gọn chi tiết giờ & gió/UV'
            : lang === 'en'
            ? `Hourly details · Rain ${displayRain} · Wind ${displayWind}`
            : lang === 'ja'
            ? `時間別予報 · 降水 ${displayRain} · 風 ${displayWind}`
            : `Chi tiết theo giờ · Mưa ${displayRain} · Gió ${displayWind}`}
        </span>
        <span>{isExpanded ? '▴' : '▾'}</span>
      </button>

      {/* Hourly Slots + 4-Col Detailed Metrics (Expanded on demand) */}
      {isExpanded && (
        <>
          <div className="weather-detail-box" style={{ marginTop: '0.65rem' }}>
            {hourlySlots.length > 0 && (
              <div className="weather-hourly-strip" aria-label="Dự báo theo khung giờ trong ngày">
                {hourlySlots.map((slot) => (
                  <div key={slot.time} className="weather-hour-chip">
                    <span className="hour-label">{slot.time}</span>
                    <span className="hour-icon">{getWeatherEmoji(slot.icon)}</span>
                    <strong className="hour-temp">{slot.temp}°</strong>
                    <span className="hour-rain">💧{slot.rain}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="weather-detail-metrics-4">
              <div className="metric-col">
                <div className="metric-label">Mưa</div>
                <div className="metric-value">{displayRain}</div>
                <div className="metric-sub">{displayRainMm > 0 ? `${displayRainMm} mm` : 'Khô ráo'}</div>
              </div>
              <div className="metric-col">
                <div className="metric-label">{isToday ? 'Độ ẩm' : 'Chỉ số UV'}</div>
                <div className="metric-value">{isToday ? currentLoc.current?.humidity : `UV ${displayUv}`}</div>
                <div className="metric-sub">{isToday ? currentLoc.current?.humidityNote : displayUv >= 8 ? 'Nắng gắt' : 'Trung bình'}</div>
              </div>
              <div className="metric-col">
                <div className="metric-label">Gió</div>
                <div className="metric-value">{displayWind}</div>
                <div className="metric-sub">{isToday ? `Hướng ${currentLoc.current?.windDir}` : currentLoc.current?.windNote}</div>
              </div>
              <div className="metric-col">
                <div className="metric-label">Mặt trời</div>
                <div className="metric-value" style={{ fontSize: '0.92rem' }}>🌅 {displaySunrise}</div>
                <div className="metric-sub">🌇 Lặn {displaySunset}</div>
              </div>
            </div>
          </div>

          {/* Advisories */}
          <div className="weather-advisories" style={{ marginBottom: 0 }}>
            <div className="advisory-item">
              <span>🧭</span>
              <span>{currentLoc.tipRain}</span>
            </div>
            <div className="advisory-item">
              <span>🎒</span>
              <span>{currentLoc.tipSleep}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
