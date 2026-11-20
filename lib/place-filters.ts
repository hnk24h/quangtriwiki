import type { Place } from '@/lib/supabase/types';

export const PLACE_CATEGORY_IDS = ['history', 'cloud', 'beach', 'island', 'waterfall'] as const;

/** Single source of truth for the "phượt" theme category filter (home + /cung-duong). */
export function matchesPlaceCategory(p: Place, category: string): boolean {
  if (category === 'all') return true;

  if (category === 'history') {
    return p.category === 'history' || p.categoryName.toLowerCase().includes('lịch sử');
  }
  if (category === 'cloud') {
    return (
      p.category === 'adventure' ||
      p.category === 'checkin' ||
      p.id.includes('sa-mu') ||
      p.id.includes('gio') ||
      p.id.includes('ta-con') ||
      p.name.includes('Sa Mù') ||
      p.name.includes('Gió') ||
      p.name.includes('Tà Cơn')
    );
  }
  if (category === 'beach') {
    return (
      p.category === 'beach' ||
      p.id.includes('cua-viet') ||
      p.id.includes('cua-tung') ||
      p.id.includes('mui-treo') ||
      p.name.includes('Biển') ||
      p.name.includes('Mũi Trèo')
    );
  }
  if (category === 'island') {
    return p.category === 'island' || p.id.includes('con-co') || p.name.includes('Cồn Cỏ');
  }
  if (category === 'waterfall') {
    return (
      p.category === 'nature' ||
      p.id.includes('thac') ||
      p.id.includes('suoi') ||
      p.id.includes('dakrong') ||
      p.name.includes('Thác') ||
      p.name.includes('Suối') ||
      p.name.includes('Đakrông')
    );
  }
  return p.category === category;
}

export function matchesPlaceSearch(p: Place, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return (
    p.name.toLowerCase().includes(q) ||
    p.shortDesc.toLowerCase().includes(q) ||
    p.zoneName.toLowerCase().includes(q) ||
    p.zoneCode.toLowerCase().includes(q)
  );
}
