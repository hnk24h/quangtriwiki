import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { supabaseServer } from '@/lib/supabase/server';
import { QUANGTRI_DATA } from '@/lib/data';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return QUANGTRI_DATA.places.map((p) => ({
    slug: p.id,
  }));
}

async function fetchPlace(slug: string) {
  const local = QUANGTRI_DATA.places.find((p) => p.id === slug);

  try {
    const { data: place } = await supabaseServer
      .from('places')
      .select('*')
      .eq('id', slug)
      .single();

    if (place) {
      return {
        id: place.id,
        name: place.name || local?.name || 'Điểm đến Quảng Trị',
        zone_code: place.zone_code || local?.zoneCode || 'QT-01',
        zone_name: place.zone_name || local?.zoneName || 'Quảng Trị',
        category: place.category || local?.category || 'history',
        category_name: place.category_name || local?.categoryName || 'Di tích lịch sử',
        hero_image: place.hero_image || local?.image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
        rating: place.rating || local?.rating || 4.9,
        rating_count: place.rating_count || local?.reviewsCount || 120,
        short_desc: place.short_desc || local?.shortDesc || '',
        history: place.history || local?.fullDesc || place.short_desc || local?.shortDesc || '',
        highlights: Array.isArray(place.highlights)
          ? place.highlights
          : typeof place.highlights === 'string'
          ? place.highlights.replace(/^\{|\}$/g, '').split(',').map((s: string) => s.replace(/^"|"$/g, '').trim()).filter(Boolean)
          : local?.highlights || [],
        coordinates: place.coordinates || local?.coordinates || '16.7533° N, 107.1912° E',
        address: place.address || local?.address || 'Tỉnh Quảng Trị',
        open_time: place.open_time || local?.openHours || '07:00 - 17:30',
        ticket_price: place.ticket_price || local?.ticket || 'Miễn phí',
        tips: place.tips || local?.tips || '',
      };
    }
  } catch (e) {}

  // Fallback to local places
  if (local) {
    return {
      id: local.id,
      name: local.name,
      zone_code: local.zoneCode,
      zone_name: local.zoneName,
      category: local.category,
      category_name: local.categoryName,
      hero_image: local.image,
      rating: local.rating,
      rating_count: local.reviewsCount,
      short_desc: local.shortDesc,
      history: local.fullDesc || local.shortDesc,
      highlights: local.highlights || [],
      coordinates: local.coordinates,
      address: local.address,
      open_time: local.openHours || '07:00 - 17:30',
      ticket_price: local.ticket || 'Miễn phí',
      tips: local.tips,
    };
  }

  return null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await fetchPlace(slug);

  if (!place) {
    return { title: 'Điểm Đến Không Tồn Tại' };
  }

  const title = `${place.name} · Cẩm Nang Du Lịch`;
  const description = `${place.short_desc} Khám phá kinh nghiệm, giá vé, giờ mở cửa và tọa độ định vị chi tiết.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://quangtri.wiki/diem-den/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://quangtri.wiki/diem-den/${slug}`,
      images: [
        {
          url: place.hero_image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: place.name,
        },
      ],
    },
  };
}

export default async function PlaceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const place = await fetchPlace(slug);

  if (!place) {
    notFound();
  }

  const coordsRaw = (place.coordinates || '16.7533° N, 107.1912° E').split(',');
  const coords = coordsRaw.map((s: string) => parseFloat(s.replace(/[^0-9.]/g, ''))).filter((n: number) => !isNaN(n));
  const lat = coords[0] || 16.8;
  const lng = coords[1] || 107.1;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.short_desc,
    image: place.hero_image,
    touristType: place.category_name,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.zone_name,
      addressRegion: 'Tỉnh Quảng Trị',
      addressCountry: 'VN',
      streetAddress: place.address,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: place.rating || 4.9,
      reviewCount: place.rating_count || 120,
    },
  };

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Top Bar */}
      <header style={{
        padding: '1.2rem 2.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid rgba(27,42,34,0.08)',
        backgroundColor: 'rgba(247, 244, 238, 0.95)',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link href="/" style={{ textDecoration: 'none', color: '#133e2f', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.3rem' }}>←</span>
          <span style={{ fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: '1.2rem' }}>QuangTri.wiki</span>
        </Link>
        <span style={{ fontSize: '0.85rem', color: '#68776f' }}>
          Mã cung đường: <strong style={{ color: '#133e2f' }}>{place.zone_code}</strong> · {place.zone_name}
        </span>
      </header>

      {/* Hero Header */}
      <main style={{ maxWidth: '980px', margin: '2.5rem auto', padding: '0 1.5rem' }}>
        <div style={{
          position: 'relative',
          height: '420px',
          borderRadius: '24px',
          overflow: 'hidden',
          marginBottom: '2rem',
          boxShadow: '0 12px 36px rgba(0,0,0,0.1)'
        }}>
          <img
            src={place.hero_image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80'}
            alt={place.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(19, 62, 47, 0.92) 0%, rgba(19, 62, 47, 0.2) 60%, transparent 100%)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '2.5rem',
            color: '#fff',
          }}>
            <div style={{ display: 'inline-flex', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.25)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                {place.category_name}
              </span>
              <span style={{ background: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                ★ {place.rating} ({place.rating_count} đánh giá)
              </span>
            </div>
            <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '2.8rem', margin: 0, lineHeight: 1.15 }}>
              {place.name}
            </h1>
          </div>
        </div>

        {/* Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          <div>
            <section style={{ background: '#fff', padding: '2rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#133e2f', marginTop: 0, fontSize: '1.5rem' }}>
                Giới thiệu & Lịch sử
              </h2>
              <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.05rem' }}>
                {place.history || place.short_desc}
              </p>
            </section>

            {Array.isArray(place.highlights) && place.highlights.length > 0 && (
              <section style={{ background: '#fff', padding: '2rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)' }}>
                <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#133e2f', marginTop: 0, fontSize: '1.5rem' }}>
                  Điểm nhấn không thể bỏ qua
                </h2>
                <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.9, color: '#374151' }}>
                  {place.highlights.map((hl: string, idx: number) => (
                    <li key={idx} style={{ marginBottom: '0.5rem' }}>{hl}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <div>
            <div style={{ background: '#fff', padding: '1.8rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)' }}>
              <h3 style={{ fontFamily: 'Playfair Display, serif', color: '#133e2f', marginTop: 0 }}>
                Thông tin hành trình
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#4b5563' }}>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>📍 Địa chỉ:</strong>
                  <span>{place.address}</span>
                </div>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>🕒 Giờ mở cửa:</strong>
                  <span>{place.open_time || 'Mở cửa cả ngày'}</span>
                </div>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>🎟️ Giá vé:</strong>
                  <span>{place.ticket_price || 'Miễn phí'}</span>
                </div>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>🧭 Tọa độ GPS:</strong>
                  <span>{place.coordinates}</span>
                </div>
              </div>

              <div style={{ marginTop: '1.5rem', paddingTop: '1.2rem', borderTop: '1px solid #f3f4f6' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' Quảng Trị')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: '#133e2f',
                    color: '#fff',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Mở Google Maps chỉ đường ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
