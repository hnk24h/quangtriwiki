'use client';

import React, { useState, useMemo, useRef } from 'react';
import Link from 'next/link';
import { QUANGTRI_DATA } from '@/lib/data';

interface Place {
  id: string;
  name: string;
  zoneCode: string;
  zoneName: string;
  category: string;
  categoryName?: string;
  image?: string;
  hero_image?: string;
  rating?: number;
  reviewsCount?: number;
  shortDesc?: string;
  fullDesc?: string;
  highlights?: string[];
  ticket?: string;
  openHours?: string;
  coordinates?: string;
  address?: string;
  tips?: string;
}

interface MapCoordinate {
  id: string;
  x: number;
  y: number;
  terrainType: 'mountain' | 'history' | 'coastal' | 'island';
  routeLabel: string;
  flagColor: string;
}

const MAP_COORDINATES: Record<string, MapCoordinate> = {
  'deo-sa-mu': {
    id: 'deo-sa-mu',
    x: 180,
    y: 130,
    terrainType: 'mountain',
    routeLabel: 'Đỉnh Đèo Sa Mù 1.400m',
    flagColor: '#10b981',
  },
  'thac-chenh-venh': {
    id: 'thac-chenh-venh',
    x: 215,
    y: 200,
    terrainType: 'mountain',
    routeLabel: 'Thác Rừng Chênh Vênh',
    flagColor: '#06b6d4',
  },
  'canh-dong-dien-gio-huong-linh': {
    id: 'canh-dong-dien-gio-huong-linh',
    x: 240,
    y: 275,
    terrainType: 'mountain',
    routeLabel: 'Cánh Đồng Điện Gió',
    flagColor: '#84cc16',
  },
  'san-bay-ta-con': {
    id: 'san-bay-ta-con',
    x: 270,
    y: 360,
    terrainType: 'mountain',
    routeLabel: 'Cứ Điểm Khe Sanh & Tà Cơn',
    flagColor: '#f59e0b',
  },
  'cau-treo-dakrong': {
    id: 'cau-treo-dakrong',
    x: 430,
    y: 375,
    terrainType: 'mountain',
    routeLabel: 'Ngã Ba Cầu Treo Đakrông',
    flagColor: '#10b981',
  },
  'den-vua-ham-nghi-tan-so': {
    id: 'den-vua-ham-nghi-tan-so',
    x: 540,
    y: 310,
    terrainType: 'history',
    routeLabel: 'Căn Cứ Tân Sở Cam Lộ',
    flagColor: '#e11d48',
  },
  'nghia-trang-truong-son': {
    id: 'nghia-trang-truong-son',
    x: 550,
    y: 190,
    terrainType: 'history',
    routeLabel: 'Nghĩa Trang QG Trường Sơn',
    flagColor: '#e11d48',
  },
  'cau-hien-luong-ben-hai': {
    id: 'cau-hien-luong-ben-hai',
    x: 650,
    y: 135,
    terrainType: 'history',
    routeLabel: 'Cầu Hiền Lương - Vĩ Tuyến 17',
    flagColor: '#f59e0b',
  },
  'dia-dao-vinh-moc': {
    id: 'dia-dao-vinh-moc',
    x: 740,
    y: 110,
    terrainType: 'history',
    routeLabel: 'Kỳ Quan Địa Đạo Vịnh Mốc',
    flagColor: '#f43f5e',
  },
  'mui-treo-quang-tri': {
    id: 'mui-treo-quang-tri',
    x: 720,
    y: 155,
    terrainType: 'coastal',
    routeLabel: 'Vách Đá Mũi Trèo',
    flagColor: '#0ea5e9',
  },
  'bien-cua-viet': {
    id: 'bien-cua-viet',
    x: 780,
    y: 270,
    terrainType: 'coastal',
    routeLabel: 'Bãi Biển & Cảng Cửa Việt',
    flagColor: '#0284c7',
  },
  'thanh-co-quang-tri': {
    id: 'thanh-co-quang-tri',
    x: 700,
    y: 380,
    terrainType: 'history',
    routeLabel: 'Thành Cổ Quảng Trị 81 Ngày Đêm',
    flagColor: '#dc2626',
  },
  'thanh-dia-la-vang': {
    id: 'thanh-dia-la-vang',
    x: 715,
    y: 455,
    terrainType: 'history',
    routeLabel: 'Thánh Địa Hành Hương La Vang',
    flagColor: '#9333ea',
  },
  'dao-con-co': {
    id: 'dao-con-co',
    x: 910,
    y: 105,
    terrainType: 'island',
    routeLabel: 'Đảo Tiền Tiêu Cồn Cỏ (15 Hải Lý)',
    flagColor: '#059669',
  },
};

const TOUR_ROUTES = [
  {
    id: 'all',
    title: 'Toàn bộ tọa độ',
    subtitle: '14 điểm đến bao quát tỉnh lộ',
    icon: '🧭',
    places: [
      'cau-hien-luong-ben-hai', 'dia-dao-vinh-moc', 'nghia-trang-truong-son', 'thanh-co-quang-tri',
      'thanh-dia-la-vang', 'bien-cua-viet', 'mui-treo-quang-tri', 'den-vua-ham-nghi-tan-so',
      'cau-treo-dakrong', 'san-bay-ta-con', 'canh-dong-dien-gio-huong-linh', 'thac-chenh-venh',
      'deo-sa-mu', 'dao-con-co'
    ],
  },
  {
    id: 'dmz',
    title: 'Tuyến Ký Ức DMZ - QL 1A',
    subtitle: 'Vĩ tuyến 17 · Thành Cổ · Vịnh Mốc (5 trạm)',
    icon: '🏛️',
    places: ['cau-hien-luong-ben-hai', 'dia-dao-vinh-moc', 'nghia-trang-truong-son', 'thanh-co-quang-tri', 'thanh-dia-la-vang'],
  },
  {
    id: 'ql9',
    title: 'Tuyến QL 9 - Xuyên Á Khe Sanh',
    subtitle: 'Cửa Việt ➔ Cam Lộ ➔ Đakrông ➔ Khe Sanh (4 trạm)',
    icon: '⛰️',
    places: ['bien-cua-viet', 'den-vua-ham-nghi-tan-so', 'cau-treo-dakrong', 'san-bay-ta-con'],
  },
  {
    id: 'hcm-tay',
    title: 'Tuyến Săn Mây - HCM Tây',
    subtitle: 'Tà Cơn ➔ Điện gió ➔ Thác Chênh Vênh ➔ Sa Mù (4 trạm)',
    icon: '☁️',
    places: ['san-bay-ta-con', 'canh-dong-dien-gio-huong-linh', 'thac-chenh-venh', 'deo-sa-mu'],
  },
  {
    id: 'con-co',
    title: 'Hải Trình Đảo Ngọc Cồn Cỏ',
    subtitle: 'Cảng Cửa Việt ➔ Mũi Trèo ➔ Đảo Cồn Cỏ (3 trạm)',
    icon: '🏝️',
    places: ['bien-cua-viet', 'mui-treo-quang-tri', 'dao-con-co'],
  },
];

interface Props {
  places: Place[];
  onOpenModal?: (place: Place) => void;
  bookmarkedIds?: string[];
  onToggleBookmark?: (id: string, e?: React.MouseEvent) => void;
}

export default function QuangTriInteractiveMap({
  places = [],
  onOpenModal,
  bookmarkedIds = [],
  onToggleBookmark,
}: Props) {
  const [selectedRouteId, setSelectedRouteId] = useState<string>('all');
  const [selectedId, setSelectedId] = useState<string>('thanh-co-quang-tri');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copiedGps, setCopiedGps] = useState(false);
  const [isRoutesOpen, setIsRoutesOpen] = useState(true);
  const [internalModalPlace, setInternalModalPlace] = useState<Place | null>(null);
  const horizontalScrollRef = useRef<HTMLDivElement>(null);

  // Fallback data pool so no place is ever undefined or missing
  const allPlacesPool = useMemo(() => {
    const map = new Map<string, Place>();
    (QUANGTRI_DATA.places as Place[]).forEach((p) => map.set(p.id, p));
    (places || []).forEach((p) => {
      const existing = map.get(p.id) || {};
      map.set(p.id, { ...existing, ...p });
    });
    return Array.from(map.values());
  }, [places]);

  // Active tour route object
  const activeRoute = useMemo(() => {
    return TOUR_ROUTES.find((r) => r.id === selectedRouteId) || TOUR_ROUTES[0];
  }, [selectedRouteId]);

  // Places belonging to the active route, ordered chronologically
  const routePlaces = useMemo(() => {
    const ids = activeRoute.places;
    return ids
      .map((id) => allPlacesPool.find((p) => p.id === id))
      .filter(Boolean) as Place[];
  }, [allPlacesPool, activeRoute]);

  // Currently focused place
  const focusedPlace = useMemo(() => {
    return allPlacesPool.find((p) => p.id === selectedId) || routePlaces[0] || allPlacesPool[0];
  }, [allPlacesPool, selectedId, routePlaces]);

  const handleOpenDetailModal = (placeToView: Place) => {
    if (onOpenModal) {
      onOpenModal(placeToView);
    } else {
      setInternalModalPlace(placeToView);
    }
  };

  const handleSelectRoute = (routeId: string) => {
    setSelectedRouteId(routeId);
    const targetRoute = TOUR_ROUTES.find((r) => r.id === routeId);
    if (targetRoute && targetRoute.places.length > 0) {
      setSelectedId(targetRoute.places[0]);
    }
    // Scroll carousel back to start
    if (horizontalScrollRef.current) {
      horizontalScrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
    }
  };

  const handleSelectPlace = (id: string) => {
    setSelectedId(id);
    // Auto scroll matching card into view in horizontal list
    const cardEl = document.getElementById(`hcard-${id}`);
    if (cardEl && horizontalScrollRef.current) {
      cardEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  };

  const handleScrollCarousel = (direction: 'left' | 'right') => {
    if (horizontalScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      horizontalScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleCopyGps = (coords?: string) => {
    if (!coords) return;
    try {
      navigator.clipboard.writeText(coords);
      setCopiedGps(true);
      setTimeout(() => setCopiedGps(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="qt-map-stage-wrapper">
      {/* 1. Panoramic Map Canvas on Top with Floating Layers */}
      <div className="panoramic-map-canvas-container">
        {/* Floating Route Layer Overlay on the LEFT (Tiết kiệm diện tích, dạng layer nổi trên map) */}
        {isRoutesOpen ? (
          <div className="map-routes-layer-overlay">
            <div className="routes-layer-header">
              <div className="routes-layer-title-wrap">
                <span className="routes-layer-icon">🧭</span>
                <div>
                  <h4 className="routes-layer-title">Cung Đường Quảng Trị</h4>
                  <span className="routes-layer-sub">Lớp bản đồ chuyên đề</span>
                </div>
              </div>
              <button
                onClick={() => setIsRoutesOpen(false)}
                className="routes-layer-toggle-btn"
                title="Thu gọn bảng tuyến đường"
                aria-label="Thu gọn"
              >
                ◀
              </button>
            </div>

            <div className="routes-layer-list">
              {TOUR_ROUTES.map((route) => {
                const isActive = selectedRouteId === route.id;
                const stopsCount = route.id === 'all' ? places.length : route.places.length;

                return (
                  <button
                    key={route.id}
                    onClick={() => handleSelectRoute(route.id)}
                    className={`route-layer-item ${isActive ? 'active' : ''}`}
                  >
                    <span className="route-layer-badge-icon">{route.icon}</span>
                    <div className="route-layer-item-content">
                      <div className="route-layer-item-head">
                        <span className="route-layer-item-title">{route.title}</span>
                        <span className="route-layer-stops-count">{stopsCount} trạm</span>
                      </div>
                      <span className="route-layer-item-sub">{route.subtitle}</span>
                    </div>
                    {isActive && <span className="route-layer-active-indicator" />}
                  </button>
                );
              })}
            </div>

            {/* Compact Legend integrated inside layer card */}
            <div className="routes-layer-legend">
              <span className="rlegend-pill"><span className="legend-bar ql1a" /> QL 1A</span>
              <span className="rlegend-pill"><span className="legend-bar ql9" /> QL 9</span>
              <span className="rlegend-pill"><span className="legend-bar hcm" /> HCM Tây</span>
              <span className="rlegend-pill"><span className="legend-bar sea" /> Cồn Cỏ</span>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setIsRoutesOpen(true)}
            className="routes-layer-collapsed-pill"
            title="Mở bảng chọn cung đường"
          >
            <span className="collapsed-pill-icon">{activeRoute.icon}</span>
            <span className="collapsed-pill-text">
              <strong>Tuyến:</strong> {activeRoute.title}
            </span>
            <span className="collapsed-pill-arrow">▶</span>
          </button>
        )}

        {/* Floating Center Badge for Map Identity */}
        <div className="stage-live-badge-floating">
          <span className="live-radar-ping" />
          <span>TỌA ĐỘ & CUNG ĐƯỜNG QUẢNG TRỊ</span>
        </div>

        <svg
          viewBox="0 0 1050 540"
          className="panoramic-svg-element"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Gradients */}
            <linearGradient id="panoWestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#081e17" />
              <stop offset="50%" stopColor="#0f3326" />
              <stop offset="100%" stopColor="#184a37" />
            </linearGradient>

            <linearGradient id="panoPlainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#184a37" />
              <stop offset="45%" stopColor="#225b44" />
              <stop offset="100%" stopColor="#2a6d52" />
            </linearGradient>

            <linearGradient id="panoSeaGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0369a1" />
              <stop offset="60%" stopColor="#0284c7" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>

            <filter id="panoDropShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="3" dy="6" stdDeviation="8" floodColor="rgba(0,0,0,0.4)" />
            </filter>

            <filter id="panoGlowPin" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ocean / Biển Đông */}
          <rect x="760" y="0" width="290" height="540" fill="url(#panoSeaGrad)" opacity="0.95" />

          {/* Ocean wave ripples */}
          <g stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" fill="none">
            <path d="M 770,70 Q 840,85 910,70 T 1050,75" />
            <path d="M 780,160 Q 850,175 930,160 T 1050,170" />
            <path d="M 790,250 Q 870,265 950,250 T 1050,260" />
            <path d="M 800,360 Q 880,375 960,355 T 1050,370" />
            <path d="M 810,470 Q 890,485 970,470 T 1050,480" />
          </g>

          <text x="910" y="505" fill="rgba(255,255,255,0.35)" fontSize="18" fontWeight="900" letterSpacing="0.25em">
            BIỂN ĐÔNG
          </text>

          {/* Mainland Topography */}
          <g filter="url(#panoDropShadow)">
            {/* Western Mountain Range (Hướng Hóa & Đakrông) */}
            <path
              d="M 130,60
                 C 190,40 260,70 320,90
                 C 370,110 410,140 430,200
                 C 450,270 440,360 430,440
                 C 380,480 270,490 200,460
                 C 140,430 110,390 90,320
                 C 70,240 90,120 130,60 Z"
              fill="url(#panoWestGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />

            {/* Central Plains & Coastline (Cam Lộ, Đông Hà, Triệu Phong, Hải Lăng, Vĩnh Linh) */}
            <path
              d="M 320,90
                 C 450,50 620,40 760,70
                 C 780,100 770,170 780,240
                 C 795,300 780,370 770,440
                 C 750,500 720,530 670,525
                 C 590,520 470,490 430,440
                 C 440,360 450,270 430,200
                 C 410,140 370,110 320,90 Z"
              fill="url(#panoPlainGrad)"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth="1.5"
            />
          </g>

          {/* Elevation Contours */}
          <g fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1">
            <ellipse cx="180" cy="130" rx="42" ry="26" strokeDasharray="3 3" />
            <text x="145" y="112" fill="rgba(255,255,255,0.35)" fontSize="9" fontWeight="700">
              ĐỈNH SA MÙ 1.617M
            </text>

            <ellipse cx="270" cy="360" rx="50" ry="30" strokeDasharray="4 2" />
            <text x="235" y="410" fill="rgba(255,255,255,0.35)" fontSize="9" fontWeight="700">
              CAO NGUYÊN KHE SANH
            </text>
          </g>

          {/* Rivers */}
          <g fill="none" strokeLinecap="round">
            {/* Sông Bến Hải (Vĩ tuyến 17) */}
            <path
              d="M 450,140 Q 560,125 650,135 T 765,130"
              stroke="#67e8f9"
              strokeWidth="3.5"
              opacity="0.9"
            />
            <text x="510" y="120" fill="#a5f3fc" fontSize="10.5" fontWeight="800" letterSpacing="0.06em">
              SÔNG BẾN HẢI · VĨ TUYẾN 17 LỊCH SỬ
            </text>

            {/* Sông Thạch Hãn */}
            <path
              d="M 480,440 Q 590,410 700,380 T 775,290"
              stroke="#38bdf8"
              strokeWidth="3"
              opacity="0.85"
            />
            <text x="575" y="435" fill="#bae6fd" fontSize="9.5" fontWeight="700">
              Sông Thạch Hãn
            </text>
          </g>

          {/* HIGHWAY ROAD CORRIDORS (Cung đường) */}
          <g fill="none" strokeLinecap="round" strokeLinejoin="round">
            {/* QL 1A */}
            <path
              d="M 620,55 L 650,135 L 675,220 L 690,300 L 700,380 L 715,455 L 725,520"
              stroke={selectedRouteId === 'all' || selectedRouteId === 'dmz' ? '#fbbf24' : '#475569'}
              strokeWidth={selectedRouteId === 'dmz' ? '5' : '3'}
              strokeDasharray={selectedRouteId === 'dmz' ? 'none' : '5 3'}
            />

            {/* QL 9 */}
            <path
              d="M 780,270 L 690,300 L 540,310 L 430,375 L 270,360 L 140,380"
              stroke={selectedRouteId === 'all' || selectedRouteId === 'ql9' ? '#f97316' : '#475569'}
              strokeWidth={selectedRouteId === 'ql9' ? '5' : '3'}
            />

            {/* HCM Tây */}
            <path
              d="M 160,65 L 180,130 L 215,200 L 240,275 L 270,360 L 430,375"
              stroke={selectedRouteId === 'all' || selectedRouteId === 'hcm-tay' ? '#34d399' : '#475569'}
              strokeWidth={selectedRouteId === 'hcm-tay' ? '5' : '3'}
              strokeDasharray="4 3"
            />

            {/* Nautical Route: Cửa Việt -> Cồn Cỏ */}
            <path
              d="M 780,270 Q 835,185 910,105"
              stroke={selectedRouteId === 'all' || selectedRouteId === 'con-co' ? '#38bdf8' : '#475569'}
              strokeWidth={selectedRouteId === 'con-co' ? '4' : '2.5'}
              strokeDasharray="6 4"
            />
            <text x="835" y="210" fill="#bae6fd" fontSize="10" fontWeight="800">
              🚢 15 HẢI LÝ TÀU BIỂN
            </text>
          </g>

          {/* Đảo Cồn Cỏ Island Graphic */}
          <g
            onClick={() => handleSelectPlace('dao-con-co')}
            style={{ cursor: 'pointer' }}
          >
            <ellipse
              cx="910"
              cy="105"
              rx="36"
              ry="24"
              fill="#065f46"
              stroke="#34d399"
              strokeWidth="2"
              filter="url(#panoDropShadow)"
            />
            <ellipse cx="910" cy="105" rx="22" ry="14" fill="#047857" />
            <text x="868" y="145" fill="#ffffff" fontSize="12" fontWeight="800">
              🏝️ ĐẢO CỒN CỎ
            </text>
          </g>

          {/* PINNED WAYPOINT FLAGS ON MAP */}
          {places.map((place) => {
            const coord = MAP_COORDINATES[place.id];
            if (!coord) return null;

            const isSelected = selectedId === place.id;
            const isHovered = hoveredId === place.id;
            const belongsToActiveRoute = activeRoute.places.includes(place.id);

            return (
              <g
                key={place.id}
                transform={`translate(${coord.x}, ${coord.y})`}
                onClick={() => handleSelectPlace(place.id)}
                onMouseEnter={() => setHoveredId(place.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                opacity={belongsToActiveRoute ? 1 : 0.25}
              >
                {/* Radar pulse ring */}
                {(isSelected || isHovered) && (
                  <circle
                    r="24"
                    fill={coord.flagColor}
                    opacity="0.35"
                    className="radar-ping-anim"
                  />
                )}

                {/* Marker Base Dot */}
                <circle
                  r="7"
                  fill="#ffffff"
                  stroke={isSelected ? '#fbbf24' : coord.flagColor}
                  strokeWidth={isSelected ? '3' : '2'}
                />
                <circle r="3.5" fill={coord.flagColor} />

                {/* Flag Pole */}
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-26"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                />

                {/* Flag Banner */}
                <g transform="translate(0, -26)" filter={isSelected ? 'url(#panoGlowPin)' : undefined}>
                  <path
                    d="M 0,0 L 26,-4 L 20,-11 L 26,-18 L 0,-14 Z"
                    fill={isSelected ? '#fbbf24' : coord.flagColor}
                    stroke="#ffffff"
                    strokeWidth="1.2"
                  />
                  <text
                    x="4"
                    y="-7"
                    fill={isSelected ? '#133e2f' : '#ffffff'}
                    fontSize="7.5"
                    fontWeight="900"
                  >
                    {place.zoneCode}
                  </text>
                </g>

                {/* Place Name Tag */}
                <rect
                  x="-45"
                  y="10"
                  width="90"
                  height="18"
                  rx="4"
                  fill={isSelected ? '#133e2f' : 'rgba(15, 23, 42, 0.85)'}
                  stroke={isSelected ? '#fbbf24' : 'rgba(255,255,255,0.2)'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="22"
                  textAnchor="middle"
                  fill={isSelected ? '#fef08a' : '#ffffff'}
                  fontSize="8.5"
                  fontWeight="700"
                >
                  {place.name.length > 13 ? place.name.substring(0, 12) + '…' : place.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Quick Inspector Card (Top Right of Map) */}
        {focusedPlace && (
          <div className="floating-map-inspector">
            <div className="inspector-mini-thumb">
              <img
                src={focusedPlace.image || focusedPlace.hero_image || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=400&q=80'}
                alt={focusedPlace.name}
              />
              <span className="inspector-mini-zone">{focusedPlace.zoneCode}</span>
            </div>

            <div className="inspector-mini-content">
              <div className="inspector-mini-header">
                <span className="inspector-mini-cat">{focusedPlace.categoryName || 'Di tích & Danh thắng'}</span>
                <span className="inspector-mini-rating">★ {focusedPlace.rating || 4.9}</span>
              </div>
              <h4 className="inspector-mini-title">{focusedPlace.name}</h4>
              <div className="inspector-mini-meta">
                <span>📍 {focusedPlace.zoneName}</span>
                <span>🎟️ {focusedPlace.ticket || 'Miễn phí'}</span>
              </div>

              <div className="inspector-mini-actions">
                <button
                  onClick={() => handleCopyGps(focusedPlace.coordinates)}
                  className="mini-gps-btn"
                  title="Sao chép tọa độ GPS"
                >
                  {copiedGps ? '✓ Đã chép GPS' : '📍 ' + (focusedPlace.coordinates || '16.75° N, 107.19° E')}
                </button>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((focusedPlace.name || '') + ' Quảng Trị')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mini-gmap-btn"
                >
                  Chỉ đường ↗
                </a>

                <button
                  onClick={() => handleOpenDetailModal(focusedPlace)}
                  className="mini-detail-btn"
                >
                  Xem chi tiết
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Map Legend */}
        <div className="stage-map-legend">
          <div className="legend-tag"><span className="legend-bar ql1a" /> QL 1A Di Sản</div>
          <div className="legend-tag"><span className="legend-bar ql9" /> QL 9 Khe Sanh</div>
          <div className="legend-tag"><span className="legend-bar hcm" /> HCM Tây Săn Mây</div>
          <div className="legend-tag"><span className="legend-bar sea" /> Hải Trình Cồn Cỏ</div>
        </div>
      </div>

      {/* 3. HORIZONTAL STOPS CAROUSEL BELOW THE MAP ("Các địa điểm ở dưới theo hàng ngang") */}
      <div className="stops-horizontal-section">
        <div className="stops-section-header">
          <div>
            <span className="stops-route-kicker">
              {activeRoute.icon} DANH SÁCH ĐIỂM DỪNG CHÂN THEO HÀNG NGANG
            </span>
            <h3 className="stops-section-title">
              {activeRoute.title} ({routePlaces.length} tọa độ)
            </h3>
          </div>

          {/* Carousel Left/Right navigation controls */}
          <div className="carousel-nav-controls">
            <button
              onClick={() => handleScrollCarousel('left')}
              className="carousel-arrow-btn"
              title="Cuộn sang trái"
            >
              ←
            </button>
            <button
              onClick={() => handleScrollCarousel('right')}
              className="carousel-arrow-btn"
              title="Cuộn sang phải"
            >
              →
            </button>
          </div>
        </div>

        {/* The Horizontal Scroll Track */}
        <div
          ref={horizontalScrollRef}
          className="horizontal-stops-scroll-track"
        >
          {routePlaces.map((place, idx) => {
            const isSelected = selectedId === place.id;

            return (
              <div
                key={place.id}
                id={`hcard-${place.id}`}
                onClick={() => handleSelectPlace(place.id)}
                className={`horizontal-stop-card ${isSelected ? 'active-stop' : ''}`}
              >
                {/* Image Banner */}
                <div className="hstop-media-wrap">
                  <img
                    src={place.image || place.hero_image || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500&q=80'}
                    alt={place.name}
                    loading="lazy"
                  />
                  <span className="hstop-step-badge">
                    Trạm {idx + 1}
                  </span>
                  <span className="hstop-zone-badge">
                    {place.zoneCode}
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (onToggleBookmark) onToggleBookmark(place.id, e);
                    }}
                    className={`hstop-bookmark-btn ${bookmarkedIds.includes(place.id) ? 'bookmarked' : ''}`}
                    title="Lưu vào Sổ tay"
                  >
                    ★
                  </button>
                </div>

                {/* Content */}
                <div className="hstop-body">
                  <div className="hstop-meta-line">
                    <span className="hstop-cat">{place.categoryName || 'Di tích & Thắng cảnh'}</span>
                    <span className="hstop-rating">★ {place.rating || 4.9}</span>
                  </div>

                  <h4 className="hstop-title">{place.name}</h4>
                  <p className="hstop-desc">{place.shortDesc}</p>

                  <div className="hstop-footer">
                    <div className="hstop-info-chips">
                      <span className="hstop-coord-tag">📍 {place.zoneName}</span>
                      <span className="hstop-ticket-tag">{place.ticket || 'Miễn phí'}</span>
                    </div>

                    <div className="hstop-action-row">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectPlace(place.id);
                        }}
                        className="hstop-focus-map-btn"
                      >
                        {isSelected ? '✓ Đang xem trên Map' : 'Xem trên Map ↗'}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDetailModal(place);
                        }}
                        className="hstop-detail-link"
                      >
                        Chi tiết →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Internal Modal Fallback */}
      {internalModalPlace && (
        <div className="modal-overlay active" onClick={() => setInternalModalPlace(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setInternalModalPlace(null)}>×</button>
            <div className="modal-header-visual">
              <img
                src={internalModalPlace.image || internalModalPlace.hero_image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'}
                alt={internalModalPlace.name}
              />
              <div className="modal-title-overlay">
                <span className="modal-zone-badge">{internalModalPlace.zoneCode} · {internalModalPlace.zoneName}</span>
                <h2>{internalModalPlace.name}</h2>
              </div>
            </div>
            <div className="modal-content-body">
              <p className="modal-desc">{internalModalPlace.fullDesc || internalModalPlace.shortDesc}</p>
              {Array.isArray(internalModalPlace.highlights) && internalModalPlace.highlights.length > 0 && (
                <div className="modal-highlights-box">
                  <h4>Điểm nhấn nổi bật:</h4>
                  <ul>
                    {internalModalPlace.highlights.map((hl: string, idx: number) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="modal-meta-grid">
                <div><strong>📍 Địa chỉ:</strong> {internalModalPlace.address}</div>
                <div><strong>🕒 Giờ mở cửa:</strong> {internalModalPlace.openHours || '07:00 - 17:30'}</div>
                <div><strong>🎟️ Giá vé:</strong> {internalModalPlace.ticket || 'Miễn phí'}</div>
                <div><strong>🧭 Tọa độ:</strong> {internalModalPlace.coordinates}</div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((internalModalPlace.name || '') + ' Quảng Trị')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-map-link-btn"
                >
                  Mở Google Maps chỉ đường ↗
                </a>
                <Link
                  href={`/diem-den/${internalModalPlace.id}`}
                  className="modal-map-link-btn"
                  style={{ backgroundColor: '#fff', color: '#133e2f', border: '1px solid #133e2f' }}
                >
                  Xem trang chi tiết ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}