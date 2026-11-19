import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';
import dbFallback from '@/legacy/db.json';
import {
  normalizeBannerSlide,
  normalizeFood,
  normalizeGuides,
  normalizeItinerary,
  normalizePlace,
  normalizeService,
  normalizeThread,
  normalizeZone,
} from '@/lib/normalize';
import type {
  BannerSlide,
  Comment,
  Food,
  GuidesData,
  Itinerary,
  Place,
  Service,
  Thread,
  Zone,
} from '@/lib/supabase/types';

// 1. LẤY DANH SÁCH ĐIỂM ĐẾN (PLACES) TỪ DATABASE
export async function getPlaces(): Promise<Place[]> {
  try {
    const { data, error } = await supabaseServer
      .from('places')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(normalizePlace);
    }
  } catch (e) {
    console.warn('Supabase getPlaces fallback:', e);
  }

  return (QUANGTRI_DATA.places || []).map(normalizePlace);
}

// 2. LẤY CHI TIẾT 1 ĐIỂM ĐẾN THEO SLUG TỪ DATABASE
export async function getPlaceBySlug(slug: string): Promise<Place | null> {
  const local = QUANGTRI_DATA.places.find((p) => p.id === slug);

  try {
    const { data, error } = await supabaseServer
      .from('places')
      .select('*')
      .eq('id', slug)
      .single();

    if (!error && data) {
      const merged = { ...(local || {}), ...data };
      return normalizePlace(merged);
    }
  } catch (e) {
    console.warn(`Supabase getPlaceBySlug(${slug}) fallback:`, e);
  }

  return local ? normalizePlace(local) : null;
}

// 3. LẤY DANH SÁCH DỊCH VỤ ĐỐI TÁC (SERVICES) TỪ DATABASE
export async function getServices(): Promise<Service[]> {
  try {
    const { data, error } = await supabaseServer
      .from('services')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map(normalizeService);
    }
  } catch (e) {
    console.warn('Supabase getServices fallback:', e);
  }

  return (QUANGTRI_DATA.services || []).map(normalizeService);
}

// 4. LẤY BÀI VIẾT DIỄN ĐÀN (THREADS + COMMENTS) TỪ DATABASE
export async function getThreads(): Promise<Thread[]> {
  try {
    const [threadsRes, commentsRes] = await Promise.all([
      supabaseServer.from('threads').select('*').order('created_at', { ascending: false }),
      supabaseServer.from('comments').select('*').order('created_at', { ascending: true }),
    ]);

    if (!threadsRes.error && threadsRes.data && threadsRes.data.length > 0) {
      const commentsByThread = new Map<string, Comment[]>();
      if (!commentsRes.error && Array.isArray(commentsRes.data)) {
        for (const c of commentsRes.data as Comment[]) {
          const list = commentsByThread.get(c.thread_id) || [];
          list.push(c);
          commentsByThread.set(c.thread_id, list);
        }
      }

      return threadsRes.data.map((t: any) =>
        normalizeThread(t, commentsByThread.get(t.id) || [])
      );
    }
  } catch (e) {
    console.warn('Supabase getThreads fallback:', e);
  }

  const localThreads = (QUANGTRI_DATA as any).forumThreads || dbFallback.threads || [];
  return localThreads.map((t: any) => normalizeThread(t, t.comments || []));
}

// 5. LẤY DANH SÁCH ẨM THỰC ĐẶC SẢN (FOODS) TỪ DATABASE
export async function getFoods(): Promise<Food[]> {
  try {
    const { data, error } = await supabaseServer.from('foods').select('*');

    if (!error && data && data.length > 0) {
      return data.map((f: any) => {
        const localFood = QUANGTRI_DATA.foods.find((lf) => lf.id === f.id);
        return normalizeFood(f, localFood);
      });
    }
  } catch (e) {
    console.warn('Supabase getFoods fallback:', e);
  }

  return (QUANGTRI_DATA.foods || []).map((f) => normalizeFood(f));
}

// 6. LẤY DANH SÁCH LỊCH TRÌNH & CUNG ĐƯỜNG (ITINERARIES) TỪ DATABASE
export async function getItineraries(): Promise<Itinerary[]> {
  try {
    const { data, error } = await supabaseServer.from('itineraries').select('*');

    if (!error && data && data.length > 0) {
      return data.map((it: any) => {
        const localIt = QUANGTRI_DATA.itineraries.find((li) => li.id === it.id);
        const merged = {
          ...(localIt || {}),
          ...it,
          stops: Array.isArray(it.stops) && it.stops.length > 0 ? it.stops : localIt?.steps || [],
        };
        return normalizeItinerary(merged);
      });
    }
  } catch (e) {
    console.warn('Supabase getItineraries fallback:', e);
  }

  return (QUANGTRI_DATA.itineraries || []).map(normalizeItinerary);
}

// 7. LẤY DANH SÁCH PHÂN VÙNG CUNG ĐƯỜNG (ZONES) TỪ DATABASE
export async function getZones(): Promise<Zone[]> {
  try {
    const { data, error } = await supabaseServer
      .from('zones')
      .select('*')
      .order('code', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((z: any) => {
        const localZone = QUANGTRI_DATA.zones.find((lz) => lz.code === z.code);
        return normalizeZone(z, localZone);
      });
    }
  } catch (e) {
    console.warn('Supabase getZones fallback:', e);
  }

  return (QUANGTRI_DATA.zones || []).map((z) => normalizeZone(z));
}

// 8. LẤY CẨM NANG & TIỆN ÍCH CỨU HỘ (GUIDES & UTILITIES) TỪ DATABASE
export async function getGuides(): Promise<GuidesData> {
  const localGuides = QUANGTRI_DATA.guides || {};
  try {
    const { data, error } = await supabaseServer.from('guides').select('*').limit(1).maybeSingle();

    if (!error && data) {
      return normalizeGuides(data, localGuides);
    }
  } catch {
    // Expected silent fallback before migration_v2.sql is run
  }

  return normalizeGuides(localGuides, localGuides);
}

// 9. LẤY BANNER SLIDESHOW TRAVEL TỪ DATABASE
export async function getBannerSlides(): Promise<BannerSlide[]> {
  try {
    const { data, error } = await supabaseServer
      .from('banner_slides')
      .select('*')
      .order('sort_order', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map(normalizeBannerSlide);
    }
  } catch {
    // Expected silent fallback before migration_v2.sql is run
  }

  return (QUANGTRI_DATA.bannerSlides || []).map(normalizeBannerSlide);
}

// 10. LẤY SỐ LƯỢT XEM TỪ DATABASE
export async function getSiteViews(): Promise<number> {
  try {
    const { count, error } = await supabaseServer
      .from('page_views')
      .select('id', { count: 'exact', head: true });

    if (!error && typeof count === 'number') {
      return count;
    }
  } catch (e) {
    console.warn('Supabase getSiteViews error:', e);
  }

  return 0;
}
