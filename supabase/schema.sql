-- =============================================================================
-- QuangTri.wiki · Supabase PostgreSQL Database Schema
-- Version: 2.0 (Next.js + Supabase Production)
-- =============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- -----------------------------------------------------------------------------
-- 1. BẢNG: places (24+ Danh thắng & Điểm đến du lịch Quảng Trị)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.places (
    id TEXT PRIMARY KEY,                       -- e.g. 'thanh-co-quang-tri'
    name TEXT NOT NULL,                        -- Tên danh thắng
    zone_code TEXT NOT NULL,                   -- 'QT-01' -> 'QT-08'
    zone_name TEXT NOT NULL,                   -- Tên phân vùng
    category TEXT NOT NULL,                    -- 'history', 'cloud', 'beach', 'island', 'waterfall'
    category_name TEXT NOT NULL,               -- Tên hiển thị danh mục
    rating NUMERIC(2, 1) DEFAULT 4.8,          -- Điểm đánh giá (4.8 / 5.0)
    rating_count INTEGER DEFAULT 120,          -- Lượt đánh giá
    hero_image TEXT DEFAULT 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80',                  -- URL ảnh chất lượng cao
    gallery TEXT[] DEFAULT '{}',               -- Danh sách ảnh chi tiết
    short_desc TEXT NOT NULL,                  -- Mô tả ngắn cho card & meta description
    history TEXT,                              -- Lược sử và ý nghĩa văn hóa/lịch sử
    highlights TEXT[] DEFAULT '{}',            -- Các điểm nhấn không thể bỏ qua
    coordinates TEXT NOT NULL,                 -- '16.7513, 107.1857'
    address TEXT NOT NULL,                     -- Địa chỉ hành chính cụ thể
    open_time TEXT DEFAULT 'Mở cửa cả ngày',   -- Giờ mở cửa
    ticket_price TEXT DEFAULT 'Miễn phí',     -- Giá vé tham quan
    tips TEXT,                                 -- Lời khuyên cho phượt thủ
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index tra cứu theo phân vùng và danh mục
CREATE INDEX IF NOT EXISTS idx_places_zone ON public.places(zone_code);
CREATE INDEX IF NOT EXISTS idx_places_category ON public.places(category);

-- -----------------------------------------------------------------------------
-- 2. BẢNG: services (Đối tác địa phương: Homestay, Thuê xe, Vé tàu, Tour Guide)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.services (
    id TEXT PRIMARY KEY,                       -- e.g. 'homestay-thach-han'
    name TEXT NOT NULL,
    type TEXT NOT NULL,                        -- 'homestay', 'hotel', 'rental', 'boat', 'tour'
    type_label TEXT NOT NULL,                  -- 'Homestay', 'Thuê xe máy', v.v.
    zone_code TEXT NOT NULL,                   -- 'QT-01' -> 'QT-08'
    zone_name TEXT NOT NULL,
    price TEXT NOT NULL,                       -- '350.000đ / đêm'
    rating NUMERIC(2, 1) DEFAULT 4.9,
    reviews INTEGER DEFAULT 45,
    address TEXT NOT NULL,
    hotline TEXT NOT NULL,                     -- Số điện thoại gọi hotline
    zalo TEXT NOT NULL,                        -- Số Zalo hoặc link chat Zalo
    image TEXT NOT NULL,                       -- URL ảnh đại diện dịch vụ
    is_verified BOOLEAN DEFAULT TRUE,          -- Huy hiệu đối tác xác minh
    affiliate_url TEXT,                        -- Link affiliate Booking/Agoda nếu có
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_services_type ON public.services(type);
CREATE INDEX IF NOT EXISTS idx_services_zone ON public.services(zone_code);

-- -----------------------------------------------------------------------------
-- 3. BẢNG: threads (Diễn đàn cộng đồng - Kinh nghiệm, hỏi đáp, review)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_name TEXT NOT NULL,
    author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    author_badge TEXT DEFAULT 'Thành viên mới',
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tag TEXT NOT NULL DEFAULT 'Kinh nghiệm',    -- 'Kinh nghiệm', 'Hỏi đáp', 'Review ẩm thực', 'Săn mây'
    zone_code TEXT NOT NULL DEFAULT 'QT-05',
    images TEXT[] DEFAULT '{}',                -- Lưu URLs từ Supabase Storage bucket
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_threads_created_at ON public.threads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_threads_tag ON public.threads(tag);

-- -----------------------------------------------------------------------------
-- 4. BẢNG: comments (Bình luận phân cấp cho từng Thread diễn đàn)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID NOT NULL REFERENCES public.threads(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_comments_thread ON public.comments(thread_id);

-- -----------------------------------------------------------------------------
-- 5. BẢNG: leads (Ghi nhận chuyển đổi để tính phí hoa hồng & pay-per-lead)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id TEXT NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    service_name TEXT NOT NULL,
    action TEXT NOT NULL,                      -- 'call' (bấm gọi điện) hoặc 'zalo' (bấm chat Zalo)
    user_ip TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_leads_service ON public.leads(service_id);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- -----------------------------------------------------------------------------
-- 6. BẢNG: partner_registrations (Hồ sơ đăng ký đối tác mới từ website)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.partner_registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    business_name TEXT NOT NULL,
    service_type TEXT NOT NULL,                -- 'homestay', 'rental', 'boat', 'tour', 'food'
    zone_code TEXT NOT NULL,
    contact_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    zalo TEXT,
    address TEXT NOT NULL,
    price_range TEXT,
    status TEXT DEFAULT 'pending',             -- 'pending', 'approved', 'rejected'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_partner_reg_status ON public.partner_registrations(status);

-- -----------------------------------------------------------------------------
-- 7. BẢNG: page_views (Lưu trữ và phân tích lượt xem trang front)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.page_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    path TEXT NOT NULL DEFAULT '/',
    ip TEXT,
    user_agent TEXT,
    region TEXT,
    device_type TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON public.page_views(path);

-- -----------------------------------------------------------------------------
-- 8. BẢNG: foods (Ẩm thực đặc sản Quảng Trị)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.foods (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    origin TEXT,
    type TEXT DEFAULT 'Món mặn truyền thống',
    price_range TEXT,
    description TEXT,
    taste_notes TEXT,
    image TEXT,
    address_recs TEXT[] DEFAULT '{}',
    highlights TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 9. BẢNG: itineraries (Lịch trình & Cung đường du lịch)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.itineraries (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    duration TEXT NOT NULL,
    suitability TEXT,
    distance TEXT,
    description TEXT,
    highlights TEXT[] DEFAULT '{}',
    stops JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 10. BẢNG: zones (Phân vùng 8 cụm danh thắng)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.zones (
    code TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    tagline TEXT,
    hero_image TEXT,
    description TEXT,
    featured_count TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 11. BẢNG: banner_slides (Slideshow Hero trên trang chủ)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.banner_slides (
    id TEXT PRIMARY KEY,
    badge TEXT,
    title TEXT NOT NULL,
    subtitle TEXT,
    image TEXT NOT NULL,
    zone_code TEXT,
    stats_tag TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banner_slides_sort ON public.banner_slides(sort_order ASC);

-- -----------------------------------------------------------------------------
-- 12. BẢNG: guides (Cẩm nang, Checklist, Hotline & Cây xăng)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.guides (
    id TEXT PRIMARY KEY DEFAULT 'main',
    best_time_to_visit JSONB DEFAULT '[]',
    packing_checklist JSONB DEFAULT '[]',
    emergency_hotlines JSONB DEFAULT '[]',
    gas_stations JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- -----------------------------------------------------------------------------
-- 13. ROW LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Kích hoạt RLS
ALTER TABLE public.places ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partner_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- Page views: Public ghi nhận và xem bộ đếm tổng
CREATE POLICY "Public insert page_views" ON public.page_views FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read page_views" ON public.page_views FOR SELECT USING (true);

-- Foods, Itineraries, Zones, Banner Slides, Guides, Places, Services: Public đọc
CREATE POLICY "Public read foods" ON public.foods FOR SELECT USING (true);
CREATE POLICY "Public read itineraries" ON public.itineraries FOR SELECT USING (true);
CREATE POLICY "Public read zones" ON public.zones FOR SELECT USING (true);
CREATE POLICY "Public read banner_slides" ON public.banner_slides FOR SELECT USING (true);
CREATE POLICY "Public read guides" ON public.guides FOR SELECT USING (true);
CREATE POLICY "Public read places" ON public.places FOR SELECT USING (true);
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);

-- Diễn đàn: Public đọc và tạo bài viết/bình luận (cập nhật/xóa qua service_role)
CREATE POLICY "Public read threads" ON public.threads FOR SELECT USING (true);
CREATE POLICY "Public insert threads" ON public.threads FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read comments" ON public.comments FOR SELECT USING (true);
CREATE POLICY "Public insert comments" ON public.comments FOR INSERT WITH CHECK (true);

-- Leads: Người dùng tạo log khi click, chỉ service_role (Admin server) xem thống kê
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

-- Partner registrations: Chủ cơ sở gửi đơn đăng ký, chỉ service_role (Admin server) xem & duyệt
CREATE POLICY "Public insert registrations" ON public.partner_registrations FOR INSERT WITH CHECK (true);

-- -----------------------------------------------------------------------------
-- 14. CẤP QUYỀN TỐI THIỂU (LEAST PRIVILEGE GRANTS) CHO 'anon' & 'service_role'
-- -----------------------------------------------------------------------------
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Quyền đọc nội dung công khai
GRANT SELECT ON public.places, public.services, public.threads, public.comments, public.foods, public.itineraries, public.zones, public.banner_slides, public.guides, public.page_views TO anon, authenticated;

-- Quyền ghi công khai có kiểm soát qua API
GRANT INSERT ON public.threads, public.comments, public.leads, public.partner_registrations, public.page_views TO anon, authenticated;

-- Toàn quyền cho service_role (Server Admin API)
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;
