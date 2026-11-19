'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { QUANGTRI_DATA } from '@/lib/data';

type CmsTab = 'overview' | 'threads' | 'places' | 'services' | 'foods' | 'itineraries' | 'utilities';

export default function AdminClient() {
  // 1. Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState('admin@quangtri.wiki');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // 2. Active CMS Tab
  const [activeTab, setActiveTab] = useState<CmsTab>('overview');

  // 3. Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

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
    if (!passwordInput) {
      setAuthError('Vui lòng nhập mật khẩu quản trị');
      return;
    }
    // Accept standard default password 'quangtri2026' or 'admin' or 'admin123'
    if (passwordInput === 'quangtri2026' || passwordInput === 'admin' || passwordInput === 'admin123') {
      setIsAuthenticated(true);
      setAuthError('');
      localStorage.setItem('qt_admin_logged_in', 'true');
      showToast('Đăng nhập Quản trị viên thành công!');
    } else {
      setAuthError('Mật khẩu không chính xác. Gợi ý: quangtri2026 hoặc admin');
    }
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

  // If NOT authenticated, render Admin Login screen
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #092118 0%, #133e2f 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem',
        fontFamily: 'var(--font-sans)',
      }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '24px',
          boxShadow: '0 24px 60px rgba(0, 0, 0, 0.35)',
          maxWidth: '440px',
          width: '100%',
          padding: '2.5rem',
          position: 'relative',
        }}>
          {/* Logo & Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🔐</span>
            <h1 style={{
              fontFamily: 'Playfair Display, serif',
              fontSize: '1.85rem',
              color: '#133e2f',
              margin: '0 0 0.4rem',
              fontWeight: 800,
            }}>
              QuangTri.wiki CMS
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#6b7280', margin: 0 }}>
              Cổng Quản Trị Nội Dung & Vận Hành Hệ Thống
            </p>
          </div>

          {authError && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              marginBottom: '1.25rem',
              fontWeight: 600,
            }}>
              ⚠️ {authError}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#374151', marginBottom: '0.4rem' }}>
                Tài khoản Quản trị
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                placeholder="admin@quangtri.wiki"
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151' }}>
                  Mật khẩu
                </label>
                <button
                  type="button"
                  onClick={() => setPasswordInput('quangtri2026')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#059669',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  ⚡ Điền mật khẩu mẫu
                </button>
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Nhập mật khẩu..."
                required
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  border: '1.5px solid #d1d5db',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>

            <button
              type="submit"
              style={{
                marginTop: '0.5rem',
                padding: '0.85rem',
                borderRadius: '12px',
                background: '#133e2f',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.95rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 14px rgba(19, 62, 47, 0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              Đăng Nhập Vào CMS →
            </button>
          </form>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', borderTop: '1px solid #f3f4f6', paddingTop: '1.25rem' }}>
            <Link
              href="/"
              style={{
                fontSize: '0.82rem',
                color: '#6b7280',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              ← Quay lại trang chủ du lịch
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
            { id: 'overview', label: 'Tổng Quan & Thống Kê', icon: '📊', count: null },
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
