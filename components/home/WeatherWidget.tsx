'use client';

import React, { useState } from 'react';
import type { WeatherLocationData } from '@/lib/weather';

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

export default function WeatherWidget({ weatherData }: WeatherWidgetProps) {
  const keys = Object.keys(weatherData || {});
  const [weatherLocKey, setWeatherLocKey] = useState(
    weatherData['huong-hoa'] ? 'huong-hoa' : keys[0] || 'huong-hoa'
  );
  const [weatherDayIdx, setWeatherDayIdx] = useState(0);

  const currentLoc = weatherData[weatherLocKey] || weatherData[keys[0]];
  if (!currentLoc) return null;

  const forecastList = Array.isArray(currentLoc.forecast) ? currentLoc.forecast : [];
  const selectedDay = forecastList[weatherDayIdx] || forecastList[0];
  const isToday = weatherDayIdx === 0;

  const displayCondition = isToday
    ? currentLoc.current?.condition || selectedDay?.condition
    : selectedDay?.condition || currentLoc.current?.condition;

  const displayIcon = isToday ? currentLoc.current?.icon || selectedDay?.icon : selectedDay?.icon;
  const displayTempOrRange = isToday
    ? `${currentLoc.current?.temp ?? selectedDay?.high ?? 22}°C`
    : `${selectedDay?.low ?? 18}°–${selectedDay?.high ?? 25}°C`;
  const displayRain = selectedDay?.rain || currentLoc.current?.rainChance || '20%';
  const displayWind = isToday
    ? currentLoc.current?.wind || selectedDay?.windMax || '10 km/h'
    : selectedDay?.windMax || currentLoc.current?.wind || '10 km/h';

  return (
    <div className="weather-card-glass" id="weather-card-widget">
      <div className="weather-card-header">
        <div>
          <span className="weather-region-tag">
            {currentLoc.region} · {currentLoc.source === 'open-meteo' ? '● Open-Meteo Live' : 'Dự báo tham khảo'}
          </span>
          <h3 className="weather-card-title">Thời tiết sắp tới</h3>
          <p className="weather-card-meta">
            7 ngày · °C · Giờ Việt Nam
            <br />
            Chọn từng ngày bên dưới để xem chi tiết
          </p>
        </div>

        <select
          value={weatherLocKey}
          aria-label="Chọn khu vực dự báo thời tiết"
          onChange={(e) => {
            setWeatherLocKey(e.target.value);
            setWeatherDayIdx(0);
          }}
          className="weather-district-dropdown"
        >
          {keys.map((k) => (
            <option key={k} value={k}>
              {weatherData[k]?.name || k}
            </option>
          ))}
        </select>
      </div>

      <div className="weather-days-row">
        {forecastList.map((fc, idx) => (
          <button
            type="button"
            key={idx}
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

      <div className="weather-detail-box">
        <div className="weather-detail-time">
          {isToday
            ? `Hiện tại · ${currentLoc.name}`
            : `Dự báo ${selectedDay?.day} (${selectedDay?.date}) · ${currentLoc.name}`}
        </div>
        <div className="weather-detail-condition">
          <span className="weather-detail-icon">{getWeatherEmoji(displayIcon)}</span>
          <strong>
            {displayCondition} · {displayTempOrRange}
          </strong>
        </div>

        <div className="weather-detail-metrics">
          <div className="metric-col">
            <div className="metric-label">Khả năng mưa</div>
            <div className="metric-value">{displayRain}</div>
            <div className="metric-sub">
              {parseInt(displayRain, 10) >= 50 ? 'Có khả năng mưa' : 'Ít mưa'}
            </div>
          </div>
          <div className="metric-col">
            <div className="metric-label">{isToday ? 'Độ ẩm' : 'Biên độ nhiệt'}</div>
            <div className="metric-value">
              {isToday ? currentLoc.current?.humidity : `${selectedDay?.low}° / ${selectedDay?.high}°`}
            </div>
            <div className="metric-sub">
              {isToday ? currentLoc.current?.humidityNote : 'Thấp / Cao nhất ngày'}
            </div>
          </div>
          <div className="metric-col">
            <div className="metric-label">{isToday ? 'Gió' : 'Gió tối đa'}</div>
            <div className="metric-value">{displayWind}</div>
            <div className="metric-sub">
              {parseInt(displayWind, 10) >= 22 ? 'Gió khá mạnh' : 'Gió nhẹ'}
            </div>
          </div>
        </div>
      </div>

      <div className="weather-advisories">
        <div className="advisory-item">
          <span>🌧️</span>
          <span>{currentLoc.tipRain}</span>
        </div>
        <div className="advisory-item">
          <span>☕</span>
          <span>{currentLoc.tipSleep}</span>
        </div>
      </div>
    </div>
  );
}
