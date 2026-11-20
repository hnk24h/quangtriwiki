import React from 'react';
import Link from 'next/link';
import SafeImage from '@/components/common/SafeImage';
import type { Food, Itinerary, Place, Thread } from '@/lib/supabase/types';
import type { NearbyPlace, RouteEstimate, TransportTip } from '@/lib/place-guide';

interface PlaceGuideSectionsProps {
  place: Place;
  routes: RouteEstimate[];
  transportTips: TransportTip[];
  directionsUrl: string;
  foods: Food[];
  foodsAreGeneral?: boolean;
  nearest: NearbyPlace[];
  threads: Thread[];
  threadsAreGeneral?: boolean;
  itineraries: Itinerary[];
}

function excerpt(text: string, max = 170): string {
  const clean = (text || '').replace(/\s+/g, ' ').trim();
  return clean.length > max ? `${clean.slice(0, max).trim()}…` : clean;
}

export default function PlaceGuideSections({
  place,
  routes,
  transportTips,
  directionsUrl,
  foods,
  foodsAreGeneral = false,
  nearest,
  threads,
  threadsAreGeneral = false,
  itineraries,
}: PlaceGuideSectionsProps) {
  return (
    <>
      {/* 1. Cách đi & phương tiện */}
      <section id="cach-di" className="pg-section">
        <div className="pg-section-head">
          <span className="pg-kicker">🧭 Cách đi</span>
          <h2 className="pg-title">Đi đến {place.name} như thế nào?</h2>
        </div>

        {routes.length > 0 && (
          <div className="pg-route-grid">
            {routes.map((r) => (
              <div key={r.origin.id} className="pg-route-card">
                <div className="pg-route-from">Từ {r.origin.label}</div>
                <div className="pg-route-km">~{Math.round(r.roadKm)} km</div>
                <div className="pg-route-times">
                  <span>🏍️ {r.motorbike}</span>
                  <span>🚗 {r.car}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="pg-note">
          Số liệu ước tính theo khoảng cách tới điểm đến, chỉ mang tính tham khảo. Hãy mở bản đồ để xem lộ trình thực tế.
        </p>

        <div className="pg-tip-list">
          {transportTips.map((tip) => (
            <div key={tip.title} className="pg-tip-item">
              <span className="pg-tip-icon">{tip.icon}</span>
              <div>
                <strong>{tip.title}</strong>
                <p>{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="pg-btn-primary">
          Chỉ đường từ Đông Hà bằng Google Maps ↗
        </a>
      </section>

      {/* 2. Nên ăn gì */}
      {foods.length > 0 && (
        <section id="an-gi" className="pg-section">
          <div className="pg-section-head">
            <span className="pg-kicker">🍲 Ẩm thực</span>
            <h2 className="pg-title">
              {foodsAreGeneral ? 'Đặc sản nên thử khi đến Quảng Trị' : `Nên ăn gì quanh ${place.name}?`}
            </h2>
          </div>
          <div className="pg-food-grid">
            {foods.map((food) => (
              <article key={food.id} className="pg-food-card">
                <div className="pg-food-media">
                  <SafeImage src={food.image} alt={food.name} fill sizes="(max-width: 640px) 100vw, 260px" />
                </div>
                <div className="pg-food-body">
                  <span className="pg-food-type">{food.type}</span>
                  <h3>{food.name}</h3>
                  <div className="pg-food-price">💰 {food.priceRange}</div>
                  {food.tasteNotes && <p className="pg-food-taste">{excerpt(food.tasteNotes, 110)}</p>}
                  {Array.isArray(food.addressRecs) && food.addressRecs.length > 0 && (
                    <div className="pg-food-where">📍 {food.addressRecs[0]}</div>
                  )}
                </div>
              </article>
            ))}
          </div>
          <Link href="/am-thuc" className="pg-link-more">
            Xem tất cả đặc sản Quảng Trị →
          </Link>
        </section>
      )}

      {/* 3. Nên chơi ở đâu */}
      {nearest.length > 0 && (
        <section id="choi-o-dau" className="pg-section">
          <div className="pg-section-head">
            <span className="pg-kicker">🎒 Khám phá</span>
            <h2 className="pg-title">Nên đi chơi ở đâu gần đây?</h2>
          </div>
          <div className="pg-nearby-list">
            {nearest.map(({ place: np, km, motorbike, sameZone }) => (
              <Link key={np.id} href={`/diem-den/${np.id}`} className="pg-nearby-item">
                <span className="pg-nearby-thumb">
                  <SafeImage src={np.image} alt={np.name} fill sizes="72px" />
                </span>
                <span className="pg-nearby-info">
                  <span className="pg-nearby-name">{np.name}</span>
                  <span className="pg-nearby-meta">
                    {np.categoryName} · ★ {np.rating}
                  </span>
                  <span className="pg-nearby-dist">
                    ~{Math.max(1, Math.round(km))} km · 🏍️ {motorbike}
                    {sameZone && <em>Cùng vùng</em>}
                  </span>
                </span>
              </Link>
            ))}
          </div>

          {itineraries.length > 0 && (
            <div className="pg-itin-box">
              <strong>Nằm trong lịch trình gợi ý:</strong>
              <div className="pg-itin-chips">
                {itineraries.map((it) => (
                  <Link key={it.id} href="/lich-trinh" className="pg-itin-chip">
                    🗺️ {it.title} · {it.duration}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {/* 4. Trải nghiệm từ người đã đi */}
      <section id="nguoi-da-di" className="pg-section">
        <div className="pg-section-head">
          <span className="pg-kicker">💬 Cộng đồng</span>
          <h2 className="pg-title">Người đã đi chia sẻ gì?</h2>
        </div>

        {threads.length > 0 && threadsAreGeneral && (
          <p className="pg-note" style={{ marginTop: 0 }}>
            Chưa có chia sẻ riêng cho khu vực này, dưới đây là trải nghiệm nổi bật từ cộng đồng phượt thủ Quảng Trị.
          </p>
        )}

        {threads.length > 0 ? (
          <div className="pg-review-list">
            {threads.map((t) => {
              const author = t.author_name || t.author;
              const avatar = t.author_avatar || t.avatar;
              const badge = t.author_badge || t.badge;
              const comments = (t.comments || []).slice(0, 2);
              return (
                <article key={t.id} className="pg-review-card">
                  <header className="pg-review-head">
                    <span className="pg-review-avatar">
                      <SafeImage src={avatar} alt={author} fill sizes="40px" />
                    </span>
                    <div>
                      <strong>{author}</strong>
                      <div className="pg-review-sub">
                        {badge && <span className="pg-review-badge">{badge}</span>}
                        {t.time && <span>{t.time}</span>}
                      </div>
                    </div>
                  </header>
                  <h3 className="pg-review-title">{t.title}</h3>
                  <p className="pg-review-text">{excerpt(t.content)}</p>
                  {comments.length > 0 && (
                    <div className="pg-review-comments">
                      {comments.map((c) => (
                        <p key={c.id}>
                          <strong>{c.author_name}:</strong> {excerpt(c.text, 120)}
                        </p>
                      ))}
                    </div>
                  )}
                  <footer className="pg-review-foot">
                    <span>❤️ {t.likes_count ?? t.likes ?? 0}</span>
                    <span>💬 {(t.comments || []).length}</span>
                    <span className="pg-review-tag">{t.tag}</span>
                  </footer>
                </article>
              );
            })}
          </div>
        ) : (
          <p className="pg-empty">
            Chưa có chia sẻ nào cho khu vực này. Hãy là người đầu tiên kể lại chuyến đi của bạn!
          </p>
        )}

        <Link href="/dien-dan" className="pg-link-more">
          Xem diễn đàn &amp; chia sẻ trải nghiệm của bạn →
        </Link>
      </section>
    </>
  );
}
