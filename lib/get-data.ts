import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';
import dbFallback from '@/legacy/db.json';

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
        rating: p.rating,
        reviewsCount: p.rating_count,
        shortDesc: p.short_desc,
        fullDesc: p.history,
        highlights: p.highlights || [],
        coordinates: p.coordinates,
        address: p.address,
        openHours: p.open_time,
        ticket: p.ticket_price,
        tips: p.tips,
      }));
    }
  } catch (e) {
    console.warn('Supabase getPlaces fallback to local:', e);
  }

  // Fallback to local 24 places
  return QUANGTRI_DATA.places;
}

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
    console.warn('Supabase getServices fallback to local:', e);
  }

  // Fallback to local verified services
  return QUANGTRI_DATA.services || [];
}

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
    console.warn('Supabase getThreads fallback to local:', e);
  }

  // Fallback to db.json threads
  return dbFallback.threads || [];
}
