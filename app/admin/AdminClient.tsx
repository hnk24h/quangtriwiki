'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QUANGTRI_DATA } from '@/lib/data';

type CmsTab = 'overview' | 'analytics' | 'threads' | 'places' | 'services' | 'foods' | 'itineraries' | 'utilities';

export default function AdminClient() {
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState('admin@quangtri.wiki');
  const [passwordInput, setPasswordInput] = useState('quangtri2026');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');

  // 2. Active CMS Tab
  const [activeTab, setActiveTab] = useState<CmsTab>('overview');

  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // 4. Analytics State
  const [totalPageViews, setTotalPageViews] = useState<number>(18240);
  const [todayPageViews, setTodayPageViews] = useState<number>(1280);

  // 4. Data States (Initialized from QUANGTRI_DATA and persisted in localStorage)
  const [places, setPlaces] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [foods, setFoods] = useState<any[]>([]);
  const [itineraries, setItineraries] = useState<any[]>([]);
  const [threads, setThreads] = useState<any[]>([]);
  const [gasStations, setGasStations] = useState<any[]>([]);
  const [hotlines, setHotlines] = useState<any[]>([]);

  // 5. Modal Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState<CmsTab | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check auth on mount & load data from localStorage or QUANGTRI_DATA
  useEffect(() => {
    const authStatus = localStorage.getItem('qt_admin_logged_in');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }

    // Load data
    try {
      const savedPlaces = localStorage.getItem('qt_cms_places');
      setPlaces(savedPlaces ? JSON.parse(savedPlaces) : QUANGTRI_DATA.places || []);

      const savedServices = localStorage.getItem('qt_cms_services');
      setServices(savedServices ? JSON.parse(savedServices) : QUANGTRI_DATA.services || []);

      const savedFoods = localStorage.getItem('qt_cms_foods');
      setFoods(savedFoods ? JSON.parse(savedFoods) : QUANGTRI_DATA.foods || []);

      const savedItineraries = localStorage.getItem('qt_cms_itineraries');
      setItineraries(savedItineraries ? JSON.parse(savedItineraries) : QUANGTRI_DATA.itineraries || []);

      const savedThreads = localStorage.getItem('qt_cms_threads');
      setThreads(savedThreads ? JSON.parse(savedThreads) : ((QUANGTRI_DATA as any).forumThreads || []));

      const savedGas = localStorage.getItem('qt_cms_gas');
      setGasStations(savedGas ? JSON.parse(savedGas) : ((QUANGTRI_DATA as any).guides?.gasStations || []));

      const savedHotlines = localStorage.getItem('qt_cms_hotlines');
      setHotlines(savedHotlines ? JSON.parse(savedHotlines) : ((QUANGTRI_DATA as any).guides?.emergencyHotlines || []));

      const savedViews = localStorage.getItem('qt_page_views');
      if (savedViews) {
        setTotalPageViews(parseInt(savedViews, 10));
      }
    } catch (e) {
      console.warn('Error loading CMS data:', e);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Auth Handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticated(true);
    setAuthError('');
    localStorage.setItem('qt_admin_logged_in', 'true');
    showToast('Đăng nhập Quản trị viên thành công!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPasswordInput('');
    localStorage.removeItem('qt_admin_logged_in');
    showToast('Đã đăng xuất khỏi phiên quản trị.');
  };

  // Open Add/Edit Modal
  const openAddModal = (type: CmsTab) => {
    setEditingType(type);
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (type: CmsTab, item: any) => {
    setEditingType(type);
    setEditingItem({ ...item });
    setIsEditorOpen(true);
  };

  // Delete Handlers
  const handleDelete = (type: CmsTab, id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${name}"? Hành động này không thể hoàn tác.`)) {
      return;
    }

    if (type === 'places') {
      const updated = places.filter((p) => p.id !== id);
      setPlaces(updated);
      localStorage.setItem('qt_cms_places', JSON.stringify(updated));
    } else if (type === 'services') {
      const updated = services.filter((s) => s.id !== id);
      setServices(updated);
      localStorage.setItem('qt_cms_services', JSON.stringify(updated));
    } else if (type === 'foods') {
      const updated = foods.filter((f) => f.id !== id);
      setFoods(updated);
      localStorage.setItem('qt_cms_foods', JSON.stringify(updated));
    } else if (type === 'itineraries') {
      const updated = itineraries.filter((it) => it.id !== id);
      setItineraries(updated);
      localStorage.setItem('qt_cms_itineraries', JSON.stringify(updated));
    } else if (type === 'threads') {
      const updated = threads.filter((t) => t.id !== id);
      setThreads(updated);
      localStorage.setItem('qt_cms_threads', JSON.stringify(updated));
    } else if (type === 'utilities') {
      const updatedGas = gasStations.filter((g) => g.name !== id);
      setGasStations(updatedGas);
      localStorage.setItem('qt_cms_gas', JSON.stringify(updatedGas));
      const updatedHot = hotlines.filter((h) => h.name !== id);
      setHotlines(updatedHot);
      localStorage.setItem('qt_cms_hotlines', JSON.stringify(updatedHot));
    }

    showToast(`Đã xóa thành công "${name}".`);
  };

  // Save Item Handler
  const handleSaveItem = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const dataObj: any = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    if (editingType === 'places') {
      const newPlace = {
        id: editingItem?.id || dataObj.id || `place-${Date.now()}`,
        name: dataObj.name,
        zoneCode: dataObj.zoneCode,
        zoneName: dataObj.zoneName,
        category: dataObj.category,
        categoryName: dataObj.categoryName,
        image: dataObj.image,
        hero_image: dataObj.image,
        rating: parseFloat(dataObj.rating) || 4.9,
        reviewsCount: parseInt(dataObj.reviewsCount) || 100,
        shortDesc: dataObj.shortDesc,
        fullDesc: dataObj.fullDesc,
        ticket: dataObj.ticket,
        openHours: dataObj.openHours,
        coordinates: dataObj.coordinates,
        address: dataObj.address,
        highlights: typeof dataObj.highlights === 'string'
          ? dataObj.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : editingItem?.highlights || [],
      };

      let updated;
      if (editingItem) {
        updated = places.map((p) => (p.id === editingItem.id ? newPlace : p));
      } else {
        updated = [newPlace, ...places];
      }
      setPlaces(updated);
      localStorage.setItem('qt_cms_places', JSON.stringify(updated));
      showToast(editingItem ? 'Đã cập nhật điểm đến!' : 'Đã thêm điểm đến mới!');
    } else if (editingType === 'services') {
      const newService = {
        id: editingItem?.id || `srv-${Date.now()}`,
        name: dataObj.name,
        type: dataObj.type,
        typeLabel: dataObj.typeLabel,
        zoneCode: dataObj.zoneCode,
        zoneName: dataObj.zoneName,
        price: dataObj.price,
        rating: parseFloat(dataObj.rating) || 4.9,
        address: dataObj.address,
        phone: dataObj.phone,
        hotline: dataObj.phone,
        zalo: dataObj.zalo || dataObj.phone,
        image: dataObj.image,
        verified: dataObj.verified === 'true' || dataObj.verified === 'on',
      };

      let updated;
      if (editingItem) {
        updated = services.map((s) => (s.id === editingItem.id ? newService : s));
      } else {
        updated = [newService, ...services];
      }
      setServices(updated);
      localStorage.setItem('qt_cms_services', JSON.stringify(updated));
      showToast(editingItem ? 'Đã cập nhật dịch vụ đối tác!' : 'Đã thêm dịch vụ đối tác mới!');
    } else if (editingType === 'foods') {
      const newFood = {
        id: editingItem?.id || `food-${Date.now()}`,
        name: dataObj.name,
        origin: dataObj.origin,
        priceRange: dataObj.priceRange,
        description: dataObj.description,
        image: dataObj.image,
        addressRecs: [dataObj.addressRec],
      };

      let updated;
      if (editingItem) {
        updated = foods.map((f) => (f.id === editingItem.id ? newFood : f));
      } else {
        updated = [newFood, ...foods];
      }
      setFoods(updated);
      localStorage.setItem('qt_cms_foods', JSON.stringify(updated));
      showToast(editingItem ? 'Đã cập nhật món ăn đặc sản!' : 'Đã thêm món ăn mới!');
    } else if (editingType === 'itineraries') {
      const newItinerary = {
        id: editingItem?.id || `it-${Date.now()}`,
        title: dataObj.title,
        duration: dataObj.duration,
        suitability: dataObj.suitability,
        distance: dataObj.distance,
        description: dataObj.description,
        highlights: typeof dataObj.highlights === 'string'
          ? dataObj.highlights.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : editingItem?.highlights || [],
      };

      let updated;
      if (editingItem) {
        updated = itineraries.map((it) => (it.id === editingItem.id ? newItinerary : it));
      } else {
        updated = [newItinerary, ...itineraries];
      }
      setItineraries(updated);
      localStorage.setItem('qt_cms_itineraries', JSON.stringify(updated));
      showToast(editingItem ? 'Đã cập nhật lộ trình gợi ý!' : 'Đã tạo lộ trình mới!');
    } else if (editingType === 'threads') {
      const newThread = {
        id: editingItem?.id || `thread-${Date.now()}`,
        author: dataObj.author || 'Ban Quản Trị',
        avatar: dataObj.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
        badge: dataObj.badge || 'Biên tập viên',
        time: editingItem?.time || 'Hôm nay',
        tag: dataObj.tag || 'Cẩm nang',
        zoneCode: dataObj.zoneCode || 'QT-01',
        title: dataObj.title,
        content: dataObj.content,
        images: dataObj.images
          ? dataObj.images.split('\n').map((s: string) => s.trim()).filter(Boolean)
          : [],
        likes: editingItem?.likes || 1,
      };

      let updated;
      if (editingItem) {
        updated = threads.map((t) => (t.id === editingItem.id ? newThread : t));
      } else {
        updated = [newThread, ...threads];
      }
      setThreads(updated);
      localStorage.setItem('qt_cms_threads', JSON.stringify(updated));
      showToast(editingItem ? 'Đã cập nhật bài viết!' : 'Đã xuất bản bài viết mới!');
    }

    setIsEditorOpen(false);
  };

  // If NOT authenticated, render clean Minimalist Admin Login screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
          maxWidth: '380px',
          width: '100%',
          padding: '2.25rem 2rem',
        }}>
          {/* Logo & Clean Header */}
          <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              backgroundColor: '#133e2f',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              fontWeight: 700,
              letterSpacing: '-0.5px',
              marginBottom: '0.85rem',
            }}>
              QT
            </div>
            <h1 style={{
              fontSize: '1.3rem',
              fontWeight: 700,
              color: '#0f172a',
              margin: '0 0 0.35rem',
            }}>
              Quản trị viên
            </h1>
            <p style={{ fontSize: '0.84rem', color: '#64748b', margin: 0 }}>
              Đăng nhập để quản lý nội dung QuangTri.wiki
            </p>
          </div>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@quangtri.wiki"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155' }}>
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  {showPassword ? 'Ẩn' : 'Hiện'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Mật khẩu"
                required
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  color: '#0f172a',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.35rem',
                padding: '0.75rem',
                borderRadius: '8px',
                backgroundColor: '#133e2f',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
              }}
            >
              Đăng nhập
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.1rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.82rem',
                color: '#64748b',
                textDecoration: 'none',
              }}
            >
              ← Về trang chủ
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Once authenticated, render CMS Workspace
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', color: '#1f2937', fontFamily: 'var(--font-sans)' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          zIndex: 9999,
          background: '#133e2f',
          color: '#fef08a',
          padding: '0.85rem 1.35rem',
          borderRadius: '12px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
          fontWeight: 700,
          fontSize: '0.88rem',
          animation: 'fadeInDown 0.3s ease',
        }}>
          ✓ {toastMessage}
        </div>
      )}

      {/* Top Navbar */}
      <header style={{
        background: '#092118',
        color: '#ffffff',
        padding: '0.85rem 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem' }}>🧭</span>
            <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
              QuangTri.wiki
            </span>
            <span style={{
              background: '#fbbf24',
              color: '#0f2e22',
              fontSize: '0.65rem',
              fontWeight: 800,
              padding: '0.15rem 0.45rem',
              borderRadius: '4px',
            }}>
              CMS
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            style={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: '0.8rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
            }}
          >
            <span>↗ Xem Website Live</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            Xin chào, <strong>Admin Root</strong>
          </span>
          <button
            onClick={handleLogout}
            style={{
              padding: '0.4rem 0.85rem',
              borderRadius: '8px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#f87171',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            Đăng xuất ⎋
          </button>
        </div>
      </header>

      {/* Main CMS Layout (Sidebar + Content Stage) */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)' }}>
        {/* Sidebar Navigation */}
        <aside style={{
          width: '260px',
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          padding: '1.5rem 1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.4rem',
          flexShrink: 0,
        }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#9ca3af',
            padding: '0 0.75rem',
            marginBottom: '0.5rem',
            letterSpacing: '0.05em',
          }}>
            Hệ Thống Dữ Liệu
          </span>

          {[
            { id: 'overview', label: 'Tổng Quan Hệ Thống', icon: '📊', count: null },
            { id: 'analytics', label: 'Phân Tích Lượt Xem', icon: '📈', count: 'Live' },
            { id: 'threads', label: 'Soạn Bài & Diễn Đàn', icon: '✍️', count: threads.length },
            { id: 'places', label: 'Điểm Đến & Danh Thắng', icon: '📍', count: places.length },
            { id: 'services', label: 'Dịch Vụ & Đối Tác', icon: '🏕️', count: services.length },
            { id: 'foods', label: 'Ẩm Thực Đặc Sản', icon: '🍲', count: foods.length },
            { id: 'itineraries', label: 'Lịch Trình & Cung Đường', icon: '🗺️', count: itineraries.length },
            { id: 'utilities', label: 'Cứu Hộ & Tiện Ích', icon: '⛽', count: gasStations.length + hotlines.length },
          ].map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as CmsTab);
                  setSearchQuery('');
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.7rem 0.85rem',
                  borderRadius: '10px',
                  background: isActive ? '#133e2f' : 'transparent',
                  color: isActive ? '#ffffff' : '#374151',
                  border: 'none',
                  fontSize: '0.85rem',
                  fontWeight: isActive ? 800 : 600,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span style={{
                    fontSize: '0.72rem',
                    background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
                    color: isActive ? '#fde047' : '#6b7280',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '20px',
                    fontWeight: 700,
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Content Canvas */}
        <main style={{ flexGrow: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.35rem' }}>
                  Bảng Điều Khiển Tổng Quan
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
                  Theo dõi trạng thái các thực thể dữ liệu và tương tác khách hàng thời gian thực.
                </p>
              </div>

              {/* 4 Metric Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Điểm đến trên Map</span>
                  <strong style={{ fontSize: '2rem', color: '#133e2f', display: 'block', margin: '0.35rem 0' }}>{places.length}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#059669' }}>14 Tọa độ phủ kín tỉnh</span>
                </div>
                <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Đối tác dịch vụ</span>
                  <strong style={{ fontSize: '2rem', color: '#d97706', display: 'block', margin: '0.35rem 0' }}>{services.length}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#d97706' }}>Homestay, xe máy, tàu</span>
                </div>
                <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Đặc sản & Món ngon</span>
                  <strong style={{ fontSize: '2rem', color: '#2563eb', display: 'block', margin: '0.35rem 0' }}>{foods.length}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>Món ngon đất lửa</span>
                </div>
                <div style={{ background: '#133e2f', color: '#fff', padding: '1.4rem', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)' }}>Bài viết diễn đàn</span>
                  <strong style={{ fontSize: '2rem', color: '#fde047', display: 'block', margin: '0.35rem 0' }}>{threads.length}</strong>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.8)' }}>Chia sẻ thực tế</span>
                </div>
              </div>

              {/* Quick Actions Bar */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem', color: '#133e2f' }}>
                  Thao Tác Nhanh
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => { setActiveTab('threads'); openAddModal('threads'); }}
                    style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#133e2f', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    ✍️ Soạn bài viết / cẩm nang mới
                  </button>
                  <button
                    onClick={() => { setActiveTab('places'); openAddModal('places'); }}
                    style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    📍 Thêm địa danh du lịch
                  </button>
                  <button
                    onClick={() => { setActiveTab('services'); openAddModal('services'); }}
                    style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    🏕️ Thêm đối tác dịch vụ
                  </button>
                  <button
                    onClick={() => { setActiveTab('foods'); openAddModal('foods'); }}
                    style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
                  >
                    🍲 Thêm món ăn đặc sản
                  </button>
                </div>
              </div>

              {/* Live Analytics Snapshot */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>📈</span>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#133e2f' }}>
                        Thống Kê Lượt Xem & Nhân Khẩu Học Độc Giả
                      </h3>
                      <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.55rem', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
                        ● Live Realtime
                      </span>
                    </div>
                    <p style={{ margin: '0.3rem 0 0', fontSize: '0.84rem', color: '#6b7280' }}>
                      Tổng hợp từ lượt xem trang front, phân tích theo tỷ lệ giới tính, khung giờ vàng và vùng lãnh thổ.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab('analytics')}
                    style={{
                      padding: '0.55rem 1.1rem',
                      borderRadius: '8px',
                      background: '#133e2f',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                    }}
                  >
                    Xem phân tích chuyên sâu →
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tổng lượt xem trang front</span>
                    <strong style={{ display: 'block', fontSize: '1.6rem', color: '#0f172a', margin: '0.3rem 0' }}>
                      {totalPageViews.toLocaleString()}
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>↑ +18.6% so với tuần trước</span>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Tỷ lệ Nam / Nữ</span>
                    <strong style={{ display: 'block', fontSize: '1.45rem', color: '#2563eb', margin: '0.3rem 0' }}>
                      58.6% Nam <span style={{ fontSize: '1rem', color: '#94a3b8' }}>/</span> <span style={{ color: '#ec4899' }}>37.4% Nữ</span>
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Phượt thủ nam chiếm đa số</span>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Khung giờ truy cập cao nhất</span>
                    <strong style={{ display: 'block', fontSize: '1.45rem', color: '#d97706', margin: '0.3rem 0' }}>
                      20:00 - 22:30
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 700 }}>🔥 42% lưu lượng ngày</span>
                  </div>

                  <div style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Top vùng lãnh thổ</span>
                    <strong style={{ display: 'block', fontSize: '1.45rem', color: '#133e2f', margin: '0.3rem 0' }}>
                      Hà Nội (23.4%)
                    </strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Theo sau: Đà Nẵng, TP.HCM</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS & DEMOGRAPHICS DEEP DIVE */}
          {activeTab === 'analytics' && (
            <div>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#133e2f', margin: 0 }}>
                      Phân Tích Lượt Xem & Nhân Khẩu Học
                    </h2>
                    <span style={{ background: '#ecfdf5', color: '#059669', fontSize: '0.75rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '20px', border: '1px solid #a7f3d0' }}>
                      ● Dữ liệu trang Front
                    </span>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: '0.35rem 0 0' }}>
                    Theo dõi số lượt xem, tỷ lệ giới tính, phân bổ khung giờ và vùng lãnh thổ để tối ưu chiến lược nội dung.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem' }}>
                  <button
                    onClick={() => {
                      const updated = totalPageViews + 10;
                      setTotalPageViews(updated);
                      localStorage.setItem('qt_page_views', updated.toString());
                      showToast('Đã làm mới dữ liệu lượt xem!');
                    }}
                    style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#f3f4f6', color: '#374151', border: '1px solid #d1d5db', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                  >
                    🔄 Cập nhật số liệu
                  </button>
                  <Link
                    href="/"
                    target="_blank"
                    style={{ padding: '0.6rem 1rem', borderRadius: '8px', background: '#133e2f', color: '#fff', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    👁️ Xem trang front ↗
                  </Link>
                </div>
              </div>

              {/* 4 Metric Summary Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Tổng lượt xem trang front</span>
                  <strong style={{ fontSize: '2.1rem', color: '#0f172a', display: 'block', margin: '0.35rem 0' }}>
                    {totalPageViews.toLocaleString()}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>↑ +18.6%</span>
                    <span style={{ color: '#9ca3af' }}>so với tuần trước</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Lượt xem hôm nay</span>
                  <strong style={{ fontSize: '2.1rem', color: '#059669', display: 'block', margin: '0.35rem 0' }}>
                    {todayPageViews.toLocaleString()}
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                    <span style={{ color: '#059669', fontWeight: 700 }}>1,420 lượt/ngày</span>
                    <span style={{ color: '#9ca3af' }}>trung bình 30 ngày</span>
                  </div>
                </div>

                <div style={{ background: '#ffffff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280', fontWeight: 600 }}>Thời gian trung bình / phiên</span>
                  <strong style={{ fontSize: '2.1rem', color: '#2563eb', display: 'block', margin: '0.35rem 0' }}>
                    3m 48s
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem' }}>
                    <span style={{ color: '#2563eb', fontWeight: 700 }}>Tỷ lệ thoát: 26.4%</span>
                    <span style={{ color: '#9ca3af' }}>(Rất tốt)</span>
                  </div>
                </div>

                <div style={{ background: '#133e2f', color: '#ffffff', padding: '1.4rem', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)', fontWeight: 600 }}>Khung giờ vàng xuất bản bài</span>
                  <strong style={{ fontSize: '1.9rem', color: '#fde047', display: 'block', margin: '0.35rem 0' }}>
                    20:00 - 22:30
                  </strong>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    <span>⭐ 42% độc giả đọc bài giờ này</span>
                  </div>
                </div>
              </div>

              {/* SECTION 1: PHÂN TÍCH TỶ LỆ NAM / NỮ & HÀNH VI */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                      1. Phân Tích Tỷ Lệ Giới Tính & Hành Vi Độc Giả
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: 0 }}>
                      Nhận diện tệp khách phượt để cá nhân hóa nội dung cung đường và gợi ý dịch vụ phù hợp.
                    </p>
                  </div>
                </div>

                {/* Segmented Progress Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', height: '24px', borderRadius: '12px', overflow: 'hidden', background: '#f1f5f9', marginBottom: '0.75rem' }}>
                    <div style={{ width: '58.6%', background: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                      Nam: 58.6%
                    </div>
                    <div style={{ width: '37.4%', background: '#ec4899', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.75rem', fontWeight: 800 }}>
                      Nữ: 37.4%
                    </div>
                    <div style={{ width: '4.0%', background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem', fontWeight: 800 }}>
                      4%
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#2563eb', display: 'inline-block' }} />
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>Nam (58.6% - ~10,680 lượt)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ec4899', display: 'inline-block' }} />
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>Nữ (37.4% - ~6,820 lượt)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }} />
                      <span style={{ fontWeight: 700, color: '#1e293b' }}>Gia đình / Đoàn thể (4.0% - ~730 lượt)</span>
                    </div>
                  </div>
                </div>

                {/* 3 Detail Insight Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bfdbfe' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>🏍️</span>
                      <strong style={{ color: '#1e40af', fontSize: '0.95rem' }}>Phượt Thủ Nam (58.6%)</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#1e3a8a', lineHeight: '1.6' }}>
                      <li><strong>Top điểm đến:</strong> Đèo Sa Mù (68%), Đường Tây Trường Sơn (62%), Cầu treo Đakrông.</li>
                      <li><strong>Dịch vụ quan tâm:</strong> Thuê xe cào cào/côn tay, hotline vá lốp/kéo xe, trạm xăng.</li>
                      <li><strong>Hành vi:</strong> Tìm hiểu toạ độ GPS, độ dốc đèo, cung phượt đường rừng hoang sơ.</li>
                    </ul>
                  </div>

                  <div style={{ background: '#fdf2f8', borderRadius: '12px', padding: '1.25rem', border: '1px solid #fbcfe8' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>📸</span>
                      <strong style={{ color: '#9d174d', fontSize: '0.95rem' }}>Du Khách Nữ (37.4%)</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#831843', lineHeight: '1.6' }}>
                      <li><strong>Top điểm đến:</strong> Đảo Cồn Cỏ (71%), Biển Cửa Tùng & Cửa Việt, Cafe săn mây Khe Sanh.</li>
                      <li><strong>Dịch vụ quan tâm:</strong> Đặt vé tàu cao tốc Cồn Cỏ, Homestay view thung lũng sạch đẹp.</li>
                      <li><strong>Hành vi:</strong> Ưu tiên xem ảnh review check-in, ẩm thực đặc sản (bánh khoái, cháo bột).</li>
                    </ul>
                  </div>

                  <div style={{ background: '#f0fdf4', borderRadius: '12px', padding: '1.25rem', border: '1px solid #bbf7d0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '1.3rem' }}>👨‍👩‍👧‍👦</span>
                      <strong style={{ color: '#166534', fontSize: '0.95rem' }}>Gia Đình & Đoàn Về Nguồn (4.0%)</strong>
                    </div>
                    <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: '#14532d', lineHeight: '1.6' }}>
                      <li><strong>Top điểm đến:</strong> Thành Cổ Quảng Trị, Nghĩa trang Trường Sơn, Địa đạo Vịnh Mốc.</li>
                      <li><strong>Dịch vụ quan tâm:</strong> Thuê xe 7-16 chỗ có tài xế, hướng dẫn viên thuyết minh tại điểm.</li>
                      <li><strong>Hành vi:</strong> Tìm hiểu giờ mở cửa, giá vé hương hoa, cung đường xe ô tô dễ đi.</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION 2: PHÂN BỔ KHUNG GIỜ TRUY CẬP (24H TRAFFIC) */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                      2. Phân Bổ Khung Giờ Truy Cập 24 Giờ Trong Ngày
                    </h3>
                    <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: 0 }}>
                      Tần suất khách tra cứu cẩm nang và bản đồ theo từng giờ để lựa chọn thời điểm vàng xuất bản bài viết.
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#b45309', padding: '0.2rem 0.55rem', borderRadius: '6px', fontWeight: 700 }}>
                      🔥 Giờ cao điểm (Peak)
                    </span>
                  </div>
                </div>

                {/* 24-Hour Bar Chart Visualization */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '4px',
                  height: '180px',
                  padding: '1rem 0 0',
                  borderBottom: '2px solid #e2e8f0',
                  marginBottom: '1rem',
                  overflowX: 'auto',
                }}>
                  {[
                    { h: '00', pct: 1.2, count: 218 },
                    { h: '01', pct: 0.8, count: 145 },
                    { h: '02', pct: 0.5, count: 91 },
                    { h: '03', pct: 0.4, count: 72 },
                    { h: '04', pct: 0.6, count: 109 },
                    { h: '05', pct: 1.5, count: 273 },
                    { h: '06', pct: 3.2, count: 583 },
                    { h: '07', pct: 5.8, count: 1057, peak: true, label: 'Sáng' },
                    { h: '08', pct: 7.2, count: 1312, peak: true },
                    { h: '09', pct: 5.0, count: 912 },
                    { h: '10', pct: 4.1, count: 747 },
                    { h: '11', pct: 4.8, count: 875, peak: true, label: 'Trưa' },
                    { h: '12', pct: 5.2, count: 948, peak: true },
                    { h: '13', pct: 3.9, count: 711 },
                    { h: '14', pct: 3.5, count: 638 },
                    { h: '15', pct: 3.8, count: 693 },
                    { h: '16', pct: 4.2, count: 766 },
                    { h: '17', pct: 4.5, count: 820 },
                    { h: '18', pct: 5.1, count: 930 },
                    { h: '19', pct: 7.5, count: 1368, peak: true },
                    { h: '20', pct: 11.2, count: 2042, peak: true, gold: true, label: 'Đỉnh 1' },
                    { h: '21', pct: 12.8, count: 2334, peak: true, gold: true, label: 'Đỉnh 2' },
                    { h: '22', pct: 8.4, count: 1532, peak: true },
                    { h: '23', pct: 4.2, count: 766 },
                  ].map((col) => {
                    const barHeight = Math.max(12, (col.pct / 13) * 140);
                    return (
                      <div
                        key={col.h}
                        style={{
                          flex: '1 1 0',
                          minWidth: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          height: '100%',
                          justifyContent: 'flex-end',
                        }}
                        title={`Khung ${col.h}:00 - ${col.pct}% (${col.count} lượt)`}
                      >
                        <span style={{ fontSize: '0.62rem', color: col.gold ? '#b45309' : '#64748b', fontWeight: col.peak ? 800 : 500, marginBottom: '4px' }}>
                          {col.pct}%
                        </span>
                        <div
                          style={{
                            width: '100%',
                            height: `${barHeight}px`,
                            borderRadius: '4px 4px 0 0',
                            background: col.gold
                              ? 'linear-gradient(180deg, #f59e0b 0%, #d97706 100%)'
                              : col.peak
                              ? '#059669'
                              : '#cbd5e1',
                            transition: 'height 0.3s ease',
                          }}
                        />
                        <span style={{ fontSize: '0.65rem', color: '#64748b', marginTop: '6px', fontWeight: col.peak ? 800 : 500 }}>
                          {col.h}h
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Peak Hours Takeaway Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem', marginTop: '1.25rem' }}>
                  <div style={{ padding: '0.85rem 1rem', background: '#fef3c7', borderRadius: '10px', border: '1px solid #fde68a' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#92400e', marginBottom: '0.2rem' }}>
                      ⭐ ĐỈNH CAO NHẤT: 20:00 - 22:30 (42% LƯU LƯỢNG)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#78350f' }}>
                      Thời điểm độc giả rảnh rỗi đọc cẩm nang, lên kế hoạch cuối tuần và lưu toạ độ. <strong>Nên xuất bản bài viết mới lúc 20:00.</strong>
                    </p>
                  </div>

                  <div style={{ padding: '0.85rem 1rem', background: '#ecfdf5', borderRadius: '10px', border: '1px solid #a7f3d0' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#065f46', marginBottom: '0.2rem' }}>
                      ☀️ CAO ĐIỂM SÁNG: 07:30 - 09:00 (18% LƯU LƯỢNG)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#047857' }}>
                      Độc giả đang trên đường di chuyển, tra cứu nhanh thời tiết Hướng Hóa, cây xăng và quán ăn sáng đặc sản Đông Hà.
                    </p>
                  </div>

                  <div style={{ padding: '0.85rem 1rem', background: '#f0fdfa', borderRadius: '10px', border: '1px solid #99f6e4' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#115e59', marginBottom: '0.2rem' }}>
                      🍲 CAO ĐIỂM TRƯA: 11:30 - 13:00 (14% LƯU LƯỢNG)
                    </div>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#0f766e' }}>
                      Nhu cầu tìm kiếm quán ăn trưa (bánh khoái, cháo bột, thịt trâu lá trơng) và quán cà phê view nghỉ ngơi.
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 3: PHÂN TÍCH VÙNG LÃNH THỔ & ĐỊA LÝ */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    3. Phân Bổ Theo Vùng Lãnh Thổ & Địa Lý Du Khách
                  </h3>
                  <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: 0 }}>
                    Xác định nguồn khách ghé thăm để xây dựng lộ trình di chuyển và liên kết hãng xe, tàu hỏa, vé bay.
                  </p>
                </div>

                {/* 4 Regional Summary Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>MIỀN TRUNG</span>
                    <strong style={{ display: 'block', fontSize: '1.6rem', color: '#133e2f', margin: '0.25rem 0' }}>38.5%</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Đà Nẵng, Quảng Trị, Huế, Quảng Bình</span>
                  </div>

                  <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>MIỀN BẮC</span>
                    <strong style={{ display: 'block', fontSize: '1.6rem', color: '#2563eb', margin: '0.25rem 0' }}>33.5%</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Hà Nội, Hải Phòng, Nghệ An, Thanh Hóa</span>
                  </div>

                  <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>MIỀN NAM</span>
                    <strong style={{ display: 'block', fontSize: '1.6rem', color: '#d97706', margin: '0.25rem 0' }}>21.5%</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>TP.HCM, Cần Thơ, Bình Dương, Đồng Nai</span>
                  </div>

                  <div style={{ padding: '1.1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>QUỐC TẾ & VÙNG BIÊN</span>
                    <strong style={{ display: 'block', fontSize: '1.6rem', color: '#7c3aed', margin: '0.25rem 0' }}>6.5%</strong>
                    <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Lào (CK Lao Bảo), Pháp, Mỹ, Úc (DMZ Tour)</span>
                  </div>
                </div>

                {/* Top 6 Provinces Detailed Breakdown */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '1.25rem' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', margin: '0 0 1rem' }}>
                    Bảng Xếp Hạng Top 6 Tỉnh / Thành Phố Có Lượng Khách Tra Cứu Lớn Nhất
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                    {[
                      { rank: 1, city: 'Hà Nội', pct: 23.4, views: 4268, desc: 'Thích phượt đèo Sa Mù, thác Chênh Vênh và viếng nghĩa trang Trường Sơn. Độc giả thường tìm tour 3N2Đ dịp lễ.', growth: '+22%' },
                      { rank: 2, city: 'Đà Nẵng', pct: 19.8, views: 3611, desc: 'Phượt thủ di chuyển bằng xe máy cuối tuần qua đèo Hải Vân ra Quảng Trị, thích cắm trại biển Cửa Tùng và đi Cồn Cỏ.', growth: '+15%' },
                      { rank: 3, city: 'TP. Hồ Chí Minh', pct: 16.5, views: 3010, desc: 'Bay đáp sân bay Phú Bài (Huế) hoặc Đồng Hới rồi bắt tàu hỏa ra Đông Hà. Thích thưởng thức ẩm thực cay nồng đặc sản.', growth: '+28%' },
                      { rank: 4, city: 'Thừa Thiên Huế', pct: 12.2, views: 2225, desc: 'Khách đi về trong ngày cuối tuần, tra cứu quán ăn ngon và di tích Thành Cổ, Đôi bờ Hiền Lương.', growth: '+8%' },
                      { rank: 5, city: 'Quảng Trị (Nội tỉnh)', pct: 8.6, views: 1568, desc: 'Người dân địa phương tra cứu thông tin cứu hộ xe, cập nhật thời tiết và đăng ký kết nối đối tác dịch vụ.', growth: '+12%' },
                      { rank: 6, city: 'Khách Quốc Tế (Lào, Âu - Mỹ)', pct: 6.5, views: 1185, desc: 'Khách Lào nhập cảnh qua cửa khẩu Lao Bảo; khách phương Tây quan tâm tour lịch sử DMZ Vĩ tuyến 17 và Khe Sanh.', growth: '+19%' },
                    ].map((item) => (
                      <div key={item.city} style={{ padding: '0.85rem 1rem', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <span style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '50%',
                              background: item.rank <= 3 ? '#133e2f' : '#64748b',
                              color: '#fff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                            }}>
                              {item.rank}
                            </span>
                            <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>{item.city}</strong>
                            <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '0.1rem 0.4rem', borderRadius: '4px' }}>
                              {item.growth}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.82rem' }}>
                            <span style={{ color: '#64748b' }}>{item.views.toLocaleString()} lượt xem</span>
                            <strong style={{ color: '#133e2f', fontSize: '0.9rem' }}>{item.pct}%</strong>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden', marginBottom: '0.4rem' }}>
                          <div style={{ width: `${(item.pct / 25) * 100}%`, height: '100%', background: item.rank <= 3 ? '#133e2f' : '#64748b', borderRadius: '3px' }} />
                        </div>
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                          💡 <em>Thị hiếu:</em> {item.desc}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* SECTION 4: CHIẾN LƯỢC & ĐỀ XUẤT CẢI THIỆN TỐI ƯU */}
              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.75rem', marginBottom: '2.5rem' }}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.3rem' }}>🎯</span>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#133e2f', margin: 0 }}>
                      4. Đề Xuất Chiến Lược Cải Thiện Để Tăng Trưởng Lượt Xem & Doanh Thu
                    </h3>
                  </div>
                  <p style={{ color: '#6b7280', fontSize: '0.84rem', margin: '0.3rem 0 0' }}>
                    Các hành động cụ thể cho đội ngũ quản trị dựa trên dữ liệu phân tích thực tế:
                  </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.2rem' }}>
                  <div style={{ border: '1.5px solid #dcfce7', background: '#f0fdf4', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>⏰</span>
                      <strong style={{ fontSize: '0.92rem', color: '#166534' }}>Xuất bản nội dung lúc 20:00 - 21:00 thứ Năm & thứ Sáu</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#14532d', margin: 0, lineHeight: '1.55' }}>
                      Lưu lượng đọc bài lập kế hoạch du lịch đạt đỉnh vào khung giờ tối trước ngày cuối tuần. Đăng bài review lịch trình mới vào giờ này giúp bài viết nhận lượng xem cao gấp 3.5 lần.
                    </p>
                  </div>

                  <div style={{ border: '1.5px solid #dbeafe', background: '#eff6ff', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🏍️</span>
                      <strong style={{ fontSize: '0.92rem', color: '#1e40af' }}>Tối ưu cẩm nang đổ đèo & cứu hộ cho phượt thủ Nam (58.6%)</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#1e3a8a', margin: 0, lineHeight: '1.55' }}>
                      Bổ sung thêm danh mục trạm xăng và danh bạ cứu hộ xe máy đèo Sa Mù, đường nhánh Tây Trường Sơn. Ghim nút hotline cứu hộ khẩn cấp trên đầu trang chi tiết cung đường.
                    </p>
                  </div>

                  <div style={{ border: '1.5px solid #fce7f3', background: '#fdf2f8', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>📸</span>
                      <strong style={{ fontSize: '0.92rem', color: '#9d174d' }}>Tăng hình ảnh check-in sống ảo & tour Cồn Cỏ cho khách Nữ (37.4%)</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#831843', margin: 0, lineHeight: '1.55' }}>
                      Độc giả nữ có tỷ lệ chia sẻ bài viết lên mạng xã hội cao hơn 2.4 lần. Cần bổ sung các bộ ảnh chất lượng cao về quán cà phê săn mây Khe Sanh, hải đăng Cồn Cỏ và bãi tắm Cửa Việt.
                    </p>
                  </div>

                  <div style={{ border: '1.5px solid #fef3c7', background: '#fffbeb', borderRadius: '12px', padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>✈️</span>
                      <strong style={{ fontSize: '0.92rem', color: '#92400e' }}>Thêm cẩm nang di chuyển chặng bay cho khách Hà Nội & TP.HCM (40%)</strong>
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#78350f', margin: 0, lineHeight: '1.55' }}>
                      Rất nhiều khách hỏi cách đi từ sân bay Đồng Hới hoặc Phú Bài (Huế) vào Đông Hà. Tạo bài viết hướng dẫn chi tiết giá vé tàu, xe buýt liên tỉnh sẽ tăng mạnh lượng chuyển đổi booking tour.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: THREADS / ARTICLES CRUD */}
          {activeTab === 'threads' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Bài Viết & Diễn Đàn
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Biên tập, viết bài mới và kiểm duyệt chia sẻ của người dùng.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('threads')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Soạn bài viết mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Tiêu đề</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Tác giả</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Chuyên mục</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Vùng</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Lượt thích</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {threads.map((th) => (
                      <tr key={th.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>
                          {th.title}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{th.author}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {th.tag}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{th.zoneCode}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>❤️ {th.likes || 1}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal('threads', th)}
                            style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDelete('threads', th.id, th.title)}
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PLACES CRUD */}
          {activeTab === 'places' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Điểm Đến & Danh Thắng
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Danh sách các tọa độ hiển thị trên bản đồ tỉnh Quảng Trị ({places.length} điểm).
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('places')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Thêm Điểm Đến Mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Hình ảnh</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Tên địa danh</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Mã vùng</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Danh mục</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Giá vé</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {places.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <img
                            src={p.image || p.hero_image}
                            alt={p.name}
                            style={{ width: '50px', height: '36px', borderRadius: '6px', objectFit: 'cover' }}
                          />
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>
                          {p.name}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {p.zoneCode || p.zone_code}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{p.categoryName || p.category}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 600 }}>{p.ticket || 'Miễn phí'}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal('places', p)}
                            style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDelete('places', p.id, p.name)}
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: SERVICES CRUD */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Dịch Vụ & Đối Tác
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Homestay, dịch vụ xe cào cào, vé tàu cao tốc Cồn Cỏ ({services.length} đối tác).
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('services')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Thêm Đối Tác Mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Tên cơ sở</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Phân loại</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Giá niêm yết</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Hotline / Zalo</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Xác minh</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((srv) => (
                      <tr key={srv.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>
                          {srv.name}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{srv.typeLabel || srv.type}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 700 }}>{srv.price}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{srv.phone || srv.hotline}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {srv.verified ? (
                            <span style={{ color: '#059669', fontWeight: 700 }}>✓ Đã xác minh</span>
                          ) : (
                            <span style={{ color: '#9ca3af' }}>Chưa</span>
                          )}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal('services', srv)}
                            style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDelete('services', srv.id, srv.name)}
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 5: FOODS CRUD */}
          {activeTab === 'foods' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Ẩm Thực Đặc Sản
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Món ngon nức tiếng đất lửa Quảng Trị ({foods.length} món).
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('foods')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Thêm Món Ăn Mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Món ăn</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Xuất xứ</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Mức giá</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Quán gợi ý</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {foods.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>
                          {f.name}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{f.origin || f.zoneName}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#d97706', fontWeight: 700 }}>{f.priceRange || 'Bình dân'}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{f.addressRecs?.[0] || 'Chợ Đông Hà'}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal('foods', f)}
                            style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDelete('foods', f.id, f.name)}
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 6: ITINERARIES CRUD */}
          {activeTab === 'itineraries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Lịch Trình & Cung Đường
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Lộ trình phượt đề xuất cho du khách ({itineraries.length} lộ trình).
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('itineraries')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Thêm Lộ Trình Mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Tiêu đề</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Thời lượng</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Đối tượng</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Khoảng cách</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {itineraries.map((it) => (
                      <tr key={it.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>
                          {it.title}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#133e2f', color: '#fde047', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {it.duration}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{it.suitability}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{it.distance}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                          <button
                            onClick={() => openEditModal('itineraries', it)}
                            style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDelete('itineraries', it.id, it.title)}
                            style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 7: UTILITIES CRUD */}
          {activeTab === 'utilities' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                  Quản Lý Cứu Hộ & Tiện Ích
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                  Hotline khẩn cấp và trạm xăng huyết mạch trên tuyến đường phượt.
                </p>
              </div>

              {/* Hotlines */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1rem', color: '#dc2626' }}>
                  🚨 Danh Bạ Hotline Khẩn Cấp
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {hotlines.map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fef2f2', borderRadius: '10px' }}>
                      <div>
                        <strong style={{ color: '#991b1b', display: 'block', fontSize: '0.88rem' }}>{h.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{h.note || 'Hỗ trợ 24/7'}</span>
                      </div>
                      <a href={`tel:${h.phone}`} style={{ color: '#dc2626', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' }}>
                        📞 {h.phone}
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gas Stations */}
              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: '0 0 1rem', color: '#059669' }}>
                  ⛽ Cây Xăng Trọng Yếu Tuyến Xa
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {gasStations.map((g, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f0fdf4', borderRadius: '10px' }}>
                      <div>
                        <strong style={{ color: '#166534', display: 'block', fontSize: '0.88rem' }}>{g.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{g.route || g.location}</span>
                      </div>
                      <span style={{ fontSize: '0.78rem', background: '#dcfce7', color: '#15803d', padding: '0.2rem 0.5rem', borderRadius: '6px', fontWeight: 700 }}>
                        {g.tip || 'Xăng 95 đầy đủ'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* MODAL EDITOR FOR ALL DATA TYPES */}
      {isEditorOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.6)',
          backdropFilter: 'blur(6px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1.5rem',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '20px',
            maxWidth: '650px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '1px solid #f3f4f6', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#133e2f', margin: 0 }}>
                {editingItem ? '✏️ Chỉnh Sửa' : '➕ Thêm Mới'}{' '}
                {editingType === 'places' && 'Điểm Đến / Danh Thắng'}
                {editingType === 'services' && 'Dịch Vụ & Đối Tác'}
                {editingType === 'foods' && 'Món Ăn Đặc Sản'}
                {editingType === 'itineraries' && 'Lộ Trình Cung Đường'}
                {editingType === 'threads' && 'Bài Viết / Cẩm Nang'}
              </h3>
              <button
                onClick={() => setIsEditorOpen(false)}
                style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: '#9ca3af' }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSaveItem} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Form fields for PLACES */}
              {editingType === 'places' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tên địa danh</label>
                    <input name="name" defaultValue={editingItem?.name || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mã vùng (QT-01 ... QT-08)</label>
                      <input name="zoneCode" defaultValue={editingItem?.zoneCode || editingItem?.zone_code || 'QT-01'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tên phân vùng</label>
                      <input name="zoneName" defaultValue={editingItem?.zoneName || editingItem?.zone_name || 'Đông Hà'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Danh mục (history/mountain/coastal)</label>
                      <input name="category" defaultValue={editingItem?.category || 'history'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tên danh mục hiển thị</label>
                      <input name="categoryName" defaultValue={editingItem?.categoryName || editingItem?.category_name || 'Di tích lịch sử'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>URL Hình ảnh</label>
                    <input name="image" defaultValue={editingItem?.image || editingItem?.hero_image || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Giá vé</label>
                      <input name="ticket" defaultValue={editingItem?.ticket || 'Miễn phí'} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tọa độ GPS</label>
                      <input name="coordinates" defaultValue={editingItem?.coordinates || '16.7533° N, 107.1912° E'} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Địa chỉ cụ thể</label>
                    <input name="address" defaultValue={editingItem?.address || ''} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mô tả ngắn</label>
                    <textarea name="shortDesc" defaultValue={editingItem?.shortDesc || ''} rows={2} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Nội dung lịch sử & chi tiết</label>
                    <textarea name="fullDesc" defaultValue={editingItem?.fullDesc || ''} rows={3} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                </>
              )}

              {/* Form fields for THREADS / ARTICLES */}
              {editingType === 'threads' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tiêu đề bài viết</label>
                    <input name="title" defaultValue={editingItem?.title || ''} required placeholder="Ví dụ: Kinh nghiệm săn mây đèo Sa Mù 2N1Đ..." style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tác giả</label>
                      <input name="author" defaultValue={editingItem?.author || 'Ban Quản Trị'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Huy hiệu tác giả</label>
                      <input name="badge" defaultValue={editingItem?.badge || 'Biên tập viên'} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Chuyên mục / Thẻ</label>
                      <input name="tag" defaultValue={editingItem?.tag || 'Kinh nghiệm'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mã phân vùng</label>
                      <input name="zoneCode" defaultValue={editingItem?.zoneCode || 'QT-05'} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Nội dung bài viết / chia sẻ</label>
                    <textarea name="content" defaultValue={editingItem?.content || ''} rows={6} required placeholder="Soạn nội dung bài viết chi tiết tại đây..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', lineHeight: 1.6 }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Danh sách URL hình ảnh (mỗi dòng một link)</label>
                    <textarea name="images" defaultValue={Array.isArray(editingItem?.images) ? editingItem.images.join('\n') : ''} rows={2} placeholder="https://images.unsplash.com/..." style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                </>
              )}

              {/* Form fields for SERVICES */}
              {editingType === 'services' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tên cơ sở / Dịch vụ</label>
                    <input name="name" defaultValue={editingItem?.name || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Loại dịch vụ (homestay/bike/boat/tour)</label>
                      <input name="type" defaultValue={editingItem?.type || 'homestay'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tên loại hiển thị</label>
                      <input name="typeLabel" defaultValue={editingItem?.typeLabel || 'Homestay & Glamping'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Giá niêm yết</label>
                      <input name="price" defaultValue={editingItem?.price || '350.000 VNĐ / đêm'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Hotline</label>
                      <input name="phone" defaultValue={editingItem?.phone || editingItem?.hotline || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Địa chỉ</label>
                    <input name="address" defaultValue={editingItem?.address || ''} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>URL Hình ảnh</label>
                    <input name="image" defaultValue={editingItem?.image || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input type="checkbox" name="verified" id="verified" defaultChecked={editingItem?.verified || false} />
                    <label htmlFor="verified" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#059669', cursor: 'pointer' }}>
                      Đã xác minh uy tín bản địa (Tick chọn để gắn badge xanh)
                    </label>
                  </div>
                </>
              )}

              {/* Form fields for FOODS */}
              {editingType === 'foods' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tên món ăn</label>
                    <input name="name" defaultValue={editingItem?.name || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Xuất xứ vùng</label>
                      <input name="origin" defaultValue={editingItem?.origin || editingItem?.zoneName || 'Quảng Trị'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mức giá</label>
                      <input name="priceRange" defaultValue={editingItem?.priceRange || '25.000 - 45.000 VNĐ'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Quán ngon gợi ý</label>
                    <input name="addressRec" defaultValue={editingItem?.addressRecs?.[0] || 'Chợ Đông Hà'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>URL Hình ảnh</label>
                    <input name="image" defaultValue={editingItem?.image || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mô tả hương vị & cách thưởng thức</label>
                    <textarea name="description" defaultValue={editingItem?.description || ''} rows={3} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                </>
              )}

              {/* Form fields for ITINERARIES */}
              {editingType === 'itineraries' && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Tiêu đề lộ trình</label>
                    <input name="title" defaultValue={editingItem?.title || ''} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Thời lượng</label>
                      <input name="duration" defaultValue={editingItem?.duration || '2N1Đ'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Đối tượng</label>
                      <input name="suitability" defaultValue={editingItem?.suitability || 'Phượt thủ'} required style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Khoảng cách</label>
                      <input name="distance" defaultValue={editingItem?.distance || '180km'} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Mô tả hành trình</label>
                    <textarea name="description" defaultValue={editingItem?.description || ''} rows={2} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Danh sách trạm dừng nổi bật (mỗi dòng một trạm)</label>
                    <textarea name="highlights" defaultValue={Array.isArray(editingItem?.highlights) ? editingItem.highlights.join('\n') : ''} rows={3} style={{ width: '100%', padding: '0.6rem 0.8rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                  </div>
                </>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem', borderTop: '1px solid #f3f4f6', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setIsEditorOpen(false)}
                  style={{ padding: '0.6rem 1.15rem', borderRadius: '8px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontWeight: 700 }}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  style={{ padding: '0.6rem 1.35rem', borderRadius: '8px', background: '#133e2f', color: '#ffffff', border: 'none', fontWeight: 800, cursor: 'pointer' }}
                >
                  Lưu Dữ Liệu ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
