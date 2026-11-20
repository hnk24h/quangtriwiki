-- =============================================================================
-- QuangTri.wiki · Idempotent Migration v2.0 (Safe to re-run on live DB)
-- Paste into Supabase SQL Editor to add banner_slides, guides, analytics cols
-- and tighten RLS policies without deleting any existing data.
-- =============================================================================

-- 1. New columns on existing tables
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS featured_count TEXT;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS specialty TEXT;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS type_tag TEXT;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS type_group TEXT DEFAULT 'history';
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS lon DOUBLE PRECISION;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS show_in_weather BOOLEAN DEFAULT TRUE;
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS weather_region_label TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS taste_notes TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS device_type TEXT;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE;
ALTER TABLE public.comments ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';
CREATE INDEX IF NOT EXISTS idx_comments_parent ON public.comments(parent_id);

-- 2. New tables: banner_slides & guides
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

CREATE TABLE IF NOT EXISTS public.guides (
    id TEXT PRIMARY KEY DEFAULT 'main',
    best_time_to_visit JSONB DEFAULT '[]',
    packing_checklist JSONB DEFAULT '[]',
    emergency_hotlines JSONB DEFAULT '[]',
    gas_stations JSONB DEFAULT '[]',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.map_pins (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'sightseeing',
    category_label TEXT,
    zone_code TEXT NOT NULL DEFAULT 'QT-01',
    zone_name TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    address TEXT,
    price_or_hours TEXT,
    description TEXT,
    image TEXT,
    contributor TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_map_pins_created ON public.map_pins(created_at DESC);

CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'editor', 'user')),
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    phone TEXT,
    avatar TEXT,
    note TEXT,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 3. Enable RLS on new tables
ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.map_pins ENABLE ROW LEVEL SECURITY;

-- 4. Recreate clean RLS policies idempotently
DROP POLICY IF EXISTS "Public read map_pins" ON public.map_pins;
CREATE POLICY "Public read map_pins" ON public.map_pins FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert map_pins" ON public.map_pins;
CREATE POLICY "Public insert map_pins" ON public.map_pins FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Public read banner_slides" ON public.banner_slides;
CREATE POLICY "Public read banner_slides" ON public.banner_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public read guides" ON public.guides;
CREATE POLICY "Public read guides" ON public.guides FOR SELECT USING (true);

-- Tighten sensitive policies (remove blanket public SELECT on leads & registrations, and blanket UPDATE on threads)
DROP POLICY IF EXISTS "Admin read leads" ON public.leads;
DROP POLICY IF EXISTS "Admin read registrations" ON public.partner_registrations;
DROP POLICY IF EXISTS "Public update thread likes" ON public.threads;

-- Ensure public inserts remain allowed
DROP POLICY IF EXISTS "Public insert page_views" ON public.page_views;
CREATE POLICY "Public insert page_views" ON public.page_views FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public read page_views" ON public.page_views;
CREATE POLICY "Public read page_views" ON public.page_views FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public insert leads" ON public.leads;
CREATE POLICY "Public insert leads" ON public.leads FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public insert registrations" ON public.partner_registrations;
CREATE POLICY "Public insert registrations" ON public.partner_registrations FOR INSERT WITH CHECK (true);

-- 5. Least privilege grants
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT ON public.places, public.services, public.threads, public.comments, public.foods, public.itineraries, public.zones, public.banner_slides, public.guides, public.page_views, public.map_pins TO anon, authenticated;
GRANT INSERT ON public.threads, public.comments, public.leads, public.partner_registrations, public.page_views, public.map_pins TO anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;
