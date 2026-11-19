'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import QuangTriInteractiveMap from '@/components/QuangTriInteractiveMap';
import Footer from '@/components/common/Footer';

interface HomeClientProps {
  initialPlaces?: any[];
  initialServices?: any[];
  initialThreads?: any[];
  zones?: any[];
  foods?: any[];
  food?: any[];
  itineraries?: any[];
  guides?: any;
  checklist?: any[];
  utilities?: any;
  bannerSlides?: any[];
  weatherData?: any;
  weatherLocations?: any;
}

const ZONE_METAS: Record<string, { specialty: string; typeTag: string; typeGroup: 'history' | 'mountain' | 'coastal' }> = {
  'QT-01': {
    specialty: 'Bánh bột lọc & Cháo bột cá lóc',
    typeTag: '🏛️ Đô thị & Cửa ngõ',
    typeGroup: 'history',
  },
  'QT-02': {
    specialty: 'Cháo vạt giường Diên Sanh & Bánh lọc Mỹ Chánh',
    typeTag: '⚔️ Thành Cổ & Đất thiêng',
    typeGroup: 'history',
  },
  'QT-03': {
    specialty: 'Hải sản biển Cửa Tùng & Tôm cá Bến Hải',
    typeTag: '🕊️ Vĩ tuyến 17 & Làng hầm',
    typeGroup: 'history',
  },
  'QT-04': {
    specialty: 'Bún hến Mai Xá (Di sản ẩm thực Việt Nam)',
    typeTag: '🌊 Biển Cửa Việt & Mũi Trèo',
    typeGroup: 'coastal',
  },
  'QT-05': {
    specialty: 'Cà phê Arabica Khe Sanh & Thịt trâu lá trơng',
    typeTag: '☁️ Săn mây Sa Mù & Núi cao',
    typeGroup: 'mountain',
  },
  'QT-06': {
    specialty: 'Cơm lam, rượu cần & Suối khoáng Klu',
    typeTag: '🌲 Trường Sơn & Bản làng',
    typeGroup: 'mountain',
  },
  'QT-07': {
    specialty: 'Cua đá Cồn Cỏ & Rong biển đảo ngọc',
    typeTag: '🏝️ Đảo tiền tiêu & San hô',
    typeGroup: 'coastal',
  },
  'QT-08': {
    specialty: 'Gà đồi Cùa & Cao chè vằng Định Sơn',
    typeTag: '🌿 Căn cứ Tân Sở & Đồi Cùa',
    typeGroup: 'history',
  },
};

export default function HomeClient({
  initialPlaces = [],
  initialServices = [],
  initialThreads = [],
  zones = [],
  foods = [],
  food = [],
  itineraries = [],
  guides = {},
  checklist = [],
  utilities = {},
  bannerSlides = [],
  weatherData = {},
  weatherLocations,
}: HomeClientProps) {
  // Hero slides setup
  const heroSlides = useMemo(() => {
    if (Array.isArray(bannerSlides) && bannerSlides.length > 0) {
      return bannerSlides.map((b) => ({
        img: b.image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
        caption: b.title || 'Quảng Trị chân thật',
        zone: b.kicker || b.badge || 'Miền Trung Việt Nam',
      }));
    }
    return [
      {
        img: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1920&q=80',
        caption: 'Đại ngàn Trường Sơn & Đèo Sa Mù mây ngàn',
        zone: 'QT-05 · Hướng Hóa',
      },
      {
        img: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1920&q=80',
        caption: 'Đôi Bờ Hiền Lương & Sông Bến Hải lịch sử',
        zone: 'QT-03 · Vĩ Tuyến 17',
      },
      {
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1920&q=80',
        caption: 'Biển Cửa Tùng - Nữ hoàng của các bãi tắm',
        zone: 'QT-03 · Vĩnh Linh',
      },
      {
        img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=1920&q=80',
        caption: 'Đảo Cồn Cỏ - Tiền đồn kiêu hãnh giữa Biển Đông',
        zone: 'QT-07 · Đảo Cồn Cỏ',
      },
    ];
  }, [bannerSlides]);

  // State
  const [currentSlide, setCurrentSlide] = useState(0);
  const [weatherLocKey, setWeatherLocKey] = useState('huong-hoa');
  const [weatherDayIdx, setWeatherDayIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState('all');
  const [zoneTypeFilter, setZoneTypeFilter] = useState<'all' | 'history' | 'mountain' | 'coastal'>('all');
  const [placeCategory, setPlaceCategory] = useState('all');
  const [placesViewMode, setPlacesViewMode] = useState<'map' | 'grid'>('map');
  const [serviceCategory, setServiceCategory] = useState('all');
  const [activePlaceModal, setActivePlaceModal] = useState<any>(null);
  const [isNotebookOpen, setIsNotebookOpen] = useState(false);
  const [notebookTab, setNotebookTab] = useState<'bookmarks' | 'budget' | 'checklist' | 'notes'>('bookmarks');
  const [isPartnerModalOpen, setIsPartnerModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isThreadModalOpen, setIsThreadModalOpen] = useState(false);
  const [adminStats, setAdminStats] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pageViews, setPageViews] = useState<number>(18240);

  // Community Threads state
  const [threads, setThreads] = useState(initialThreads);
  const [threadComments, setThreadComments] = useState<{ [key: string]: any[] }>({});
  const [likedThreadIds, setLikedThreadIds] = useState<{ [key: string]: boolean }>({});

  // Notebook state
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [userNotes, setUserNotes] = useState('');

  // Budget Calculator state
  const [budgetDays, setBudgetDays] = useState(3);
  const [budgetPeople, setBudgetPeople] = useState(2);
  const [budgetVehicle, setBudgetVehicle] = useState('motorbike');
  const [budgetStay, setBudgetStay] = useState('homestay');

  // Lead tracking
  const trackLead = async (serviceId: string, serviceName: string, action: 'call' | 'zalo') => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serviceId, serviceName, action }),
      });
    } catch (e) {
      console.warn('Lead tracking error:', e);
    }
  };

  // Hero slideshow auto advancement
  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [heroSlides.length]);

  // Load bookmarks & notes from localStorage
  useEffect(() => {
    try {
      const savedBm = localStorage.getItem('qt_bookmarks');
      if (savedBm) setBookmarkedIds(JSON.parse(savedBm));

      const savedNotes = localStorage.getItem('qt_notes');
      if (savedNotes) setUserNotes(savedNotes);

      const savedChecklist = localStorage.getItem('qt_checklist');
      if (savedChecklist) setCheckedItems(JSON.parse(savedChecklist));
    } catch (e) {}
  }, []);

  // Track page views on front page & hourly distribution
  useEffect(() => {
    try {
      const stored = localStorage.getItem('qt_page_views');
      const current = stored ? parseInt(stored, 10) : 18240;
      const nextViews = current + 1;
      localStorage.setItem('qt_page_views', nextViews.toString());
      setPageViews(nextViews);

      // Track hourly views distribution
      const hour = new Date().getHours();
      const hourlyStr = localStorage.getItem('qt_hourly_views');
      const hourly = hourlyStr ? JSON.parse(hourlyStr) : {};
      hourly[hour] = (hourly[hour] || 0) + 1;
      localStorage.setItem('qt_hourly_views', JSON.stringify(hourly));
    } catch (e) {}
  }, []);

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarkedIds((prev) => {
      const next = prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id];
      localStorage.setItem('qt_bookmarks', JSON.stringify(next));
      return next;
    });
  };

  // Weather data resolution
  const weatherMap = weatherData || weatherLocations || {};
  const currentWeatherData = weatherMap[weatherLocKey] || weatherMap['huong-hoa'] || Object.values(weatherMap)[0] || {
    name: 'Hướng Hóa (Đèo Sa Mù)',
    current: { condition: 'Mưa phùn & Sương mây', temp: 17, rainChance: '47%', humidity: '96%', wind: '4 km/h' },
    tipRain: 'Trời có thể mưa phùn, nhớ mang áo ấm và áo mưa nhé!',
    forecast: [
      { day: 'Hôm nay', date: '19.11', icon: 'rain', high: 17, low: 11, rain: '80%' },
      { day: 'Thứ 6', date: '20.11', icon: 'rain', high: 14, low: 10, rain: '100%' },
    ],
  };

  const forecastList = Array.isArray(currentWeatherData.forecast) ? currentWeatherData.forecast : [];
  const currentDayForecast = forecastList[weatherDayIdx] || forecastList[0] || { high: 17, low: 11, rain: '80%', icon: 'rain' };

  // Food list resolution (supports both `foods` and `food`)
  const foodList = useMemo(() => {
    if (Array.isArray(foods) && foods.length > 0) return foods;
    if (Array.isArray(food) && food.length > 0) return food;
    return [];
  }, [foods, food]);

  // Zones filtering by thematic category
  const filteredZones = useMemo(() => {
    if (zoneTypeFilter === 'all') return zones;
    return zones.filter((z) => {
      const meta = ZONE_METAS[z.code];
      return meta && meta.typeGroup === zoneTypeFilter;
    });
  }, [zones, zoneTypeFilter]);

  // Places filtering with smart outdoor explorer categories
  const filteredPlaces = useMemo(() => {
    return initialPlaces.filter((p) => {
      let matchCat = placeCategory === 'all';
      if (!matchCat) {
        if (placeCategory === 'history') {
          matchCat = p.category === 'history' || p.categoryName?.includes('lịch sử');
        } else if (placeCategory === 'cloud') {
          matchCat = p.category === 'adventure' || p.category === 'checkin' || p.id?.includes('sa-mu') || p.id?.includes('gio') || p.id?.includes('ta-con') || p.name?.includes('Sa Mù') || p.name?.includes('Gió') || p.name?.includes('Tà Cơn');
        } else if (placeCategory === 'beach') {
          matchCat = p.category === 'beach' || p.id?.includes('cua-viet') || p.id?.includes('cua-tung') || p.id === 'mui-treo' || p.name?.includes('Biển') || p.name?.includes('Mũi Trèo');
        } else if (placeCategory === 'island') {
          matchCat = p.category === 'island' || p.id?.includes('con-co') || p.name?.includes('Cồn Cỏ');
        } else if (placeCategory === 'waterfall') {
          matchCat = p.category === 'nature' || p.id?.includes('thac') || p.id?.includes('suoi') || p.id?.includes('dakrong') || p.name?.includes('Thác') || p.name?.includes('Suối') || p.name?.includes('Đakrông');
        } else {
          matchCat = p.category === placeCategory;
        }
      }

      const matchZone = selectedZone === 'all' || p.zoneCode === selectedZone || p.zone_code === selectedZone;
      const matchSearch =
        !searchQuery ||
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDesc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zoneName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.zoneCode?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchZone && matchSearch;
    });
  }, [initialPlaces, placeCategory, selectedZone, searchQuery]);

  // Services filtering
  const filteredServices = useMemo(() => {
    return initialServices.filter((s) => {
      if (serviceCategory === 'all') return true;
      return s.category === serviceCategory || s.type === serviceCategory;
    });
  }, [initialServices, serviceCategory]);

  // Budget calculation
  const calculatedBudget = useMemo(() => {
    const fuelPerDay = budgetVehicle === 'motorbike' ? 70000 : 350000;
    const rentalPerDay = budgetVehicle === 'motorbike' ? 120000 : 600000;
    const stayPerNight = budgetStay === 'homestay' ? 350000 : budgetStay === 'hotel' ? 600000 : 800000;
    const foodPerPersonPerDay = 200000;
    const ticketPerPerson = 150000;

    const totalTrans = (fuelPerDay + rentalPerDay) * budgetDays;
    const totalStay = stayPerNight * Math.max(1, budgetDays - 1) * Math.ceil(budgetPeople / 2);
    const totalFood = foodPerPersonPerDay * budgetPeople * budgetDays;
    const totalTickets = ticketPerPerson * budgetPeople;
    const total = totalTrans + totalStay + totalFood + totalTickets;

    return {
      total,
      perPerson: Math.round(total / Math.max(1, budgetPeople)),
    };
  }, [budgetDays, budgetPeople, budgetVehicle, budgetStay]);

  // Checklist items resolution
  const checklistItems = useMemo(() => {
    if (Array.isArray(guides?.packingChecklist) && guides.packingChecklist.length > 0) {
      return guides.packingChecklist;
    }
    if (Array.isArray(checklist) && checklist.length > 0) {
      return checklist;
    }
    return [
      'Giấy tờ tùy thân: CCCD/Hộ chiếu (bắt buộc khi đi tàu ra đảo Cồn Cỏ)',
      'Áo khoác gió & áo ấm khi lên đèo Sa Mù (nhiệt độ chênh 5-8°C)',
      'Thuốc men: Thuốc chống muỗi/vắt, thuốc say tàu xe khi đi biển',
      'Kính râm, kem chống nắng, mũ nón chống gió Lào',
      'Bộ dụng cụ sửa xe mini & bơm lốp khi phượt đường Tây Trường Sơn vắng',
    ];
  }, [guides, checklist]);

  // Gas stations & Emergency hotlines
  const gasStationsList = useMemo(() => {
    return guides?.gasStations || utilities?.gasStations || [];
  }, [guides, utilities]);

  const emergencyHotlinesList = useMemo(() => {
    return guides?.emergencyHotlines || utilities?.emergencyContacts || [];
  }, [guides, utilities]);

  // Fetch admin stats
  const openAdminModal = async () => {
    setIsAdminModalOpen(true);
    try {
      const res = await fetch('/api/admin/metrics');
      const data = await res.json();
      if (data && data.metrics) {
        setAdminStats(data.metrics);
      }
    } catch (e) {
      setAdminStats({
        totalLeads: 2,
        totalPartners: initialServices.length,
        totalRegistrations: 1,
        totalThreads: threads.length,
        estimatedRevenue: '650.000 VNĐ',
      });
    }
  };

  return (
    <div className="hagiang-theme" data-theme="light">
      {/* Site Header matching Hagiang.wiki */}
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" title="Quangtri Wiki · Đôi bờ Hiền Lương & Cánh chim hòa bình">
            <div className="brand-logo-icon">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 13C16 7.8 20.8 4.2 25.8 4.2C23.2 8.4 19.6 10.5 16 13Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <path d="M16 13C16 7.8 11.2 4.2 6.2 4.2C8.8 8.4 12.4 10.5 16 13Z" fill="currentColor" fillOpacity="0.18" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                <circle cx="16" cy="6.2" r="1.3" fill="currentColor"/>
                <path d="M4 22C9.5 15.2 22.5 15.2 28 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <path d="M3 22.5H29" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                <line x1="9.5" y1="22" x2="9.5" y2="18.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <line x1="16" y1="22" x2="16" y2="16.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <line x1="22.5" y1="22" x2="22.5" y2="18.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M6 26.5C10 24.8 14 27.5 18 25.8C22 24.2 25 26.8 28 26" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="brand-title">Quangtri Wiki</div>
              <span className="brand-subtitle">ĐI CHẬM · KHÁM PHÁ</span>
            </div>
          </Link>

          <nav className="main-nav">
            <Link href="/cung-duong" className="nav-link">Khám phá cung đường</Link>
            <Link href="/am-thuc" className="nav-link">Ăn uống</Link>
            <Link href="/dich-vu" className="nav-link">Lưu trú & Dịch vụ</Link>
            <Link href="/lich-trinh" className="nav-link">Hành trình</Link>
            <Link href="/dien-dan" className="nav-link">Diễn đàn</Link>
            <Link href="/tien-ich" className="nav-link">Cây xăng & Trạm sạc</Link>
            <Link href="/chi-phi" className="nav-link">Chi Phí</Link>
            <Link href="/so-tay" className="nav-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              Sổ tay của tôi
              {bookmarkedIds.length > 0 && (
                <span style={{ background: '#133e2f', color: '#fff', borderRadius: '10px', padding: '1px 6px', fontSize: '0.72rem' }}>
                  {bookmarkedIds.length}
                </span>
              )}
            </Link>
          </nav>

          <div className="header-actions">
            <div className="lang-selector">
              <span className="lang-flag">🇻🇳</span>
              <span className="lang-code">VN</span>
            </div>

            <Link href="/dich-vu" className="header-contact-btn">
              <span>Kết nối với chúng tôi</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
            </Link>

            <Link href="/so-tay" className="notebook-trigger-btn" title="Mở Sổ tay phượt">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
              {bookmarkedIds.length > 0 && (
                <span className="badge-counter">{bookmarkedIds.length}</span>
              )}
            </Link>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="mobile-menu-btn" title="Menu">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            </button>
          </div>
        </div>

        <div className="sub-header-strip">
          <span>Lên lịch trình · Trải nghiệm · Lưu nhật ký</span>
        </div>

        {mobileMenuOpen && (
          <div style={{ display: 'flex', flexDirection: 'column', padding: '1rem 1.25rem', background: '#fff', borderBottom: '1px solid #e5e7eb', gap: '0.6rem' }}>
            <Link href="/cung-duong" onClick={() => setMobileMenuOpen(false)} className="nav-link">🗺️ Khám phá cung đường (QT-01 - QT-08)</Link>
            <Link href="/am-thuc" onClick={() => setMobileMenuOpen(false)} className="nav-link">🍜 Ăn uống & Đặc sản</Link>
            <Link href="/dich-vu" onClick={() => setMobileMenuOpen(false)} className="nav-link">🏨 Lưu trú, Homestay & Dịch vụ</Link>
            <Link href="/lich-trinh" onClick={() => setMobileMenuOpen(false)} className="nav-link">🧭 Hành trình mẫu</Link>
            <Link href="/dien-dan" onClick={() => setMobileMenuOpen(false)} className="nav-link">💬 Diễn đàn & Kinh nghiệm</Link>
            <Link href="/tien-ich" onClick={() => setMobileMenuOpen(false)} className="nav-link">⛽ Cây xăng & Trạm sạc</Link>
            <Link href="/chi-phi" onClick={() => setMobileMenuOpen(false)} className="nav-link">💰 Chi Phí dự toán</Link>
            <Link href="/so-tay" onClick={() => setMobileMenuOpen(false)} className="nav-link">🎒 Sổ tay của tôi</Link>
          </div>
        )}
      </header>

      {/* Hero Panoramic Banner (Style Hagiang.wiki) */}
      <section className="hagiang-hero-section">
        <div className="hagiang-hero-bg-track">
          {heroSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`hagiang-hero-bg-slide ${idx === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${slide.img})` }}
            />
          ))}
        </div>
        <div className="hagiang-hero-mist-overlay" />

        <div className="container hagiang-hero-content">
          <div className="hagiang-hero-left">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
              <div className="hagiang-kicker" style={{ margin: 0 }}>MIỀN TRUNG VIỆT NAM · GÓC NHÌN ĐỊA PHƯƠNG</div>
              <span style={{
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
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                {pageViews.toLocaleString()} lượt xem
              </span>
            </div>
            <h1 className="hagiang-main-title">
              Gần hơn với Quảng<br />
              Trị chân thật.
            </h1>
            <p className="hagiang-main-subtitle">
              Đèo núi. Miền đất thiêng yên bình. Hành trình đáng để đi chậm.
            </p>

            <div className="hagiang-search-box">
              <svg className="hagiang-search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="hagiang-search-input"
                placeholder="Tìm Thành Cổ, Đèo Sa Mù, Cồn Cỏ, món ngon... (Ctrl + K)"
              />
              <kbd className="hagiang-search-shortcut">⌘K</kbd>
            </div>

            <div className="hagiang-stats-row">
              <div className="hagiang-stat-chip">
                <span className="stat-chip-num">{initialPlaces.length}</span>
                <span className="stat-chip-label">Điểm đến</span>
              </div>
              <div className="hagiang-stat-chip">
                <span className="stat-chip-num">{zones.length}</span>
                <span className="stat-chip-label">Vùng cung đường</span>
              </div>
              <div className="hagiang-stat-chip">
                <span className="stat-chip-num">{foodList.length}</span>
                <span className="stat-chip-label">Món ngon</span>
              </div>
              <div className="hagiang-stat-chip">
                <span className="stat-chip-num">{itineraries.length}</span>
                <span className="stat-chip-label">Tuyến phượt</span>
              </div>
              <div className="hagiang-stat-chip" style={{ border: '1px solid rgba(52, 211, 153, 0.4)', background: 'rgba(52, 211, 153, 0.12)' }}>
                <span className="stat-chip-num" style={{ color: '#34d399' }}>{pageViews.toLocaleString()}</span>
                <span className="stat-chip-label">Lượt xem</span>
              </div>
            </div>
          </div>

          {/* Interactive Weather Card ("Thời tiết sắp tới" - Exact Frosted Glass Styling) */}
          <div className="hagiang-hero-right">
            <div className="weather-card-glass" id="weather-card-widget">
              <div className="weather-card-header">
                <div>
                  <span className="weather-region-tag">{currentWeatherData.region || 'VÙNG CAO QUẢNG TRỊ'}</span>
                  <h3 className="weather-card-title">Thời tiết sắp tới</h3>
                  <p className="weather-card-meta">7 ngày · °C · Giờ Việt Nam<br />Bản tin chung · Cập nhật mỗi giờ</p>
                </div>
                <select
                  value={weatherLocKey}
                  onChange={(e) => { setWeatherLocKey(e.target.value); setWeatherDayIdx(0); }}
                  className="weather-district-dropdown"
                >
                  {Object.keys(weatherMap).map((k) => (
                    <option key={k} value={k}>{weatherMap[k]?.name || k}</option>
                  ))}
                </select>
              </div>

              <div className="weather-days-row">
                {forecastList.map((fc: any, idx: number) => (
                  <div
                    key={idx}
                    onClick={() => setWeatherDayIdx(idx)}
                    className={`weather-day-card ${idx === weatherDayIdx ? 'active' : ''}`}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="weather-day-name">{fc.day || `Ngày ${idx + 1}`}</div>
                    <div className="weather-day-date">{fc.date || ''}</div>
                    <div className="weather-day-icon">{fc.icon === 'cloud-rain' || fc.icon === 'rain' ? '🌧️' : fc.icon === 'sun' ? '☀️' : '⛅'}</div>
                    <div className="weather-day-temp-high">{fc.tempHigh || (fc.high !== undefined ? `${fc.high}°` : '17°')}</div>
                    <div className="weather-day-temp-low">{fc.tempLow || (fc.low !== undefined ? `${fc.low}°` : '10°')}</div>
                    <div className="weather-day-rain">{fc.rainProb || fc.rain || '30%'}</div>
                  </div>
                ))}
              </div>

              <div className="weather-detail-box">
                <div className="weather-detail-time">Dự báo theo giờ · 07:00 · {currentWeatherData.name}</div>
                <div className="weather-detail-condition">
                  <span className="weather-detail-icon">🌧️</span>
                  <strong>{currentWeatherData.current?.condition || currentDayForecast.condition || 'Mưa phùn & Sương mây'}</strong>
                </div>

                <div className="weather-detail-metrics">
                  <div className="metric-col">
                    <div className="metric-label">Mưa</div>
                    <div className="metric-value">{currentWeatherData.current?.rainChance || currentDayForecast.rain || '47%'}</div>
                    <div className="metric-sub">{currentWeatherData.current?.rainNote || 'Có thể có mưa'}</div>
                  </div>
                  <div className="metric-col">
                    <div className="metric-label">Độ ẩm</div>
                    <div className="metric-value">{currentWeatherData.current?.humidity || '96%'}</div>
                    <div className="metric-sub">{currentWeatherData.current?.humidityNote || 'Độ ẩm cao'}</div>
                  </div>
                  <div className="metric-col">
                    <div className="metric-label">Gió</div>
                    <div className="metric-value">{currentWeatherData.current?.wind || '4 km/h'}</div>
                    <div className="metric-sub">{currentWeatherData.current?.windNote || 'Gió nhẹ'}</div>
                  </div>
                </div>
              </div>

              <div className="weather-advisories">
                <div className="advisory-item">
                  <span>🌧️</span>
                  <span>{currentWeatherData.tipRain || 'Trời có thể mưa, nhớ mang áo mưa nhé!'}</span>
                </div>
                <div className="advisory-item">
                  <span>☕</span>
                  <span>{currentWeatherData.tipSleep || 'Lạnh quá, ghé Khe Sanh nhâm nhi ly cà phê cho ấm!'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hero Slider Dots */}
        <div className="hagiang-capsule-dots">
          {heroSlides.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`hagiang-dot ${idx === currentSlide ? 'active' : ''}`}
            />
          ))}
        </div>
      </section>

      {/* Ribbon Bar */}
      <div className="hagiang-bottom-bar">
        <div className="container hagiang-bottom-bar-inner">
          <div className="bottom-bar-text">
            Bắt đầu từ toàn cảnh. Chọn nơi muốn đến.
          </div>
          <a href="#vung-du-lich" className="bottom-bar-select-btn">
            <span>Chọn vùng (QT-01 → QT-08)</span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="6 9 12 15 18 9"/></svg>
          </a>
        </div>
      </div>

      {/* 8 Phân Vùng Lộ Trình (QT-01 -> QT-08) - Redesigned for Tourism & Local Specialty Showcase */}
      <section className="zones-section" id="vung-du-lich">
        <div className="container">
          <div className="zones-header-wrap">
            <div className="zones-badge-kicker">
              <span>🗺️</span>
              <span>HỆ THỐNG MÃ CUNG ĐƯỜNG QT-01 → QT-08</span>
            </div>
            <h2 className="zones-main-title">8 Vùng Di Sản, Danh Thắng & Đặc Sản Bản Địa</h2>
            <p className="zones-lead-desc">
              Quảng Trị được chia tách theo 8 mạch không gian trải nghiệm độc đáo — kết nối di tích lịch sử linh thiêng, bãi biển cát trắng, đại ngàn Trường Sơn săn mây và những đặc sản trứ danh của từng địa phương.
            </p>
          </div>

          {/* Filter tabs */}
          <div className="zone-filter-tabs">
            {[
              { id: 'all', label: 'Tất cả 8 vùng', count: zones.length },
              { id: 'history', label: '🏛️ Di tích lịch sử & Tâm linh', count: 4 },
              { id: 'mountain', label: '🏔️ Núi cao & Săn mây Sa Mù', count: 2 },
              { id: 'coastal', label: '🏖️ Biển đảo & Sinh thái', count: 2 },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setZoneTypeFilter(tab.id as any)}
                className={`zone-tab-btn ${zoneTypeFilter === tab.id ? 'active' : ''}`}
              >
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.75rem',
                  opacity: zoneTypeFilter === tab.id ? 1 : 0.7,
                  background: zoneTypeFilter === tab.id ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                  padding: '1px 6px',
                  borderRadius: '10px'
                }}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* 8 Zones Grid */}
          <div className="zone-grid">
            {filteredZones.map((z: any) => {
              const meta = ZONE_METAS[z.code] || {
                specialty: 'Ẩm thực & Đặc sản bản địa',
                typeTag: 'Điểm đến tiêu biểu',
                typeGroup: 'history',
              };
              const isSelected = selectedZone === z.code;

              return (
                <div
                  key={z.code}
                  onClick={() => {
                    if (selectedZone === z.code) {
                      setSelectedZone('all');
                    } else {
                      setSelectedZone(z.code);
                      const el = document.getElementById('cung-duong');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className={`zone-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="zone-card-media">
                    <img
                      src={z.heroImage || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'}
                      alt={z.name}
                      loading="lazy"
                    />
                    <div className="zone-media-gradient" />
                    <span className="zone-code-badge">{z.code}</span>
                    <span className="zone-type-badge">{meta.typeTag}</span>
                    <span className="zone-count-badge">📍 {z.featuredCount}</span>
                  </div>

                  <div className="zone-card-body">
                    <h3 className="zone-card-title">{z.name}</h3>
                    <div className="zone-card-tagline">{z.tagline}</div>

                    {/* Local Specialty Feature Box */}
                    <div className="zone-specialty-box">
                      <span style={{ fontSize: '1rem', flexShrink: 0 }}>🍲</span>
                      <div>
                        <span>Đặc sản: </span>
                        <strong>{meta.specialty}</strong>
                      </div>
                    </div>

                    <p className="zone-card-desc">{z.description}</p>

                    <div className="zone-card-footer">
                      {isSelected ? (
                        <span className="zone-selected-indicator">
                          <span>✓</span>
                          <span>Đang chọn lọc điểm đến</span>
                        </span>
                      ) : (
                        <span className="zone-action-text">
                          <span>Xem điểm đến & đặc sản</span>
                          <span style={{ fontSize: '1.05rem' }}>→</span>
                        </span>
                      )}
                      <Link
                        href="/cung-duong"
                        onClick={(e) => e.stopPropagation()}
                        style={{ fontSize: '0.78rem', color: '#6b7280', textDecoration: 'none' }}
                        title="Xem trang chi tiết cung đường"
                      >
                        Chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {selectedZone !== 'all' && (
            <div style={{
              marginTop: '1.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              padding: '0.8rem 1.4rem',
              borderRadius: '10px',
              fontSize: '0.92rem',
              color: '#166534',
            }}>
              <div>
                Đang lọc các điểm đến thuộc <strong>{zones.find((z) => z.code === selectedZone)?.name || selectedZone}</strong> ({filteredPlaces.length} địa danh)
              </div>
              <button
                onClick={() => setSelectedZone('all')}
                style={{
                  background: '#133e2f',
                  color: '#fff',
                  border: 'none',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                ✕ Xóa bộ lọc vùng
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 24 Điểm Đến & Bộ Lọc */}
      <section className="places-section" id="cung-duong">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">TỌA ĐỘ DU LỊCH & LỊCH SỬ</span>
            <h2 className="title-serif">Khám Phá Điểm Đến</h2>
            <p className="desc-text">Được xác minh kỹ lưỡng với đầy đủ tọa độ GPS, giá vé, giờ mở cửa và lời khuyên phượt thủ.</p>
          </div>

          {/* Phượt Explorer Waypoints Bar */}
          <div className="phuot-filter-wrapper">
            <div className="phuot-filter-track">
              {[
                {
                  id: 'all',
                  icon: '🧭',
                  code: 'TỌA ĐỘ TOÀN CẢNH',
                  label: 'Tất cả tọa độ',
                  badge: '24 ĐIỂM',
                  desc: 'Bao quát toàn tỉnh lộ',
                },
                {
                  id: 'history',
                  icon: '🏛️',
                  code: 'VĨ TUYẾN 17 & DMZ',
                  label: 'Di tích lịch sử',
                  badge: 'HÀO HÙNG',
                  desc: 'Thành Cổ · Vịnh Mốc',
                },
                {
                  id: 'cloud',
                  icon: '☁️',
                  code: 'CAO ĐỘ 1.400M',
                  label: 'Săn mây Sa Mù',
                  badge: 'ĐÈO GIÓ',
                  desc: 'Khe Sanh · Điện gió',
                },
                {
                  id: 'beach',
                  icon: '🏖️',
                  code: '75KM BIỂN CÁT',
                  label: 'Biển cát trắng',
                  badge: 'HOANG SƠ',
                  desc: 'Cửa Việt · Mũi Trèo',
                },
                {
                  id: 'island',
                  icon: '🏝️',
                  code: '15 HẢI LÝ BIỂN ĐÔNG',
                  label: 'Đảo Cồn Cỏ',
                  badge: 'TIỀN ĐỒN',
                  desc: 'Lặn ngắm san hô',
                },
                {
                  id: 'waterfall',
                  icon: '💦',
                  code: 'RỪNG NGUYÊN SINH',
                  label: 'Thác & Suối ngàn',
                  badge: 'TREKKING',
                  desc: 'Thác Chênh Vênh · Klu',
                },
              ].map((f) => {
                const isActive = placeCategory === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setPlaceCategory(f.id)}
                    className={`phuot-waypoint-btn ${isActive ? 'active' : ''}`}
                  >
                    <div className="phuot-btn-top">
                      <span className="phuot-btn-code">{f.code}</span>
                      <span className="phuot-btn-badge">{f.badge}</span>
                    </div>
                    <div className="phuot-btn-main">
                      <span className="phuot-btn-icon">{f.icon}</span>
                      <span className="phuot-btn-label">{f.label}</span>
                      {isActive && <span className="phuot-radar-dot" title="Tọa độ đang mở" />}
                    </div>
                    <div className="phuot-btn-desc">{f.desc}</div>
                  </button>
                );
              })}
            </div>

            {/* Status Readout Strip */}
            <div className="phuot-status-strip">
              <div className="phuot-status-left">
                <span style={{ fontSize: '1.1rem' }}>🧭</span>
                <span>
                  Đang mở <strong>{filteredPlaces.length}</strong> trạm dừng chân
                  {placeCategory !== 'all' && (
                    <span style={{ color: '#059669', fontWeight: 600 }}> · Đã bật chế độ lọc chủ đề</span>
                  )}
                  {selectedZone !== 'all' && (
                    <span style={{ color: '#d97706', fontWeight: 600 }}> · Thuộc phân vùng {selectedZone}</span>
                  )}
                </span>
              </div>

              {(placeCategory !== 'all' || selectedZone !== 'all') && (
                <button
                  onClick={() => {
                    setPlaceCategory('all');
                    setSelectedZone('all');
                  }}
                  className="phuot-status-reset-btn"
                >
                  ✕ Xem toàn bộ tọa độ
                </button>
              )}
            </div>
          </div>

          {/* View Mode Toggle: Interactive Map vs Grid */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            margin: '1.2rem 0 1.5rem',
          }}>
            <div style={{ display: 'flex', gap: '0.4rem', background: 'rgba(19, 62, 47, 0.08)', padding: '4px', borderRadius: '12px' }}>
              <button
                onClick={() => setPlacesViewMode('map')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: placesViewMode === 'map' ? '#133e2f' : 'transparent',
                  color: placesViewMode === 'map' ? '#ffffff' : '#4b5563',
                  boxShadow: placesViewMode === 'map' ? '0 2px 8px rgba(19, 62, 47, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>🗺️</span>
                <span>Bản Đồ Tương Tác & Cung Đường</span>
              </button>

              <button
                onClick={() => setPlacesViewMode('grid')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.2rem',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  backgroundColor: placesViewMode === 'grid' ? '#133e2f' : 'transparent',
                  color: placesViewMode === 'grid' ? '#ffffff' : '#4b5563',
                  boxShadow: placesViewMode === 'grid' ? '0 2px 8px rgba(19, 62, 47, 0.25)' : 'none',
                  transition: 'all 0.2s ease',
                }}
              >
                <span>📋</span>
                <span>Danh Sách Thẻ Tọa Độ ({filteredPlaces.length})</span>
              </button>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              Hiển thị <strong>{filteredPlaces.length}</strong> tọa độ danh thắng tại Quảng Trị
            </div>
          </div>

          {/* Conditional Rendering: Interactive Map or Grid */}
          {placesViewMode === 'map' ? (
            <QuangTriInteractiveMap
              places={initialPlaces}
              onOpenModal={(p) => setActivePlaceModal(p)}
              bookmarkedIds={bookmarkedIds}
              onToggleBookmark={toggleBookmark}
            />
          ) : (
            <div className="places-grid">
              {filteredPlaces.map((p: any) => (
                <article
                  key={p.id}
                  onClick={() => setActivePlaceModal(p)}
                  className="place-card"
                  style={{ cursor: 'pointer' }}
                >
                  <div className="card-media">
                    <img
                      src={p.image || p.hero_image || 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80'}
                      alt={p.name}
                      loading="lazy"
                    />
                    <span className="card-zone-tag">{p.zoneCode || p.zone_code}</span>
                    <button
                      onClick={(e) => toggleBookmark(p.id, e)}
                      className={`card-bookmark-btn ${bookmarkedIds.includes(p.id) ? 'bookmarked' : ''}`}
                      title="Lưu vào Sổ tay"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill={bookmarkedIds.includes(p.id) ? '#d97706' : 'none'} stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="card-meta-row">
                      <span className="card-cat">{p.categoryName || p.category_name}</span>
                      <span className="card-rating">★ {p.rating} ({p.reviewsCount || p.rating_count || 100})</span>
                    </div>
                    <h3 className="card-title">{p.name}</h3>
                    <p className="card-short-desc">{p.shortDesc || p.short_desc}</p>
                    <div className="card-footer-info">
                      <span className="card-coord">📍 {p.zoneName || p.zone_name}</span>
                      <span className="card-ticket-preview">{p.ticket || p.ticket_price || 'Miễn phí'}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* =========================================================================
          1. LƯU TRÚ & DỊCH VỤ ĐỐI TÁC BẢN ĐỊA XÁC MINH (Thiết kế mới tinh gọn, chuyên nghiệp)
          ========================================================================= */}
      <section className="services-section-curated" id="dich-vu">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">✦ HỆ THỐNG ĐỐI TÁC BẢN ĐỊA · ĐÃ XÁC MINH</span>
            <h2 className="title-serif">Lưu Trú, Thuê Xe & Hải Trình Cồn Cỏ</h2>
            <p className="desc-text">
              Kết nối trực tiếp chủ homestay Khe Sanh, dịch vụ cào cào vượt đèo Sa Mù và vé tàu cao tốc Cồn Cỏ – 100% giá gốc niêm yết, không qua trung gian.
            </p>
          </div>

          {/* 3 Cam kết uy tín */}
          <div className="services-trust-row">
            <div className="trust-item">
              <span className="trust-icon">🛡️</span>
              <div>
                <strong>100% Giá Niêm Yết Gốc</strong>
                <span>Không kê giá, cam kết theo giá chủ cơ sở</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">⚡</span>
              <div>
                <strong>Kết Nối Trực Tiếp Qua Hotline / Zalo</strong>
                <span>Chủ cơ sở phản hồi nhanh chóng, hỗ trợ đặt chỗ</span>
              </div>
            </div>
            <div className="trust-item">
              <span className="trust-icon">🤝</span>
              <div>
                <strong>Người Bản Địa Đồng Hành</strong>
                <span>Sẵn sàng hỗ trợ tư vấn và cứu hộ trên đường đi</span>
              </div>
            </div>
          </div>

          {/* Filter Pills & Nút Đăng ký đối tác */}
          <div className="services-header-row">
            <div className="services-filter-track">
              {[
                { id: 'all', label: 'Tất cả dịch vụ' },
                { id: 'homestay', label: 'Homestay & Glamping' },
                { id: 'bike', label: 'Thuê xe máy' },
                { id: 'boat', label: 'Vé tàu Cồn Cỏ' },
                { id: 'tour', label: 'Tour Guide Di Sản' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setServiceCategory(f.id)}
                  className={`services-filter-pill ${serviceCategory === f.id ? 'active' : ''}`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsPartnerModalOpen(true)}
              className="services-partner-btn"
            >
              + Đăng ký đối tác bản địa
            </button>
          </div>

          {/* Services Cards Grid (Hiển thị 4 dịch vụ tiêu biểu tinh gọn) */}
          <div className="services-curated-grid">
            {filteredServices.slice(0, 4).map((srv: any) => (
              <article key={srv.id} className="curated-service-card">
                <div className="cservice-media">
                  <img src={srv.image} alt={srv.name} loading="lazy" />
                  <span className="cservice-badge">{srv.typeLabel || srv.categoryName || 'Dịch vụ'}</span>
                  {(srv.verified || srv.is_verified) && <span className="cservice-verified">✓ Đã xác minh</span>}
                </div>
                <div className="cservice-body">
                  <div className="cservice-meta">
                    <span className="cservice-zone">📍 {srv.zoneName || srv.zone_name}</span>
                    <span className="cservice-rating">★ {srv.rating} ({srv.reviewsCount || srv.reviews || 40})</span>
                  </div>
                  <h3 className="cservice-title">{srv.name}</h3>
                  <p className="cservice-address">{srv.address}</p>
                  
                  <div className="cservice-price-block">
                    <span className="cservice-price-label">Giá niêm yết:</span>
                    <strong className="cservice-price-val">{srv.price}</strong>
                  </div>

                  <div className="cservice-actions">
                    <a
                      href={`tel:${srv.phone || srv.hotline}`}
                      onClick={() => trackLead(srv.id, srv.name, 'call')}
                      className="cservice-call-btn"
                    >
                      📞 Gọi Hotline
                    </a>
                    <a
                      href={`https://zalo.me/${(srv.zalo || srv.phone || '').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackLead(srv.id, srv.name, 'zalo')}
                      className="cservice-zalo-btn"
                    >
                      💬 Nhắn Zalo
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Chuyển hướng xem toàn bộ dịch vụ */}
          <div className="section-view-all-row">
            <Link href="/dich-vu" className="section-view-all-btn">
              Xem tất cả {initialServices.length} đối tác dịch vụ & lưu trú tại Quảng Trị →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. CẨM NANG ẨM THỰC ĐẶC SẢN ĐẤT LỬA (Showcase 4 món kinh điển)
          ========================================================================= */}
      <section className="food-section-curated" id="am-thuc">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">✦ HƯƠNG VỊ ĐẤT LỬA</span>
            <h2 className="title-serif">Ẩm Thực & Đặc Sản Nổi Tiếng</h2>
            <p className="desc-text">
              Vị cay nồng của ớt hiểm, đằm thắm của cá tràu đồng Thạch Hãn và hương thơm đậm đà của hạt tiêu Khe Sanh.
            </p>
          </div>

          <div className="food-curated-grid">
            {foodList.slice(0, 4).map((f: any) => (
              <article key={f.id} className="curated-food-card">
                <div className="cfood-media">
                  <img src={f.image} alt={f.name} loading="lazy" />
                  <span className="cfood-zone">{f.origin || f.zoneName || 'Quảng Trị'}</span>
                  <span className="cfood-price">{f.priceRange || 'Bình dân'}</span>
                </div>
                <div className="cfood-body">
                  <h3 className="cfood-title">{f.name}</h3>
                  <p className="cfood-desc">{f.description}</p>
                  <div className="cfood-spot">
                    <span>📍 Quán ngon gợi ý:</span>
                    <strong>{f.addressRecs?.[0] || f.bestPlaces?.[0] || 'Chợ Đông Hà'}</strong>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="section-view-all-row">
            <Link href="/am-thuc" className="section-view-all-btn">
              Khám phá toàn bộ cẩm nang ẩm thực & địa chỉ quán ngon →
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. LỘ TRÌNH ĐI CHẬM GỢI Ý (3 Hành trình tiêu biểu)
          ========================================================================= */}
      <section className="itineraries-section-curated" id="lich-trinh">
        <div className="container">
          <div className="section-head-hagiang">
            <span className="sub-title-accent">✦ CUNG ĐƯỜNG ĐI CHẬM</span>
            <h2 className="title-serif">Hành Trình Gợi Ý Theo Ngày</h2>
            <p className="desc-text">
              Lộ trình được thiết kế tối ưu thời gian di chuyển, dừng chân nghỉ ngơi và đón hoàng hôn đẹp nhất.
            </p>
          </div>

          <div className="itineraries-curated-grid">
            {itineraries.map((it: any) => {
              const rawHighlights = it.highlights || it.highlight;
              const highlightsList = Array.isArray(rawHighlights)
                ? rawHighlights
                : typeof rawHighlights === 'string'
                ? rawHighlights.split('·').map((s: string) => s.trim()).filter(Boolean)
                : [];

              return (
                <div key={it.id} className="curated-itinerary-card">
                  <div className="citinerary-head">
                    <span className="citinerary-duration">{it.duration || it.days || 'Lộ trình'}</span>
                    <span className="citinerary-style">{it.suitability || it.suitableFor || 'Phượt thủ'}</span>
                  </div>
                  <h3 className="citinerary-title">{it.title}</h3>
                  <p className="citinerary-desc">{it.description}</p>

                  <div className="citinerary-stops-wrap">
                    <span className="citinerary-stops-title">Trạm dừng chân nổi bật:</span>
                    <ul className="citinerary-stops-list">
                      {highlightsList.slice(0, 4).map((hl: string, idx: number) => (
                        <li key={idx}>{hl}</li>
                      ))}
                    </ul>
                  </div>

                  <Link href="/lich-trinh" className="citinerary-link">
                    Xem chi tiết lộ trình từng ngày →
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. CỘNG ĐỒNG LÃNG DU & CẨM NANG BẢO AN (Gọn gàng trong bố cục 2 cột)
          ========================================================================= */}
      <section className="community-safety-section" id="dien-dan">
        <div className="container">
          <div className="community-safety-grid">
            {/* Cột 1: Cộng đồng chia sẻ kinh nghiệm */}
            <div className="community-col">
              <div className="col-header-row">
                <div>
                  <span className="col-kicker">✦ KINH NGHIỆM THỰC TẾ</span>
                  <h3 className="col-title">Diễn Đàn Lãng Du Quảng Trị</h3>
                </div>
                <button
                  onClick={() => setIsThreadModalOpen(true)}
                  className="quick-thread-btn"
                >
                  ✍️ Đăng bài
                </button>
              </div>

              <div className="compact-threads-list">
                {threads.slice(0, 2).map((th: any) => (
                  <article key={th.id} className="compact-thread-card">
                    <div className="cthread-head">
                      <div className="cthread-author">
                        <img
                          src={th.avatar || th.author_avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80'}
                          alt={th.author || th.author_name}
                        />
                        <div>
                          <strong>{th.author || th.author_name}</strong>
                          <span>{th.time || (th.created_at ? new Date(th.created_at).toLocaleDateString('vi-VN') : 'Gần đây')}</span>
                        </div>
                      </div>
                      <span className="cthread-tag">{th.tag}</span>
                    </div>

                    <h4 className="cthread-title">{th.title}</h4>
                    <p className="cthread-content">{th.content}</p>

                    <div className="cthread-footer">
                      <button
                        onClick={() => {
                          setLikedThreadIds((prev) => ({ ...prev, [th.id]: !prev[th.id] }));
                        }}
                        className={`cthread-like-btn ${likedThreadIds[th.id] ? 'active' : ''}`}
                      >
                        ❤️ Thích ({likedThreadIds[th.id] ? (th.likes || th.likes_count || 1) + 1 : th.likes || th.likes_count || 1})
                      </button>
                      <Link href="/dien-dan" className="cthread-view-more">
                        Thảo luận trên diễn đàn →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <Link href="/dien-dan" className="section-inline-link">
                  Xem tất cả các bài viết & hình ảnh cộng đồng →
                </Link>
              </div>
            </div>

            {/* Cột 2: Cẩm nang an toàn & Cứu hộ khẩn cấp */}
            <div className="safety-col">
              <div className="col-header-row">
                <div>
                  <span className="col-kicker">✦ CẨM NANG BẢO AN</span>
                  <h3 className="col-title">Cứu Hộ & Tiện Ích Trọng Yếu</h3>
                </div>
              </div>

              <div className="safety-cards-box">
                {/* Hotlines */}
                <div className="safety-item-group">
                  <h4 className="safety-group-title">🚨 Số Điện Thoại Cứu Hộ 24/7</h4>
                  <div className="hotlines-compact-list">
                    {emergencyHotlinesList.slice(0, 3).map((em: any, idx: number) => (
                      <div key={idx} className="hotline-compact-row">
                        <div className="hotline-compact-info">
                          <strong>{em.name}</strong>
                          <span>{em.note || em.notes || 'Hỗ trợ 24/7'}</span>
                        </div>
                        <a href={`tel:${em.phone}`} className="hotline-compact-btn">
                          📞 {em.phone}
                        </a>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cây xăng */}
                <div className="safety-item-group">
                  <h4 className="safety-group-title">⛽ Cây Xăng Trọng Yếu Tuyến Đường Xa</h4>
                  <ul className="gas-compact-list">
                    {gasStationsList.slice(0, 3).map((g: any, idx: number) => (
                      <li key={idx}>
                        <strong>{g.name}:</strong> <span>{g.route || g.location}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ marginTop: '1.25rem' }}>
                <Link href="/tien-ich" className="section-inline-link">
                  Xem toàn bộ danh bạ cứu hộ & trạm xăng toàn tỉnh →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* World-Class Travel Footer */}
      <Footer />

      {/* Modal Chi Tiết Điểm Đến */}
      {activePlaceModal && (
        <div className="modal-overlay active" onClick={() => setActivePlaceModal(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActivePlaceModal(null)}>×</button>
            <div className="modal-header-visual">
              <img src={activePlaceModal.image || activePlaceModal.hero_image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80'} alt={activePlaceModal.name} />
              <div className="modal-title-overlay">
                <span className="modal-zone-badge">{activePlaceModal.zoneCode || activePlaceModal.zone_code} · {activePlaceModal.zoneName || activePlaceModal.zone_name}</span>
                <h2>{activePlaceModal.name}</h2>
              </div>
            </div>
            <div className="modal-content-body">
              <p className="modal-desc">{activePlaceModal.fullDesc || activePlaceModal.history || activePlaceModal.shortDesc || activePlaceModal.short_desc}</p>
              {Array.isArray(activePlaceModal.highlights) && activePlaceModal.highlights.length > 0 && (
                <div className="modal-highlights-box">
                  <h4>Điểm nhấn nổi bật:</h4>
                  <ul>
                    {activePlaceModal.highlights.map((hl: string, idx: number) => (
                      <li key={idx}>{hl}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="modal-meta-grid">
                <div><strong>📍 Địa chỉ:</strong> {activePlaceModal.address}</div>
                <div><strong>🕒 Giờ mở cửa:</strong> {activePlaceModal.openHours || activePlaceModal.open_time || '07:00 - 17:30'}</div>
                <div><strong>🎟️ Giá vé:</strong> {activePlaceModal.ticket || activePlaceModal.ticket_price || 'Miễn phí'}</div>
                <div><strong>🧭 Tọa độ:</strong> {activePlaceModal.coordinates}</div>
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activePlaceModal.name + ' Quảng Trị')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="modal-map-link-btn"
                >
                  Mở Google Maps chỉ đường ↗
                </a>
                <Link
                  href={`/diem-den/${activePlaceModal.id}`}
                  className="modal-map-link-btn"
                  style={{ backgroundColor: '#fff', color: '#133e2f', border: '1px solid #133e2f' }}
                >
                  Xem trang SEO riêng ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sổ Tay Của Tôi Drawer (Notebook) */}
      <div className={`notebook-drawer ${isNotebookOpen ? 'open' : ''}`}>
        <div className="notebook-header">
          <div className="notebook-title-wrap">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            <h3>Sổ Tay Phượt Của Tôi</h3>
          </div>
          <button onClick={() => setIsNotebookOpen(false)} className="notebook-close-btn">×</button>
        </div>

        <div className="notebook-tabs-bar">
          <button onClick={() => setNotebookTab('bookmarks')} className={`nb-tab-btn ${notebookTab === 'bookmarks' ? 'active' : ''}`}>
            Đã Lưu ({bookmarkedIds.length})
          </button>
          <button onClick={() => setNotebookTab('budget')} className={`nb-tab-btn ${notebookTab === 'budget' ? 'active' : ''}`}>
            Chi Phí
          </button>
          <button onClick={() => setNotebookTab('checklist')} className={`nb-tab-btn ${notebookTab === 'checklist' ? 'active' : ''}`}>
            Chuẩn Bị
          </button>
          <button onClick={() => setNotebookTab('notes')} className={`nb-tab-btn ${notebookTab === 'notes' ? 'active' : ''}`}>
            Ghi Chú
          </button>
        </div>

        <div className="notebook-body">
          {notebookTab === 'bookmarks' && (
            <div>
              {bookmarkedIds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem 1rem', color: '#6b7280' }}>
                  Chưa lưu địa điểm nào. Hãy bấm biểu tượng bookmark trên các card điểm đến để lưu vào đây!
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                  {initialPlaces.filter((p) => bookmarkedIds.includes(p.id)).map((p) => (
                    <div key={p.id} style={{ display: 'flex', gap: '0.8rem', padding: '0.8rem', background: '#fff', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                      <img src={p.image || p.hero_image} alt={p.name} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                      <div style={{ flexGrow: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#133e2f' }}>{p.name}</h4>
                        <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{p.zoneName || p.zone_code}</span>
                      </div>
                      <button onClick={() => toggleBookmark(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626' }}>
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {notebookTab === 'budget' && (
            <div className="budget-calculator-box">
              <h4>Dự Toán Kinh Phí Chuyến Đi</h4>
              <div className="budget-field-row">
                <label>Số ngày đi: {budgetDays} ngày</label>
                <input type="range" min="1" max="7" value={budgetDays} onChange={(e) => setBudgetDays(parseInt(e.target.value))} />
              </div>
              <div className="budget-field-row">
                <label>Số người: {budgetPeople} người</label>
                <input type="range" min="1" max="10" value={budgetPeople} onChange={(e) => setBudgetPeople(parseInt(e.target.value))} />
              </div>
              <div className="budget-field-row">
                <label>Phương tiện:</label>
                <select value={budgetVehicle} onChange={(e) => setBudgetVehicle(e.target.value)}>
                  <option value="motorbike">Xe máy phượt đèo</option>
                  <option value="car">Ô tô du lịch</option>
                </select>
              </div>
              <div className="budget-field-row">
                <label>Lưu trú:</label>
                <select value={budgetStay} onChange={(e) => setBudgetStay(e.target.value)}>
                  <option value="homestay">Homestay bản địa</option>
                  <option value="hotel">Khách sạn tiện nghi</option>
                  <option value="resort">Resort nghỉ dưỡng</option>
                </select>
              </div>

              <div className="budget-result-card" style={{ marginTop: '1.2rem', padding: '1rem', background: '#133e2f', color: '#fff', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.85rem', color: '#86efac' }}>Tổng chi phí ước tính:</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 700, color: '#fef08a' }}>
                  {calculatedBudget.total.toLocaleString('vi-VN')} VNĐ
                </div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.8)', marginTop: '0.3rem' }}>
                  Khoảng ~{calculatedBudget.perPerson.toLocaleString('vi-VN')} VNĐ / người
                </div>
              </div>
            </div>
          )}

          {notebookTab === 'checklist' && (
            <div>
              <h4>Checklist Hành Lý Sa Mù & Cồn Cỏ</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginTop: '1rem' }}>
                {checklistItems.map((item: any, idx: number) => {
                  const text = typeof item === 'string' ? item : item.text;
                  const id = typeof item === 'string' ? `chk-${idx}` : item.id;
                  return (
                    <label key={id} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={!!checkedItems[id]}
                        onChange={(e) => {
                          const next = { ...checkedItems, [id]: e.target.checked };
                          setCheckedItems(next);
                          localStorage.setItem('qt_checklist', JSON.stringify(next));
                        }}
                      />
                      <span style={{ textDecoration: checkedItems[id] ? 'line-through' : 'none', color: checkedItems[id] ? '#9ca3af' : 'inherit' }}>
                        {text}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {notebookTab === 'notes' && (
            <div>
              <h4>Ghi Chú Riêng Tư Offline</h4>
              <textarea
                value={userNotes}
                onChange={(e) => {
                  setUserNotes(e.target.value);
                  localStorage.setItem('qt_notes', e.target.value);
                }}
                placeholder="Ghi lại lịch hẹn, số điện thoại hoặc cảm xúc dọc đường..."
                rows={10}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '10px', border: '1px solid #d1d5db', marginTop: '0.6rem', font: 'inherit' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modal Đăng Ký Đối Tác */}
      {isPartnerModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsPartnerModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <button className="modal-close-btn" onClick={() => setIsPartnerModalOpen(false)}>×</button>
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#133e2f', marginTop: 0 }}>
                Đưa Dịch Vụ Của Bạn Lên QuangTri.wiki
              </h3>
              <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Dành cho các chủ homestay, nhà xe máy, nhà tàu cao tốc và hướng dẫn viên bản địa tại Quảng Trị.
              </p>
              <form
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  alert('Hồ sơ của bạn đã được gửi thành công! Ban quản trị sẽ liên hệ xác minh trong 24 giờ.');
                  setIsPartnerModalOpen(false);
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Tên cơ sở / Dịch vụ *</label>
                  <input type="text" required placeholder="Ví dụ: Sa Mù Homestay, Thuê xe máy Đông Hà..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Loại hình dịch vụ *</label>
                  <select style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                    <option value="homestay">Homestay & Glamping</option>
                    <option value="rental">Cho thuê xe máy</option>
                    <option value="boat">Vé tàu cao tốc Cồn Cỏ</option>
                    <option value="tour">Tour Guide Bản Địa</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Số điện thoại Hotline / Zalo *</label>
                  <input type="tel" required placeholder="09xx xxx xxx" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Địa chỉ cụ thể *</label>
                  <input type="text" required placeholder="Số nhà, đường, huyện/thị xã..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <button type="submit" style={{ backgroundColor: '#133e2f', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                  Gửi Hồ Sơ Xác Minh
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Quản Trị Doanh Thu & Leads */}
      {isAdminModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsAdminModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
            <button className="modal-close-btn" onClick={() => setIsAdminModalOpen(false)}>×</button>
            <div style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>⚙️</span>
                <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#133e2f', margin: 0 }}>
                  Trung Tâm Quản Trị & Doanh Thu
                </h3>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                Thống kê lượt khách kết nối đối tác (Leads) và tính toán doanh thu hoa hồng tự động.
              </p>

              {adminStats ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Đối tác xác minh</span>
                    <strong style={{ fontSize: '1.8rem', display: 'block', color: '#133e2f', margin: '0.2rem 0' }}>{adminStats.totalPartners}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Đang hoạt động</span>
                  </div>
                  <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Lượt kết nối khách (Leads)</span>
                    <strong style={{ fontSize: '1.8rem', display: 'block', color: '#2563eb', margin: '0.2rem 0' }}>{adminStats.totalLeads}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>Click Gọi & Zalo</span>
                  </div>
                  <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
                    <span style={{ fontSize: '0.8rem', color: '#6b7280' }}>Đơn đăng ký mới</span>
                    <strong style={{ fontSize: '1.8rem', display: 'block', color: '#d97706', margin: '0.2rem 0' }}>{adminStats.totalRegistrations}</strong>
                    <span style={{ fontSize: '0.75rem', color: '#d97706' }}>Cơ sở chờ duyệt</span>
                  </div>
                  <div style={{ padding: '1rem', background: '#133e2f', color: '#fff', borderRadius: '12px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#86efac' }}>Doanh thu tạm tính</span>
                    <strong style={{ fontSize: '1.4rem', display: 'block', color: '#fef08a', margin: '0.2rem 0' }}>{adminStats.estimatedRevenue}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)' }}>Phí niêm yết + Leads</span>
                  </div>
                </div>
              ) : (
                <div>Đang tải số liệu...</div>
              )}

              <Link
                href="/admin"
                style={{
                  display: 'block',
                  textAlign: 'center',
                  backgroundColor: '#133e2f',
                  color: '#fff',
                  padding: '0.75rem',
                  borderRadius: '10px',
                  textDecoration: 'none',
                  fontWeight: 600,
                }}
              >
                Mở Bảng Điều Khiển Chi Tiết /admin ↗
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tạo Bài Viết Diễn Đàn */}
      {isThreadModalOpen && (
        <div className="modal-overlay active" onClick={() => setIsThreadModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '580px' }}>
            <button className="modal-close-btn" onClick={() => setIsThreadModalOpen(false)}>×</button>
            <div style={{ padding: '2rem' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.6rem', color: '#133e2f', marginTop: 0 }}>
                Chia Sẻ Chuyến Đi Của Bạn
              </h3>
              <form
                onSubmit={async (e: any) => {
                  e.preventDefault();
                  const form = e.target;
                  const newThread = {
                    id: `thread-${Date.now()}`,
                    author: form.author.value || 'Khách lãng du',
                    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
                    badge: 'Thành viên mới',
                    time: 'Vừa xong',
                    tag: form.tag.value,
                    zoneCode: form.zoneCode.value,
                    title: form.title.value,
                    content: form.content.value,
                    images: form.image.value ? [form.image.value] : [],
                    likes: 1,
                  };

                  try {
                    await fetch('/api/threads', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify(newThread),
                    });
                  } catch (err) {}

                  setThreads((prev) => [newThread, ...prev]);
                  setIsThreadModalOpen(false);
                  alert('Bài viết của bạn đã được đăng lên diễn đàn!');
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}
              >
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Họ tên hoặc Nickname *</label>
                  <input name="author" type="text" required placeholder="Ví dụ: Hoàng Nam (Phượt Sa Mù)..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Chủ đề *</label>
                    <select name="tag" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                      <option value="Kinh nghiệm">Kinh nghiệm</option>
                      <option value="Hỏi đáp">Hỏi đáp</option>
                      <option value="Review ẩm thực">Review ẩm thực</option>
                      <option value="Săn mây Sa Mù">Săn mây Sa Mù</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Khu vực *</label>
                    <select name="zoneCode" style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }}>
                      <option value="QT-05">QT-05 (Sa Mù - Khe Sanh)</option>
                      <option value="QT-02">QT-02 (Thành Cổ Quảng Trị)</option>
                      <option value="QT-03">QT-03 (Vĩ tuyến 17 - Vịnh Mốc)</option>
                      <option value="QT-07">QT-07 (Đảo Cồn Cỏ)</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Tiêu đề bài viết *</label>
                  <input name="title" type="text" required placeholder="Tóm tắt trải nghiệm hoặc câu hỏi..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Nội dung chi tiết *</label>
                  <textarea name="content" required rows={4} placeholder="Chia sẻ kinh nghiệm đường đi, chỗ ở, thời tiết..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db', font: 'inherit' }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>Link ảnh check-in (Tùy chọn)</label>
                  <input name="image" type="url" placeholder="https://..." style={{ width: '100%', padding: '0.7rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                </div>
                <button type="submit" style={{ backgroundColor: '#133e2f', color: '#fff', padding: '0.8rem', borderRadius: '8px', border: 'none', fontWeight: 600, cursor: 'pointer', marginTop: '0.5rem' }}>
                  Đăng Bài Viết
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
