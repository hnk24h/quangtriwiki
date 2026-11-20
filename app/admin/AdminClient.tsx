'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdminLogin from './components/AdminLogin';
import AdminAnalyticsTab from './components/AdminAnalyticsTab';
import AdminPartnersTab from './components/AdminPartnersTab';
import AdminUsersTab from './components/AdminUsersTab';
import AdminEditorModal, { CmsEntityType } from './components/AdminEditorModal';
import type {
  AnalyticsSummary,
  BannerSlide,
  EmergencyHotline,
  Food,
  GasStation,
  GuidesData,
  Itinerary,
  PartnerRegistration,
  Place,
  Service,
  Thread,
  Zone,
} from '@/lib/supabase/types';

type CmsTab =
  | 'overview'
  | 'analytics'
  | 'banners'
  | 'zones'
  | 'threads'
  | 'places'
  | 'services'
  | 'registrations'
  | 'foods'
  | 'itineraries'
  | 'utilities'
  | 'users';

export default function AdminClient() {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [usingDefaultPassword, setUsingDefaultPassword] = useState(false);
  const [hideSecurityWarning, setHideSecurityWarning] = useState(false);

  const [activeTab, setActiveTab] = useState<CmsTab>('overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Analytics & Metrics State
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [metrics, setMetrics] = useState<{
    totalLeads: number;
    totalRegistrations: number;
    estimatedRevenue: string;
  } | null>(null);

  // CMS Entities State (Synced directly with Supabase APIs)
  const [bannerSlides, setBannerSlides] = useState<BannerSlide[]>([]);
  const [zones, setZones] = useState<Zone[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [foods, setFoods] = useState<Food[]>([]);
  const [itineraries, setItineraries] = useState<Itinerary[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [guidesData, setGuidesData] = useState<GuidesData>({
    bestTimeToVisit: [],
    packingChecklist: [],
    emergencyHotlines: [],
    gasStations: [],
  });
  const [registrations, setRegistrations] = useState<PartnerRegistration[]>([]);
  const [dataLoading, setDataLoading] = useState(false);

  // Modal Editor State
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingType, setEditingType] = useState<CmsEntityType | null>(null);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const loadAnalytics = useCallback(async () => {
    setAnalyticsLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      const data = await res.json();
      if (res.ok && data?.analytics) {
        setAnalytics(data.analytics);
      }
    } catch {
      // ignore network error
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  const loadRegistrations = useCallback(async () => {
    try {
      const res = await fetch('/api/partner-registrations');
      const data = await res.json();
      if (res.ok && Array.isArray(data?.registrations)) {
        setRegistrations(data.registrations);
      }
    } catch {
      // ignore
    }
  }, []);

  const loadAllCmsData = useCallback(async () => {
    setDataLoading(true);
    try {
      const [
        placesRes,
        servicesRes,
        foodsRes,
        itinRes,
        threadsRes,
        bannersRes,
        zonesRes,
        guidesRes,
        regRes,
        metricsRes,
      ] = await Promise.all([
        fetch('/api/places').then((r) => r.json()),
        fetch('/api/services').then((r) => r.json()),
        fetch('/api/foods').then((r) => r.json()),
        fetch('/api/itineraries').then((r) => r.json()),
        fetch('/api/threads').then((r) => r.json()),
        fetch('/api/banners').then((r) => r.json()),
        fetch('/api/zones').then((r) => r.json()),
        fetch('/api/guides').then((r) => r.json()),
        fetch('/api/partner-registrations').then((r) => r.json()),
        fetch('/api/admin/metrics').then((r) => r.json()),
      ]);

      if (Array.isArray(placesRes?.places)) setPlaces(placesRes.places);
      if (Array.isArray(servicesRes?.services)) setServices(servicesRes.services);
      if (Array.isArray(foodsRes?.foods)) setFoods(foodsRes.foods);
      if (Array.isArray(itinRes?.itineraries)) setItineraries(itinRes.itineraries);
      if (Array.isArray(threadsRes?.threads)) setThreads(threadsRes.threads);
      if (Array.isArray(bannersRes?.banners)) setBannerSlides(bannersRes.banners);
      if (Array.isArray(zonesRes?.zones)) setZones(zonesRes.zones);
      if (guidesRes?.guides) setGuidesData(guidesRes.guides);
      if (Array.isArray(regRes?.registrations)) setRegistrations(regRes.registrations);
      if (metricsRes?.metrics) setMetrics(metricsRes.metrics);
    } catch {
      showToast('Không thể tải đầy đủ dữ liệu từ máy chủ.', 'error');
    } finally {
      setDataLoading(false);
    }

    loadAnalytics();
  }, [loadAnalytics, showToast]);

  // Verify server session cookie on mount
  useEffect(() => {
    fetch('/api/admin/session')
      .then((res) => res.json())
      .then((data) => {
        if (data?.authenticated) {
          setIsAuthenticated(true);
          setAdminEmail(data.email || 'admin@quangtri.wiki');
          setUsingDefaultPassword(Boolean(data.usingDefaultPassword));
        }
      })
      .catch(() => {})
      .finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAllCmsData();
    }
  }, [isAuthenticated, loadAllCmsData]);

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    setIsAuthenticated(false);
    setAdminEmail('');
    showToast('Đã đăng xuất phiên quản trị.');
  };

  const openAddModal = (type: CmsEntityType) => {
    setEditingType(type);
    setEditingItem(null);
    setEditingIndex(null);
    setIsEditorOpen(true);
  };

  const openEditModal = (type: CmsEntityType, item: any, idx: number | null = null) => {
    setEditingType(type);
    setEditingItem({ ...item });
    setEditingIndex(idx);
    setIsEditorOpen(true);
  };

  const saveGuidesToServer = async (nextGuides: GuidesData, successMsg: string) => {
    const res = await fetch('/api/guides', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nextGuides),
    });
    const data = await res.json();
    if (!res.ok || !data?.success) {
      throw new Error(data?.error || 'Lỗi lưu cẩm nang');
    }
    setGuidesData(data.guides || nextGuides);
    showToast(successMsg);
  };

  const handleDelete = async (type: CmsEntityType, idOrIdx: string | number, label: string) => {
    if (!window.confirm(`Bạn có chắc muốn xóa "${label}"? Dữ liệu trên Database sẽ bị xóa vĩnh viễn.`)) {
      return;
    }

    try {
      if (type === 'hotlines') {
        const idx = Number(idOrIdx);
        const nextHotlines = (guidesData.emergencyHotlines || []).filter((_, i) => i !== idx);
        await saveGuidesToServer({ ...guidesData, emergencyHotlines: nextHotlines }, `Đã xóa hotline "${label}".`);
        return;
      }

      if (type === 'gas') {
        const idx = Number(idOrIdx);
        const nextGas = (guidesData.gasStations || []).filter((_, i) => i !== idx);
        await saveGuidesToServer({ ...guidesData, gasStations: nextGas }, `Đã xóa trạm xăng "${label}".`);
        return;
      }

      if (type === 'zones') {
        const res = await fetch(`/api/zones?code=${encodeURIComponent(String(idOrIdx))}`, {
          method: 'DELETE',
        });
        const data = await res.json();
        if (!res.ok || !data?.success) {
          showToast(data?.error || `Xóa khu vực "${label}" thất bại.`, 'error');
          return;
        }
        setZones((prev) => prev.filter((z) => z.code !== idOrIdx));
        showToast(`Đã xóa khu vực "${label}" khỏi Database.`);
        return;
      }

      const endpointMap: Record<string, string> = {
        banners: '/api/banners',
        places: '/api/places',
        services: '/api/services',
        foods: '/api/foods',
        itineraries: '/api/itineraries',
        threads: '/api/threads',
      };

      const res = await fetch(`${endpointMap[type]}?id=${encodeURIComponent(String(idOrIdx))}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        showToast(data?.error || `Xóa "${label}" thất bại.`, 'error');
        return;
      }

      if (type === 'banners') setBannerSlides((prev) => prev.filter((b) => b.id !== idOrIdx));
      if (type === 'places') setPlaces((prev) => prev.filter((p) => p.id !== idOrIdx));
      if (type === 'services') setServices((prev) => prev.filter((s) => s.id !== idOrIdx));
      if (type === 'foods') setFoods((prev) => prev.filter((f) => f.id !== idOrIdx));
      if (type === 'itineraries') setItineraries((prev) => prev.filter((it) => it.id !== idOrIdx));
      if (type === 'threads') setThreads((prev) => prev.filter((t) => t.id !== idOrIdx));

      showToast(`Đã xóa "${label}" khỏi Database.`);
    } catch (err: any) {
      showToast(err?.message || 'Lỗi kết nối máy chủ.', 'error');
    }
  };

  const handleSaveItem = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingType) return;

    const formData = new FormData(e.currentTarget);
    const dataObj: Record<string, any> = {};
    formData.forEach((value, key) => {
      dataObj[key] = value;
    });

    setIsSaving(true);
    try {
      if (editingType === 'banners') {
        const res = await fetch('/api/banners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            badge: dataObj.badge,
            title: dataObj.title,
            subtitle: dataObj.subtitle,
            image: dataObj.image,
            zoneCode: dataObj.zoneCode,
            sortOrder: Number(dataObj.sortOrder || 0),
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu slide banner');
        const saved: BannerSlide = data.banner;
        setBannerSlides((prev) =>
          editingItem ? prev.map((b) => (b.id === saved.id ? saved : b)) : [...prev, saved]
        );
        showToast(editingItem ? 'Đã cập nhật slide banner!' : 'Đã thêm slide banner mới!');
      } else if (editingType === 'zones') {
        const res = await fetch('/api/zones', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: dataObj.code,
            name: dataObj.name,
            slug: dataObj.slug,
            tagline: dataObj.tagline,
            featuredCount: dataObj.featuredCount,
            specialty: dataObj.specialty,
            typeTag: dataObj.typeTag,
            typeGroup: dataObj.typeGroup,
            heroImage: dataObj.heroImage,
            description: dataObj.description,
            lat: dataObj.lat !== '' && dataObj.lat !== undefined ? Number(dataObj.lat) : null,
            lon: dataObj.lon !== '' && dataObj.lon !== undefined ? Number(dataObj.lon) : null,
            weatherRegionLabel: dataObj.weatherRegionLabel,
            showInWeather: dataObj.showInWeather === 'on' || dataObj.showInWeather === 'true',
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu khu vực');
        const saved: Zone = data.zone;
        setZones((prev) => {
          const exists = prev.some((z) => z.code === saved.code);
          return exists ? prev.map((z) => (z.code === saved.code ? saved : z)) : [...prev, saved];
        });
        showToast(editingItem ? `Đã cập nhật khu vực ${saved.code}!` : `Đã thêm khu vực ${saved.code}!`);
      } else if (editingType === 'places') {
        const res = await fetch('/api/places', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            name: dataObj.name,
            zoneCode: dataObj.zoneCode,
            zoneName: dataObj.zoneName,
            category: dataObj.category,
            categoryName: dataObj.categoryName,
            image: dataObj.image,
            gallery: dataObj.gallery,
            ticket: dataObj.ticket,
            openHours: dataObj.openHours,
            coordinates: dataObj.coordinates,
            address: dataObj.address,
            shortDesc: dataObj.shortDesc,
            fullDesc: dataObj.fullDesc,
            highlights: dataObj.highlights,
            tips: dataObj.tips,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu điểm đến');
        const saved: Place = data.place;
        setPlaces((prev) =>
          editingItem ? prev.map((p) => (p.id === saved.id ? saved : p)) : [saved, ...prev]
        );
        showToast(editingItem ? 'Đã cập nhật điểm đến!' : 'Đã thêm điểm đến mới!');
      } else if (editingType === 'services') {
        const res = await fetch('/api/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            name: dataObj.name,
            type: dataObj.type,
            typeLabel: dataObj.typeLabel,
            zoneCode: dataObj.zoneCode,
            zoneName: dataObj.zoneName,
            price: dataObj.price,
            phone: dataObj.phone,
            zalo: dataObj.phone,
            address: dataObj.address,
            image: dataObj.image,
            verified: dataObj.verified === 'on' || dataObj.verified === 'true',
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu dịch vụ');
        const saved: Service = data.service;
        setServices((prev) =>
          editingItem ? prev.map((s) => (s.id === saved.id ? saved : s)) : [saved, ...prev]
        );
        showToast(editingItem ? 'Đã cập nhật đối tác dịch vụ!' : 'Đã thêm đối tác mới!');
      } else if (editingType === 'foods') {
        const res = await fetch('/api/foods', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            name: dataObj.name,
            origin: dataObj.origin,
            type: dataObj.type,
            priceRange: dataObj.priceRange,
            addressRecs: dataObj.addressRecs,
            image: dataObj.image,
            description: dataObj.description,
            tasteNotes: dataObj.tasteNotes,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu món ăn');
        const saved: Food = data.food;
        setFoods((prev) =>
          editingItem ? prev.map((f) => (f.id === saved.id ? saved : f)) : [saved, ...prev]
        );
        showToast(editingItem ? 'Đã cập nhật món ăn!' : 'Đã thêm món ăn mới!');
      } else if (editingType === 'itineraries') {
        const steps = String(dataObj.stepsText || '')
          .split('\n')
          .map((line) => line.trim())
          .filter(Boolean)
          .map((line, idx) => {
            const parts = line.split('|').map((p) => p.trim());
            if (parts.length >= 3) {
              return { time: parts[0], name: parts[1], desc: parts.slice(2).join(' | ') };
            }
            if (parts.length === 2) {
              return { time: parts[0], name: parts[1], desc: '' };
            }
            return { time: `Chặng ${idx + 1}`, name: parts[0], desc: '' };
          });

        const res = await fetch('/api/itineraries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            title: dataObj.title,
            duration: dataObj.duration,
            suitability: dataObj.suitability,
            distance: dataObj.distance,
            description: dataObj.description,
            highlights: dataObj.highlights,
            steps,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu lộ trình');
        const saved: Itinerary = data.itinerary;
        setItineraries((prev) =>
          editingItem ? prev.map((it) => (it.id === saved.id ? saved : it)) : [saved, ...prev]
        );
        showToast(editingItem ? 'Đã cập nhật lộ trình!' : 'Đã tạo lộ trình mới!');
      } else if (editingType === 'threads') {
        const isEdit = Boolean(editingItem?.id);
        const res = await fetch('/api/threads', {
          method: isEdit ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem?.id,
            author: dataObj.author,
            badge: dataObj.badge,
            tag: dataObj.tag,
            zoneCode: dataObj.zoneCode,
            title: dataObj.title,
            content: dataObj.content,
            images: dataObj.images,
          }),
        });
        const data = await res.json();
        if (!res.ok || !data?.success) throw new Error(data?.error || 'Lỗi lưu bài viết');
        const saved: Thread = data.thread;
        setThreads((prev) =>
          isEdit ? prev.map((t) => (t.id === saved.id ? saved : t)) : [saved, ...prev]
        );
        showToast(isEdit ? 'Đã cập nhật bài viết!' : 'Đã xuất bản bài viết mới!');
      } else if (editingType === 'hotlines') {
        const item: EmergencyHotline = {
          name: dataObj.name,
          phone: dataObj.phone,
          note: dataObj.note,
        };
        const currentList = [...(guidesData.emergencyHotlines || [])];
        if (editingIndex !== null && currentList[editingIndex]) {
          currentList[editingIndex] = item;
        } else {
          currentList.push(item);
        }
        await saveGuidesToServer(
          { ...guidesData, emergencyHotlines: currentList },
          editingIndex !== null ? 'Đã cập nhật Hotline cứu hộ!' : 'Đã thêm Hotline mới!'
        );
      } else if (editingType === 'gas') {
        const item: GasStation = {
          name: dataObj.name,
          route: dataObj.route,
          tip: dataObj.tip,
        };
        const currentList = [...(guidesData.gasStations || [])];
        if (editingIndex !== null && currentList[editingIndex]) {
          currentList[editingIndex] = item;
        } else {
          currentList.push(item);
        }
        await saveGuidesToServer(
          { ...guidesData, gasStations: currentList },
          editingIndex !== null ? 'Đã cập nhật trạm xăng!' : 'Đã thêm trạm xăng mới!'
        );
      }

      setIsEditorOpen(false);
    } catch (err: any) {
      showToast(err?.message || 'Không thể lưu dữ liệu vào Database.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateRegistrationStatus = async (
    id: string,
    status: 'pending' | 'approved' | 'rejected'
  ) => {
    try {
      const res = await fetch('/api/partner-registrations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        showToast(data?.error || 'Không thể cập nhật trạng thái hồ sơ.', 'error');
        return;
      }
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      showToast(`Đã chuyển trạng thái hồ sơ sang "${status === 'approved' ? 'Đã duyệt' : 'Từ chối'}".`);
    } catch {
      showToast('Lỗi kết nối máy chủ.', 'error');
    }
  };

  if (!authChecked) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#133e2f', fontWeight: 700 }}>
        Đang kiểm tra phiên đăng nhập...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onSuccess={({ email, usingDefaultPassword: isDefault }) => {
          setIsAuthenticated(true);
          setAdminEmail(email);
          setUsingDefaultPassword(Boolean(isDefault));
          showToast('Đăng nhập Quản trị viên thành công!');
        }}
      />
    );
  }

  const q = searchQuery.trim().toLowerCase();
  const filteredPlaces = places.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.zoneCode.toLowerCase().includes(q)
  );
  const filteredServices = services.filter(
    (s) => !q || s.name.toLowerCase().includes(q) || s.zoneName.toLowerCase().includes(q)
  );
  const filteredFoods = foods.filter(
    (f) => !q || f.name.toLowerCase().includes(q) || (f.origin || '').toLowerCase().includes(q)
  );
  const filteredThreads = threads.filter(
    (t) => !q || t.title.toLowerCase().includes(q) || t.author.toLowerCase().includes(q)
  );
  const filteredZones = zones.filter(
    (z) =>
      !q ||
      z.code.toLowerCase().includes(q) ||
      z.name.toLowerCase().includes(q) ||
      (z.specialty || '').toLowerCase().includes(q)
  );

  const pendingRegistrationsCount = registrations.filter((r) => r.status === 'pending').length;

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f3f4f6', color: '#1f2937', fontFamily: 'var(--font-sans)' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          role="status"
          style={{
            position: 'fixed',
            top: '1.25rem',
            right: '1.25rem',
            zIndex: 9999,
            background: toast.type === 'error' ? '#991b1b' : '#133e2f',
            color: toast.type === 'error' ? '#fef2f2' : '#fef08a',
            padding: '0.85rem 1.35rem',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25)',
            fontWeight: 700,
            fontSize: '0.86rem',
            maxWidth: '420px',
          }}
        >
          {toast.type === 'error' ? <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> : <i className="bi bi-check-circle-fill" aria-hidden="true" />}{' '}
          {toast.message}
        </div>
      )}

      {/* Top Navbar */}
      <header
        style={{
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
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.35rem' }}><i className="bi bi-compass" aria-hidden="true" /></span>
            <span style={{ fontFamily: 'var(--font-serif)', fontWeight: 800, fontSize: '1.25rem', color: '#ffffff' }}>
              QuangTri.wiki
            </span>
            <span style={{ background: '#fbbf24', color: '#0f2e22', fontSize: '0.65rem', fontWeight: 800, padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
              CMS v2
            </span>
          </div>

          <Link
            href="/"
            target="_blank"
            style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.8rem', textDecoration: 'none' }}
          >
            ↗ Xem Website Live
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)' }}>
            {adminEmail}
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

      {/* Security Warning Banner when default password is active */}
      {usingDefaultPassword && !hideSecurityWarning && (
        <div
          style={{
            background: '#fef3c7',
            borderBottom: '1px solid #fcd34d',
            color: '#92400e',
            padding: '0.65rem 2rem',
            fontSize: '0.82rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span>
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> <strong>Cảnh báo bảo mật:</strong> Hệ thống đang dùng mật khẩu mặc định. Hãy thiết lập biến môi trường <code>ADMIN_PASSWORD</code>, <code>ADMIN_SESSION_SECRET</code> và <code>SUPABASE_SERVICE_ROLE_KEY</code> trên Vercel.
          </span>
          <button
            onClick={() => setHideSecurityWarning(true)}
            style={{ background: 'none', border: 'none', color: '#92400e', fontWeight: 700, cursor: 'pointer' }}
          >
            ✕ Ẩn
          </button>
        </div>
      )}

      {/* Main CMS Layout */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 60px)', flexWrap: 'wrap' }}>
        <aside
          style={{
            width: '260px',
            background: '#ffffff',
            borderRight: '1px solid #e5e7eb',
            padding: '1.5rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.4rem',
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', color: '#9ca3af', padding: '0 0.75rem', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>
            Quản Trị Database Live
          </span>

          {[
            { id: 'overview', label: 'Tổng Quan Hệ Thống', icon: 'bi-bar-chart-line', count: null },
            { id: 'analytics', label: 'Phân Tích Lượt Xem', icon: 'bi-graph-up-arrow', count: analytics?.todayViews ?? 'Live' },
            { id: 'banners', label: 'Slide Trang Top (Banner)', icon: 'bi-images', count: bannerSlides.length },
            { id: 'zones', label: 'Khu Vực & Thời Tiết', icon: 'bi-compass', count: zones.length },
            { id: 'threads', label: 'Bài Viết & Diễn Đàn', icon: 'bi-pencil-square', count: threads.length },
            { id: 'places', label: 'Điểm Đến & Danh Thắng', icon: 'bi-geo-alt-fill', count: places.length },
            { id: 'services', label: 'Dịch Vụ & Đối Tác', icon: 'bi-building', count: services.length },
            { id: 'registrations', label: 'Hồ Sơ Đăng Ký Đối Tác', icon: 'bi-envelope-paper', count: pendingRegistrationsCount || registrations.length },
            { id: 'foods', label: 'Ẩm Thực Đặc Sản', icon: 'bi-cup-hot', count: foods.length },
            { id: 'itineraries', label: 'Lịch Trình & Cung Đường', icon: 'bi-map', count: itineraries.length },
            { id: 'utilities', label: 'Cứu Hộ & Tiện Ích', icon: 'bi-fuel-pump', count: (guidesData.gasStations?.length || 0) + (guidesData.emergencyHotlines?.length || 0) },
            { id: 'users', label: 'Người Dùng (CMS & Web)', icon: 'bi-people-fill', count: null },
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
                  fontWeight: isActive ? 700 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <i className={`bi ${item.icon}`} aria-hidden="true" />
                  <span>{item.label}</span>
                </div>
                {item.count !== null && (
                  <span
                    style={{
                      fontSize: '0.72rem',
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#f3f4f6',
                      color: isActive ? '#fde047' : '#6b7280',
                      padding: '0.15rem 0.45rem',
                      borderRadius: '20px',
                      fontWeight: 700,
                    }}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </aside>

        {/* Main Content Canvas */}
        <main style={{ flex: 1, minWidth: '300px', padding: '2rem 2.25rem', overflowY: 'auto' }}>
          {dataLoading && (
            <div style={{ marginBottom: '1rem', fontSize: '0.84rem', color: '#059669', fontWeight: 600 }}>
              ⏳ Đang đồng bộ dữ liệu trực tiếp từ Database...
            </div>
          )}

          {/* TAB: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.35rem' }}>
                  Bảng Điều Khiển Tổng Quan (Supabase Connected)
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.88rem', margin: 0 }}>
                  Mọi thay đổi nội dung sẽ lưu trực tiếp lên Supabase PostgreSQL và làm mới bộ nhớ đệm website ngay lập tức.
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
                <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Điểm đến đang hiển thị</span>
                  <strong style={{ fontSize: '2rem', color: '#133e2f', display: 'block', margin: '0.35rem 0' }}>{places.length}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#059669' }}>Phủ {zones.length} phân vùng</span>
                </div>
                <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Đối tác & Lượt kết nối</span>
                  <strong style={{ fontSize: '2rem', color: '#d97706', display: 'block', margin: '0.35rem 0' }}>
                    {services.length} / {metrics?.totalLeads ?? 0}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#d97706' }}>Đối tác xác minh / Leads Hotline & Zalo</span>
                </div>
                <div style={{ background: '#fff', padding: '1.4rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                  <span style={{ fontSize: '0.82rem', color: '#6b7280' }}>Hồ sơ đối tác chờ duyệt</span>
                  <strong style={{ fontSize: '2rem', color: '#2563eb', display: 'block', margin: '0.35rem 0' }}>
                    {pendingRegistrationsCount}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: '#2563eb' }}>Tổng {registrations.length} đơn đăng ký</span>
                </div>
                <div style={{ background: '#133e2f', color: '#fff', padding: '1.4rem', borderRadius: '16px' }}>
                  <span style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.7)' }}>Tổng lượt xem (Database)</span>
                  <strong style={{ fontSize: '2rem', color: '#fde047', display: 'block', margin: '0.35rem 0' }}>
                    {(analytics?.totalViews ?? 0).toLocaleString('vi-VN')}
                  </strong>
                  <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.85)' }}>
                    Hôm nay: {(analytics?.todayViews ?? 0).toLocaleString('vi-VN')} lượt
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '16px', border: '1px solid #e5e7eb' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 1rem', color: '#133e2f' }}>
                  Thao Tác Nhanh
                </h3>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={() => openAddModal('banners')} style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#133e2f', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <i className="bi bi-images" aria-hidden="true" /> Thêm Slide Banner Top
                  </button>
                  <button onClick={() => setActiveTab('zones')} style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <i className="bi bi-compass" aria-hidden="true" /> Quản lý Khu vực & Thời tiết
                  </button>
                  <button onClick={() => openAddModal('threads')} style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <i className="bi bi-pencil-square" aria-hidden="true" /> Soạn bài viết mới
                  </button>
                  <button onClick={() => openAddModal('places')} style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#f3f4f6', color: '#1f2937', border: '1px solid #d1d5db', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <i className="bi bi-geo-alt-fill" aria-hidden="true" /> Thêm địa danh mới
                  </button>
                  <button onClick={() => setActiveTab('analytics')} style={{ padding: '0.65rem 1.15rem', borderRadius: '10px', background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>
                    <i className="bi bi-graph-up-arrow" aria-hidden="true" /> Xem phân tích lượt xem
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AdminAnalyticsTab
              analytics={analytics}
              loading={analyticsLoading}
              onRefresh={loadAnalytics}
            />
          )}

          {/* TAB: BANNER SLIDES */}
          {activeTab === 'banners' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Slide Trang Top ({bannerSlides.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Chỉnh sửa hình ảnh, tiêu đề và lời giới thiệu từng slide trên trang chủ.
                  </p>
                </div>
                <button
                  onClick={() => openAddModal('banners')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Thêm Slide Mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Ảnh</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Thẻ nhãn</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Tiêu đề</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Giới thiệu ngắn</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bannerSlides.map((slide, idx) => (
                      <tr key={slide.id || idx} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <img src={slide.image} alt={slide.title} style={{ width: '72px', height: '46px', borderRadius: '6px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#fef3c7', color: '#92400e', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>
                            {slide.badge}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f', maxWidth: '220px' }}>{slide.title}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#4b5563', fontSize: '0.82rem', maxWidth: '300px' }}>{slide.subtitle}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('banners', slide)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('banners', slide.id, slide.title)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ZONES & WEATHER CONFIG */}
          {activeTab === 'zones' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Khu Vực & Tọa Độ Thời Tiết ({filteredZones.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Cập nhật tên vùng, đặc sản, ảnh nền và tọa độ GPS (Lat/Lon) để Widget Thời tiết trang Top lấy dữ liệu Open-Meteo thực tế.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm mã QT hoặc tên vùng..."
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => openAddModal('zones')}
                    style={{ padding: '0.6rem 1.15rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    + Thêm Khu Vực Mới
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Ảnh</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Mã</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Tên khu vực & Tagline</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Đặc sản</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Thời tiết (GPS)</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredZones.map((z) => (
                      <tr key={z.code} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <img src={z.heroImage} alt={z.name} style={{ width: '64px', height: '42px', borderRadius: '6px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#133e2f', color: '#fde047', padding: '0.25rem 0.55rem', borderRadius: '6px', fontSize: '0.76rem', fontWeight: 800 }}>
                            {z.code}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                          <strong style={{ color: '#133e2f', display: 'block' }}>{z.name}</strong>
                          <span style={{ fontSize: '0.78rem', color: '#6b7280' }}>{z.tagline}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', maxWidth: '200px', color: '#4b5563', fontSize: '0.82rem' }}>
                          {z.specialty}
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <div style={{ fontSize: '0.78rem', color: '#1e293b', fontWeight: 600 }}>
                            {typeof z.lat === 'number' ? z.lat.toFixed(2) : '--'}°N, {typeof z.lon === 'number' ? z.lon.toFixed(2) : '--'}°E
                          </div>
                          <span
                            style={{
                              display: 'inline-block',
                              marginTop: '0.2rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '10px',
                              fontSize: '0.72rem',
                              fontWeight: 700,
                              background: z.showInWeather !== false ? '#ecfdf5' : '#f3f4f6',
                              color: z.showInWeather !== false ? '#047857' : '#6b7280',
                            }}
                          >
                            {z.showInWeather !== false ? <><i className="bi bi-cloud-sun" aria-hidden="true" /> Đang bật</> : 'Tắt'}
                          </span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('zones', z)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('zones', z.code, z.name)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: THREADS */}
          {activeTab === 'threads' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Bài Viết & Diễn Đàn ({filteredThreads.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Biên tập và kiểm duyệt chia sẻ từ cộng đồng.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Lọc bài viết..."
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => openAddModal('threads')}
                    style={{ padding: '0.6rem 1.15rem', borderRadius: '10px', background: '#133e2f', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    + Viết Bài Mới
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Tiêu đề</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Tác giả</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Thẻ</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Vùng</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Thích</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredThreads.map((th) => (
                      <tr key={th.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f', maxWidth: '300px' }}>{th.title}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{th.author}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#ecfdf5', color: '#059669', padding: '0.2rem 0.55rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700 }}>{th.tag}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{th.zoneCode}</td>
                        <td style={{ padding: '0.85rem 1rem' }}><i className="bi bi-heart-fill" aria-hidden="true" /> {th.likes_count ?? th.likes ?? 0}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('threads', th)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('threads', th.id, th.title)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PLACES */}
          {activeTab === 'places' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Điểm Đến ({filteredPlaces.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Các tọa độ hiển thị trên bản đồ và danh thắng Quảng Trị.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm tên địa danh..."
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => openAddModal('places')}
                    style={{ padding: '0.6rem 1.15rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    + Thêm Điểm Đến Mới
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
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
                    {filteredPlaces.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <img src={p.image} alt={p.name} style={{ width: '52px', height: '38px', borderRadius: '6px', objectFit: 'cover' }} />
                        </td>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>{p.name}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#f3f4f6', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{p.zoneCode}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{p.categoryName}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 600 }}>{p.ticket}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('places', p)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('places', p.id, p.name)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Dịch Vụ & Đối Tác ({filteredServices.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                    Homestay, thuê xe máy, vé tàu Cồn Cỏ và tour guide.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm đối tác..."
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => openAddModal('services')}
                    style={{ padding: '0.6rem 1.15rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    + Thêm Đối Tác Mới
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
                  <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                      <th style={{ padding: '0.85rem 1rem' }}>Tên cơ sở</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Phân loại</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Giá niêm yết</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Hotline</th>
                      <th style={{ padding: '0.85rem 1rem' }}>Xác minh</th>
                      <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredServices.map((srv) => (
                      <tr key={srv.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>{srv.name}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{srv.typeLabel}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#059669', fontWeight: 700 }}>{srv.price}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{srv.phone}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          {srv.verified ? <span style={{ color: '#059669', fontWeight: 700 }}>✓ Đã xác minh</span> : <span style={{ color: '#9ca3af' }}>Chưa</span>}
                        </td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('services', srv)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('services', srv.id, srv.name)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: PARTNER REGISTRATIONS */}
          {activeTab === 'registrations' && (
            <AdminPartnersTab
              registrations={registrations}
              onUpdateStatus={handleUpdateRegistrationStatus}
              onRefresh={loadRegistrations}
            />
          )}

          {/* TAB: FOODS */}
          {activeTab === 'foods' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Ẩm Thực Đặc Sản ({filteredFoods.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Món ngon & địa chỉ quán gợi ý tại Quảng Trị.</p>
                </div>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm món ăn..."
                    style={{ padding: '0.55rem 0.85rem', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '0.85rem' }}
                  />
                  <button
                    onClick={() => openAddModal('foods')}
                    style={{ padding: '0.6rem 1.15rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.86rem', cursor: 'pointer' }}
                  >
                    + Thêm Món Ăn Mới
                  </button>
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
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
                    {filteredFoods.map((f) => (
                      <tr key={f.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>{f.name}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{f.origin}</td>
                        <td style={{ padding: '0.85rem 1rem', color: '#d97706', fontWeight: 700 }}>{f.priceRange}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{f.addressRecs?.[0] || 'Chợ Đông Hà'}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('foods', f)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('foods', f.id, f.name)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: ITINERARIES */}
          {activeTab === 'itineraries' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                    Quản Lý Lịch Trình & Cung Đường ({itineraries.length})
                  </h2>
                  <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>Lộ trình phượt đề xuất & các chặng chi tiết.</p>
                </div>
                <button
                  onClick={() => openAddModal('itineraries')}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                >
                  + Thêm Lộ Trình Mới
                </button>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.86rem' }}>
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
                        <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: '#133e2f' }}>{it.title}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>
                          <span style={{ background: '#133e2f', color: '#fde047', padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 700 }}>{it.duration}</span>
                        </td>
                        <td style={{ padding: '0.85rem 1rem' }}>{it.suitability}</td>
                        <td style={{ padding: '0.85rem 1rem' }}>{it.distance}</td>
                        <td style={{ padding: '0.85rem 1rem', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <button onClick={() => openEditModal('itineraries', it)} style={{ padding: '0.35rem 0.65rem', marginRight: '0.4rem', borderRadius: '6px', background: '#f3f4f6', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                          </button>
                          <button onClick={() => handleDelete('itineraries', it.id, it.title)} style={{ padding: '0.35rem 0.65rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700 }}>
                            <i className="bi bi-trash" aria-hidden="true" /> Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: UTILITIES */}
          {activeTab === 'utilities' && (
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#133e2f', margin: '0 0 0.25rem' }}>
                  Quản Lý Cứu Hộ & Trạm Xăng
                </h2>
                <p style={{ color: '#6b7280', fontSize: '0.85rem', margin: 0 }}>
                  Chỉnh sửa trực tiếp danh bạ hotline khẩn cấp và cây xăng tuyến đường xa.
                </p>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#dc2626' }}>
                    <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" /> Danh Bạ Hotline Khẩn Cấp
                  </h3>
                  <button
                    onClick={() => openAddModal('hotlines')}
                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#dc2626', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    + Thêm Hotline
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(guidesData.emergencyHotlines || []).map((h, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#fef2f2', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <strong style={{ color: '#991b1b', display: 'block', fontSize: '0.88rem' }}>{h.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{h.note || 'Hỗ trợ 24/7'} · <i className="bi bi-telephone-fill" aria-hidden="true" /> {h.phone}</span>
                      </div>
                      <div>
                        <button onClick={() => openEditModal('hotlines', h, idx)} style={{ padding: '0.3rem 0.6rem', marginRight: '0.4rem', borderRadius: '6px', background: '#fff', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                          <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                        </button>
                        <button onClick={() => handleDelete('hotlines', idx, h.name)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                          <i className="bi bi-trash" aria-hidden="true" /> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #e5e7eb', padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, margin: 0, color: '#059669' }}>
                    <i className="bi bi-fuel-pump-fill" aria-hidden="true" /> Cây Xăng Trọng Yếu Tuyến Xa
                  </h3>
                  <button
                    onClick={() => openAddModal('gas')}
                    style={{ padding: '0.45rem 0.85rem', borderRadius: '8px', background: '#059669', color: '#fff', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                  >
                    + Thêm Trạm Xăng
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {(guidesData.gasStations || []).map((g, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f0fdf4', borderRadius: '10px', gap: '1rem', flexWrap: 'wrap' }}>
                      <div>
                        <strong style={{ color: '#166534', display: 'block', fontSize: '0.88rem' }}>{g.name}</strong>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{g.route} · <i className="bi bi-lightbulb" aria-hidden="true" /> {g.tip}</span>
                      </div>
                      <div>
                        <button onClick={() => openEditModal('gas', g, idx)} style={{ padding: '0.3rem 0.6rem', marginRight: '0.4rem', borderRadius: '6px', background: '#fff', border: '1px solid #d1d5db', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                          <i className="bi bi-pencil-square" aria-hidden="true" /> Sửa
                        </button>
                        <button onClick={() => handleDelete('gas', idx, g.name)} style={{ padding: '0.3rem 0.6rem', borderRadius: '6px', background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}>
                          <i className="bi bi-trash" aria-hidden="true" /> Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: USERS CRUD */}
          {activeTab === 'users' && (
            <AdminUsersTab
              currentAdminEmail={adminEmail}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      <AdminEditorModal
        isOpen={isEditorOpen}
        editingType={editingType}
        editingItem={editingItem}
        isSaving={isSaving}
        onClose={() => setIsEditorOpen(false)}
        onSubmit={handleSaveItem}
      />
    </div>
  );
}
