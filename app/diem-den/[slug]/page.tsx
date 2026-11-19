import { cache } from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import SafeImage from '@/components/common/SafeImage';
import PlaceActionsClient from './PlaceActionsClient';
import { getPlaceBySlug, getPlaces, getServices } from '@/lib/get-data';

export const revalidate = 60;

interface PageProps {
  params: Promise<{ slug: string }>;
}

const getCachedPlace = cache(async (slug: string) => {
  return getPlaceBySlug(slug);
});

export async function generateStaticParams() {
  const places = await getPlaces();
  return places.map((p) => ({
    slug: p.id,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const place = await getCachedPlace(slug);

  if (!place) {
    return { title: 'Điểm Đến Không Tồn Tại' };
  }

  const title = `${place.name} · Cẩm Nang Du Lịch`;
  const description = `${place.shortDesc} Khám phá kinh nghiệm, giá vé, giờ mở cửa và tọa độ định vị chi tiết.`;

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
          url: place.image || 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',
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
  const [place, allPlaces, allServices] = await Promise.all([
    getCachedPlace(slug),
    getPlaces(),
    getServices(),
  ]);

  if (!place) {
    notFound();
  }

  const nearbyPlaces = allPlaces
    .filter((p) => p.id !== place.id && p.zoneCode === place.zoneCode)
    .slice(0, 3);

  const nearbyServices = allServices
    .filter((s) => s.zoneCode === place.zoneCode)
    .slice(0, 3);

  const coordsRaw = (place.coordinates || '16.7533° N, 107.1912° E').split(',');
  const coords = coordsRaw
    .map((s) => parseFloat(s.replace(/[^0-9.]/g, '')))
    .filter((n) => !isNaN(n));
  const lat = coords[0] || 16.8;
  const lng = coords[1] || 107.1;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://quangtri.wiki';

  const touristAttractionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: place.name,
    description: place.shortDesc,
    image: place.image,
    touristType: place.categoryName,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: lat,
      longitude: lng,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: place.zoneName,
      addressRegion: 'Tỉnh Quảng Trị',
      addressCountry: 'VN',
      streetAddress: place.address,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: place.rating || 4.9,
      reviewCount: place.reviewsCount || 120,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Cung đường', item: `${baseUrl}/cung-duong` },
      { '@type': 'ListItem', position: 3, name: place.name, item: `${baseUrl}/diem-den/${place.id}` },
    ],
  };

  const galleryImages = Array.isArray(place.gallery) && place.gallery.length > 1 ? place.gallery : [];

  return (
    <div style={{ backgroundColor: '#f7f4ee', minHeight: '100vh', color: '#1b2a22' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristAttractionJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <Navbar />

      <main style={{ maxWidth: '1060px', margin: '2rem auto 4rem', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', alignItems: 'center', fontSize: '0.84rem', color: '#68776f', marginBottom: '1.25rem' }}>
          <Link href="/" style={{ color: '#133e2f', fontWeight: 600 }}>Trang chủ</Link>
          <span>/</span>
          <Link href="/cung-duong" style={{ color: '#133e2f', fontWeight: 600 }}>Cung đường ({place.zoneCode})</Link>
          <span>/</span>
          <span style={{ color: '#4b5563' }}>{place.name}</span>
        </nav>

        {/* Hero Header */}
        <div
          className="place-detail-hero"
          style={{
            position: 'relative',
            height: '420px',
            borderRadius: '24px',
            overflow: 'hidden',
            marginBottom: '2rem',
            boxShadow: '0 12px 36px rgba(0,0,0,0.1)',
          }}
        >
          <SafeImage
            src={place.image}
            alt={place.name}
            fill
            priority
            sizes="(max-width: 1060px) 100vw, 1060px"
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(19, 62, 47, 0.92) 0%, rgba(19, 62, 47, 0.25) 60%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              padding: '2.25rem',
              color: '#fff',
              zIndex: 2,
            }}
          >
            <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.8rem' }}>
              <span style={{ background: 'rgba(255,255,255,0.22)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                {place.zoneCode} · {place.zoneName}
              </span>
              <span style={{ background: 'rgba(255,255,255,0.22)', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem' }}>
                {place.categoryName}
              </span>
              <span style={{ background: '#d97706', padding: '0.25rem 0.75rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                ★ {place.rating} ({place.reviewsCount} đánh giá)
              </span>
            </div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.85rem, 4vw, 2.8rem)', margin: 0, lineHeight: 1.15 }}>
              {place.name}
            </h1>
          </div>
        </div>

        {/* Responsive 2-column content grid */}
        <div className="place-detail-grid">
          <div>
            <section style={{ background: '#fff', padding: '2rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', color: '#133e2f', marginTop: 0, fontSize: '1.5rem' }}>
                Giới thiệu & Lịch sử
              </h2>
              <p style={{ lineHeight: 1.8, color: '#374151', fontSize: '1.02rem' }}>
                {place.history || place.fullDesc || place.shortDesc}
              </p>
            </section>

            {Array.isArray(place.highlights) && place.highlights.length > 0 && (
              <section style={{ background: '#fff', padding: '2rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#133e2f', marginTop: 0, fontSize: '1.5rem' }}>
                  Điểm nhấn không thể bỏ qua
                </h2>
                <ul style={{ paddingLeft: '1.2rem', lineHeight: 1.9, color: '#374151', marginBottom: 0 }}>
                  {place.highlights.map((hl, idx) => (
                    <li key={idx} style={{ marginBottom: '0.45rem' }}>{hl}</li>
                  ))}
                </ul>
              </section>
            )}

            {place.tips && (
              <section
                style={{
                  background: '#fefce8',
                  padding: '1.5rem 1.75rem',
                  borderRadius: '18px',
                  border: '1px solid #fde047',
                  marginBottom: '1.5rem',
                }}
              >
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#854d0e', marginTop: 0, marginBottom: '0.5rem', fontSize: '1.25rem' }}>
                  💡 Kinh nghiệm & Lưu ý phượt thủ
                </h2>
                <p style={{ margin: 0, lineHeight: 1.75, color: '#713f12', fontSize: '0.96rem' }}>
                  {place.tips}
                </p>
              </section>
            )}

            {galleryImages.length > 0 && (
              <section style={{ background: '#fff', padding: '1.75rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', color: '#133e2f', marginTop: 0, marginBottom: '1rem', fontSize: '1.4rem' }}>
                  Thư viện hình ảnh thực tế
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                  {galleryImages.map((imgUrl, idx) => (
                    <div key={idx} style={{ position: 'relative', height: '150px', borderRadius: '12px', overflow: 'hidden' }}>
                      <SafeImage src={imgUrl} alt={`${place.name} - ảnh ${idx + 1}`} fill sizes="240px" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar Info */}
          <aside>
            <div className="place-detail-sidebar-card" style={{ background: '#fff', padding: '1.8rem', borderRadius: '18px', border: '1px solid rgba(27,42,34,0.08)' }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', color: '#133e2f', marginTop: 0, marginBottom: '1.1rem' }}>
                Thông tin hành trình
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem', color: '#4b5563' }}>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>📍 Địa chỉ:</strong>
                  <span>{place.address}</span>
                </div>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>🕒 Giờ mở cửa:</strong>
                  <span>{place.openHours || 'Mở cửa cả ngày'}</span>
                </div>
                <div>
                  <strong style={{ color: '#133e2f', display: 'block' }}>🎟️ Giá vé:</strong>
                  <span>{place.ticket || 'Miễn phí'}</span>
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

                <PlaceActionsClient
                  placeId={place.id}
                  placeName={place.name}
                  coordinates={place.coordinates}
                />
              </div>
            </div>
          </aside>
        </div>

        {/* Nearby Places & Services in same Zone */}
        {(nearbyPlaces.length > 0 || nearbyServices.length > 0) && (
          <section style={{ marginTop: '3.5rem', paddingTop: '2.5rem', borderTop: '1px solid rgba(27,42,34,0.1)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  CÙNG CUNG ĐƯỜNG {place.zoneCode}
                </span>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.75rem', color: '#133e2f', margin: '0.25rem 0 0' }}>
                  Khám phá & Lưu trú lân cận ({place.zoneName})
                </h2>
              </div>
              <Link href="/cung-duong" style={{ color: '#133e2f', fontWeight: 700, fontSize: '0.9rem' }}>
                Xem bản đồ toàn tỉnh →
              </Link>
            </div>

            {nearbyPlaces.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                {nearbyPlaces.map((np) => (
                  <Link
                    key={np.id}
                    href={`/diem-den/${np.id}`}
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      overflow: 'hidden',
                      border: '1px solid rgba(27,42,34,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: '150px' }}>
                      <SafeImage src={np.image} alt={np.name} fill sizes="300px" />
                    </div>
                    <div style={{ padding: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700 }}>{np.categoryName}</span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.15rem', color: '#133e2f', margin: '0.25rem 0 0.35rem' }}>
                        {np.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.84rem', color: '#6b7280' }}>{np.ticket || 'Miễn phí'}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {nearbyServices.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '1.25rem' }}>
                {nearbyServices.map((srv) => (
                  <div
                    key={srv.id}
                    style={{
                      background: '#fff',
                      borderRadius: '14px',
                      padding: '1.2rem',
                      border: '1px solid rgba(27,42,34,0.08)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '0.6rem',
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '0.74rem', fontWeight: 700, color: '#133e2f', background: '#ecfdf5', padding: '2px 8px', borderRadius: '12px' }}>
                        {srv.typeLabel}
                      </span>
                      <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#133e2f', margin: '0.45rem 0 0.25rem' }}>
                        {srv.name}
                      </h3>
                      <p style={{ fontSize: '0.83rem', color: '#6b7280', margin: 0 }}>{srv.price}</p>
                    </div>
                    <Link href="/dich-vu" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#047857' }}>
                      Đặt dịch vụ / Liên hệ trực tiếp →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
