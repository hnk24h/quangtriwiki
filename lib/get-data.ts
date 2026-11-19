import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';
import dbFallback from '@/legacy/db.json';

// 1. LẤY DANH SÁCH ĐIỂM ĐẾN (PLACES) TỪ DATABASE
export async function getPlaces() {
  try {
    const { data, error } = await supabaseServer
      .from('places')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((p) => ({
        id: p.id,
        name: p.name,
        zoneCode: p.zone_code,
        zoneName: p.zone_name,
        category: p.category,
        categoryName: p.category_name,
        image: p.hero_image,
        hero_image: p.hero_image,
        rating: p.rating,
        reviewsCount: p.rating_count,
        shortDesc: p.short_desc,
        fullDesc: p.history,
        history: p.history,
        highlights: p.highlights || [],
        coordinates: p.coordinates,
        address: p.address,
        openHours: p.open_time,
        ticket: p.ticket_price,
        tips: p.tips,
      }));
    }
  } catch (e) {
    console.warn('Supabase getPlaces fallback:', e);
  }

  // Fallback to initial dataset
  return QUANGTRI_DATA.places;
}

// 2. LẤY CHI TIẾT 1 ĐIỂM ĐẾN THEO SLUG TỪ DATABASE
export async function getPlaceBySlug(slug: string) {
  try {
    const { data, error } = await supabaseServer
      .from('places')
      .select('*')
      .eq('id', slug)
      .single();

    if (!error && data) {
      return {
        id: data.id,
        name: data.name,
        zoneCode: data.zone_code,
        zoneName: data.zone_name,
        category: data.category,
        categoryName: data.category_name,
        image: data.hero_image,
        hero_image: data.hero_image,
        gallery: data.gallery || [data.hero_image],
        rating: data.rating,
        reviewsCount: data.rating_count,
        shortDesc: data.short_desc,
        fullDesc: data.history,
        history: data.history,
        highlights: data.highlights || [],
        coordinates: data.coordinates,
        address: data.address,
        openHours: data.open_time,
        ticket: data.ticket_price,
        tips: data.tips,
      };
    }
  } catch (e) {
    console.warn(`Supabase getPlaceBySlug(${slug}) fallback:`, e);
  }

  return QUANGTRI_DATA.places.find((p) => p.id === slug) || null;
}

// 3. LẤY DANH SÁCH DỊCH VỤ ĐỐI TÁC (SERVICES) TỪ DATABASE
export async function getServices() {
  try {
    const { data, error } = await supabaseServer
      .from('services')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((s) => ({
        id: s.id,
        name: s.name,
        type: s.type,
        typeLabel: s.type_label,
        category: s.type,
        categoryName: s.type_label,
        zoneCode: s.zone_code,
        zoneName: s.zone_name,
        price: s.price,
        rating: s.rating,
        reviewsCount: s.reviews,
        address: s.address,
        phone: s.hotline,
        zalo: s.zalo,
        image: s.image,
        verified: s.is_verified,
        badge: s.is_verified ? 'Đối tác Xác minh' : 'Đối tác',
        highlights: s.description ? [s.description] : [],
      }));
    }
  } catch (e) {
    console.warn('Supabase getServices fallback:', e);
  }

  return QUANGTRI_DATA.services || [];
}

// 4. LẤY BÀI VIẾT DIỄN ĐÀN (THREADS) TỪ DATABASE
export async function getThreads() {
  try {
    const { data, error } = await supabaseServer
      .from('threads')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      return data.map((t) => ({
        id: t.id,
        author: t.author_name,
        avatar: t.author_avatar,
        badge: t.author_badge,
        time: new Date(t.created_at).toLocaleDateString('vi-VN'),
        tag: t.tag,
        zoneCode: t.zone_code,
        title: t.title,
        content: t.content,
        images: t.images || [],
        likes: t.likes_count,
        comments: [],
      }));
    }
  } catch (e) {
    console.warn('Supabase getThreads fallback:', e);
  }

  return (QUANGTRI_DATA as any).forumThreads || dbFallback.threads || [];
}

// 5. LẤY DANH SÁCH ẨM THỰC ĐẶC SẢN (FOODS) TỪ DATABASE
export async function getFoods() {
  try {
    const { data, error } = await supabaseServer
      .from('foods')
      .select('*');

    if (!error && data && data.length > 0) {
      return data.map((f: any) => ({
        id: f.id,
        name: f.name,
        origin: f.origin,
        type: f.type || 'Món mặn truyền thống',
        priceRange: f.price_range || f.priceRange,
        description: f.description,
        image: f.image,
        addressRecs: f.address_recs || f.addressRecs || [],
        highlights: f.highlights || [],
      }));
    }
  } catch (e) {
    console.warn('Supabase getFoods fallback:', e);
  }

  return QUANGTRI_DATA.foods || [];
}

// 6. LẤY DANH SÁCH LỊCH TRÌNH & CUNG ĐƯỜNG (ITINERARIES) TỪ DATABASE
export async function getItineraries() {
  try {
    const { data, error } = await supabaseServer
      .from('itineraries')
      .select('*');

    if (!error && data && data.length > 0) {
      return data.map((it: any) => ({
        id: it.id,
        title: it.title,
        duration: it.duration,
        suitability: it.suitability,
        distance: it.distance,
        description: it.description,
        highlights: it.highlights || [],
        stops: it.stops || [],
      }));
    }
  } catch (e) {
    console.warn('Supabase getItineraries fallback:', e);
  }

  return QUANGTRI_DATA.itineraries || [];
}

// 7. LẤY DANH SÁCH PHÂN VÙNG CUNG ĐƯỜNG (ZONES) TỪ DATABASE
export async function getZones() {
  try {
    const { data, error } = await supabaseServer
      .from('zones')
      .select('*')
      .order('code', { ascending: true });

    if (!error && data && data.length > 0) {
      return data.map((z: any) => ({
        code: z.code,
        name: z.name,
        slug: z.slug,
        tagline: z.tagline,
        heroImage: z.hero_image || z.heroImage,
        desc: z.desc,
      }));
    }
  } catch (e) {
    console.warn('Supabase getZones fallback:', e);
  }

  return QUANGTRI_DATA.zones || [];
}

// 8. LẤY CẨM NANG & TIỆN ÍCH CỨU HỘ (GUIDES & UTILITIES) TỪ DATABASE
export async function getGuides() {
  try {
    const { data, error } = await supabaseServer
      .from('guides')
      .select('*')
      .single();

    if (!error && data) {
      return {
        bestTimeToVisit: data.best_time_to_visit || data.bestTimeToVisit || QUANGTRI_DATA.guides?.bestTimeToVisit,
        packingChecklist: data.packing_checklist || data.packingChecklist || QUANGTRI_DATA.guides?.packingChecklist,
        emergencyHotlines: data.emergency_hotlines || data.emergencyHotlines || (QUANGTRI_DATA.guides as any)?.emergencyHotlines,
        gasStations: data.gas_stations || data.gasStations || (QUANGTRI_DATA.guides as any)?.gasStations,
      };
    }
  } catch (e) {
    console.warn('Supabase getGuides fallback:', e);
  }

  return QUANGTRI_DATA.guides || {};
}

// 9. LẤY BANNER SLIDESHOW TRAVEL TỪ DATABASE
export async function getBannerSlides() {
  try {
    const { data, error } = await supabaseServer
      .from('banner_slides')
      .select('*');

    if (!error && data && data.length > 0) {
      return data.map((b: any) => ({
        img: b.img || b.image,
        caption: b.caption,
        zone: b.zone,
      }));
    }
  } catch (e) {
    console.warn('Supabase getBannerSlides fallback:', e);
  }

  return QUANGTRI_DATA.bannerSlides || [];
}
