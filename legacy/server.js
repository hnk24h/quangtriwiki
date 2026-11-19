const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.resolve(__dirname);
const DB_FILE = path.join(PUBLIC_DIR, 'db.json');
const QUANGTRI_DATA = require('./data.js');

// Database Helpers
function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      initDb();
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading db.json:', e);
    return { threads: QUANGTRI_DATA.forumThreads || [], partners: QUANGTRI_DATA.services || [], partnerRegistrations: [], leads: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (e) {
    console.error('Error writing db.json:', e);
    return false;
  }
}

function initDb() {
  const initial = {
    threads: QUANGTRI_DATA.forumThreads || [],
    partners: QUANGTRI_DATA.services || [],
    partnerRegistrations: [],
    leads: []
  };
  writeDb(initial);
}

// MIME Types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8'
};

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

async function appHandler(req, res) {
  const urlObj = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURI(urlObj.pathname);

  // CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    res.end();
    return;
  }

  // =========================================================================
  // API Endpoints
  // =========================================================================

  // 1. API: Danh sách điểm đến
  if (pathname === '/api/places' && req.method === 'GET') {
    return sendJson(res, 200, { success: true, places: QUANGTRI_DATA.places });
  }

  // 2. API: Lấy danh sách Threads diễn đàn
  if (pathname === '/api/threads' && req.method === 'GET') {
    const db = readDb();
    if (!db.threads || db.threads.length === 0) {
      db.threads = QUANGTRI_DATA.forumThreads || [];
      writeDb(db);
    }
    return sendJson(res, 200, { success: true, threads: db.threads });
  }

  // 3. API: Đăng thread mới vào diễn đàn
  if (pathname === '/api/threads' && req.method === 'POST') {
    const body = await parseRequestBody(req);
    if (!body.author || !body.title || !body.content) {
      return sendJson(res, 400, { success: false, message: 'Vui lòng điền đủ họ tên, tiêu đề và nội dung' });
    }

    const db = readDb();
    const newThread = {
      id: `thread-${Date.now()}`,
      author: body.author,
      avatar: body.avatar || `https://images.unsplash.com/photo-${1535713875002 + Math.floor(Math.random() * 500)}?auto=format&fit=crop&w=150&q=80`,
      badge: body.badge || 'Du khách',
      time: 'Vừa xong',
      zoneCode: body.zoneCode || 'QT-01',
      tag: body.tag || 'Kinh nghiệm',
      title: body.title,
      content: body.content,
      images: body.images || [],
      likes: 1,
      comments: []
    };

    if (!db.threads) db.threads = [];
    db.threads.unshift(newThread);
    writeDb(db);

    return sendJson(res, 201, { success: true, thread: newThread });
  }

  // 4. API: Thêm comment vào thread
  if (pathname.startsWith('/api/threads/') && pathname.endsWith('/comments') && req.method === 'POST') {
    const parts = pathname.split('/');
    const threadId = parts[3];
    const body = await parseRequestBody(req);

    if (!body.text) {
      return sendJson(res, 400, { success: false, message: 'Nội dung bình luận không được trống' });
    }

    const db = readDb();
    const thread = (db.threads || []).find(t => t.id === threadId);
    if (!thread) {
      return sendJson(res, 404, { success: false, message: 'Không tìm thấy bài viết' });
    }

    if (!thread.comments) thread.comments = [];
    const newComment = {
      author: body.author || 'Du khách ẩn danh',
      avatar: body.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80',
      time: 'Vừa xong',
      text: body.text
    };

    thread.comments.push(newComment);
    writeDb(db);

    return sendJson(res, 201, { success: true, comment: newComment });
  }

  // 5. API: Lấy danh sách dịch vụ đối tác bản địa
  if ((pathname === '/api/services' || pathname === '/api/partners') && req.method === 'GET') {
    const db = readDb();
    const services = (db.partners && db.partners.length > 0) ? db.partners : (QUANGTRI_DATA.services || []);
    return sendJson(res, 200, { success: true, services });
  }

  // 6. API: Đăng ký đối tác mới (Homestay, Nhà xe, Quán ăn, Tour guide)
  if (pathname === '/api/partners/register' && req.method === 'POST') {
    const body = await parseRequestBody(req);
    if (!body.businessName || !body.phone || !body.category) {
      return sendJson(res, 400, { success: false, message: 'Vui lòng điền đủ Tên cơ sở, Số điện thoại và Loại hình kinh doanh' });
    }

    const db = readDb();
    const newReg = {
      id: `partner-reg-${Date.now()}`,
      businessName: body.businessName,
      contactPerson: body.contactPerson || body.businessName,
      category: body.category,
      categoryName: body.categoryName || body.category,
      zoneCode: body.zoneCode || 'QT-01',
      address: body.address || 'Quảng Trị',
      phone: body.phone,
      zalo: body.zalo || body.phone,
      priceRange: body.priceRange || 'Liên hệ',
      description: body.description || '',
      status: 'pending_review',
      createdAt: new Date().toISOString()
    };

    if (!db.partnerRegistrations) db.partnerRegistrations = [];
    db.partnerRegistrations.unshift(newReg);
    writeDb(db);

    return sendJson(res, 201, {
      success: true,
      message: 'Hồ sơ đã được gửi thành công! Đội ngũ QuangTri.wiki sẽ liên hệ qua điện thoại/Zalo trong 24h để xác thực và đưa dịch vụ lên website.',
      registration: newReg
    });
  }

  // 7. API: Ghi nhận Lead & Click đặt phòng/gọi xe (Monetization & Conversion Tracking)
  if (pathname === '/api/leads' && req.method === 'POST') {
    const body = await parseRequestBody(req);
    const db = readDb();
    const lead = {
      id: `lead-${Date.now()}`,
      type: body.type || 'click_to_contact',
      partnerId: body.partnerId || 'general',
      partnerName: body.partnerName || 'Chung',
      source: body.source || 'website_card',
      timestamp: new Date().toISOString()
    };

    if (!db.leads) db.leads = [];
    db.leads.push(lead);
    writeDb(db);

    return sendJson(res, 200, { success: true, leadId: lead.id });
  }

  // 8. API: Admin Metrics & Monetization Stats
  if (pathname === '/api/admin/metrics' && req.method === 'GET') {
    const db = readDb();
    const totalLeads = (db.leads || []).length;
    const totalRegistrations = (db.partnerRegistrations || []).length;
    const totalThreads = (db.threads || []).length;
    const totalPartners = (db.partners || []).length;

    return sendJson(res, 200, {
      success: true,
      metrics: {
        totalLeads,
        totalRegistrations,
        totalThreads,
        totalPartners,
        estimatedRevenue: `${(totalRegistrations * 500000 + totalLeads * 15000).toLocaleString('vi-VN')} VNĐ`
      }
    });
  }

  // =========================================================================
  // SEO Routes: sitemap.xml & robots.txt & Dynamic Place Landing Pages
  // =========================================================================

  // Sitemap.xml chuẩn Google Search Console
  if (pathname === '/sitemap.xml') {
    const baseUrl = 'https://quangtri.wiki';
    const places = QUANGTRI_DATA.places || [];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>2026-11-19</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#cung-duong</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#dien-dan</loc>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/#dich-vu</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
${places.map(p => `  <url>
    <loc>${baseUrl}/diem-den/${p.id}</loc>
    <lastmod>2026-11-19</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`).join('\n')}
</urlset>`;

    res.writeHead(200, { 'Content-Type': 'application/xml; charset=utf-8' });
    res.end(xml);
    return;
  }

  // Robots.txt
  if (pathname === '/robots.txt') {
    const robots = `User-agent: *
Allow: /
Disallow: /api/admin/

Sitemap: https://quangtri.wiki/sitemap.xml
`;
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(robots);
    return;
  }

  // Dynamic Destination SEO Landing Page: /diem-den/:id
  if (pathname.startsWith('/diem-den/')) {
    const placeId = pathname.replace('/diem-den/', '').replace(/\/$/, '');
    const place = (QUANGTRI_DATA.places || []).find(p => p.id === placeId);

    if (place) {
      const coords = place.coordinates.split(',').map(s => parseFloat(s.replace(/[^0-9.]/g, ''))).filter(n => !isNaN(n));
      const lat = coords[0] || 16.8;
      const lng = coords[1] || 107.1;

      const seoHtml = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${place.name} · Cẩm Nang Du Lịch QuangTri.wiki</title>
  <meta name="description" content="${place.shortDesc} Khám phá kinh nghiệm, giá vé, giờ mở cửa và bản đồ đường đi chi tiết." />
  <link rel="canonical" href="https://quangtri.wiki/diem-den/${place.id}" />

  <!-- OpenGraph Meta Tags -->
  <meta property="og:title" content="${place.name} - QuangTri.wiki" />
  <meta property="og:description" content="${place.shortDesc}" />
  <meta property="og:image" content="${place.image}" />
  <meta property="og:type" content="article" />
  <meta property="og:url" content="https://quangtri.wiki/diem-den/${place.id}" />

  <!-- Schema.org JSON-LD Structured Data for Google Rich Snippets -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "TouristAttraction",
    "name": "${place.name}",
    "description": "${place.shortDesc}",
    "image": "${place.image}",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "${place.address}",
      "addressRegion": "Quảng Trị",
      "addressCountry": "VN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": ${lat},
      "longitude": ${lng}
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "${place.rating}",
      "reviewCount": "${place.reviewsCount}"
    }
  }
  </script>

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Plus+Jakarta+Sans:wght@400;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css" />
</head>
<body style="background: var(--bg-main); color: var(--text-main);">
  <header class="site-header" style="background: var(--bg-header-scrolled); position: relative;">
    <div class="header-inner">
      <a href="/" class="brand">
        <div class="brand-title">Quangtri Wiki</div>
      </a>
      <a href="/" style="padding: 0.5rem 1.25rem; background: var(--primary); color: white; border-radius: 9999px; font-size: 0.85rem; font-weight: 700;">
        ← Về Trang Chủ Khám Phá
      </a>
    </div>
  </header>

  <main style="max-width: 900px; margin: 2rem auto; padding: 0 1.25rem;">
    <div style="border-radius: var(--radius-lg); overflow: hidden; box-shadow: var(--shadow-lg); background: var(--bg-card); border: 1px solid var(--border);">
      <img src="${place.image}" alt="${place.name}" style="width: 100%; max-height: 440px; object-fit: cover;" />
      
      <div style="padding: 2rem;">
        <div style="display: flex; gap: 0.5rem; align-items: center; margin-bottom: 0.5rem;">
          <span style="background: var(--primary-light); color: var(--primary); font-weight: 700; font-size: 0.75rem; padding: 0.2rem 0.6rem; border-radius: 4px;">
            ${place.zoneCode} · ${place.categoryName}
          </span>
          <span style="color: #d97706; font-weight: 700; font-size: 0.85rem;">⭐ ${place.rating} (${place.reviewsCount} đánh giá)</span>
        </div>

        <h1 style="font-family: var(--font-serif); font-size: 2.4rem; color: var(--text-title); margin-bottom: 1rem; line-height: 1.2;">
          ${place.name}
        </h1>

        <p style="font-size: 1.05rem; line-height: 1.7; color: var(--text-main); margin-bottom: 1.5rem;">
          ${place.fullDesc}
        </p>

        <h3 style="font-size: 1.15rem; font-weight: 800; color: var(--primary); margin-bottom: 0.75rem;">Trải nghiệm nổi bật:</h3>
        <ul style="margin-left: 1.5rem; line-height: 1.8; margin-bottom: 1.75rem;">
          ${place.highlights.map(h => `<li>✨ ${h}</li>`).join('')}
        </ul>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; padding: 1.25rem; background: var(--bg-card-subtle); border-radius: var(--radius-md); border: 1px solid var(--border); margin-bottom: 2rem;">
          <div><strong>🎟️ Giá vé:</strong> <div>${place.ticket}</div></div>
          <div><strong>⏰ Giờ mở cửa:</strong> <div>${place.openHours}</div></div>
          <div><strong>📍 Tọa độ & Địa chỉ:</strong> <div>${place.address} (${place.coordinates})</div></div>
          <div><strong>💡 Lưu ý cẩm nang:</strong> <div>${place.tips}</div></div>
        </div>

        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="padding: 0.75rem 1.5rem; background: var(--primary); color: white; border-radius: 9999px; font-weight: 700; text-decoration: none; display: inline-flex; align-items: center; gap: 0.4rem;">
            🗺️ Mở Chỉ Đường Google Maps ↗
          </a>
          <a href="/" style="padding: 0.75rem 1.5rem; background: var(--bg-card-subtle); color: var(--text-main); border: 1px solid var(--border); border-radius: 9999px; font-weight: 700; text-decoration: none;">
            Xem Bản Đồ Toàn Cảnh
          </a>
        </div>
      </div>
    </div>
  </main>

  <footer style="text-align: center; padding: 2rem; color: var(--text-muted); font-size: 0.85rem;">
    QuangTri.wiki · Cẩm nang du lịch mở và độc lập tỉnh Quảng Trị
  </footer>
</body>
</html>`;

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(seoHtml);
      return;
    }
  }

  // =========================================================================
  // Static Files Serving
  // =========================================================================
  let reqPath = pathname;
  if (reqPath === '/') reqPath = '/index.html';

  let filePath = path.join(PUBLIC_DIR, reqPath);

  // Security check: ensure path is within PUBLIC_DIR
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      const ext = path.extname(reqPath);
      if (!ext) {
        filePath = path.join(PUBLIC_DIR, 'index.html');
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('500 Internal Server Error');
        return;
      }

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
      });
      res.end(content);
    });
  });
}

function startServer(port) {
  const srv = http.createServer(appHandler);
  srv.listen(port, () => {
    console.log(`=======================================================`);
    console.log(`🚀 QuangTri.wiki Production Server đang chạy tại:`);
    console.log(`👉 http://localhost:${port}`);
    console.log(`📡 REST API: http://localhost:${port}/api/threads`);
    console.log(`🗺️ Sitemap: http://localhost:${port}/sitemap.xml`);
    console.log(`🤖 Robots:  http://localhost:${port}/robots.txt`);
    console.log(`=======================================================`);
  });
  srv.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️ Cổng ${port} đang bận, tự động chuyển sang cổng ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error(err);
    }
  });
}

startServer(PORT);
