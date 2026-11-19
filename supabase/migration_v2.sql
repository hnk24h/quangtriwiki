-- =============================================================================
-- QuangTri.wiki · Idempotent Migration v2.0 (Safe to re-run on live DB)
-- Paste into Supabase SQL Editor to add banner_slides, guides, analytics cols
-- and tighten RLS policies without deleting any existing data.
-- =============================================================================

-- 1. New columns on existing tables
ALTER TABLE public.zones ADD COLUMN IF NOT EXISTS featured_count TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS taste_notes TEXT;
ALTER TABLE public.foods ADD COLUMN IF NOT EXISTS highlights TEXT[] DEFAULT '{}';
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS region TEXT;
ALTER TABLE public.page_views ADD COLUMN IF NOT EXISTS device_type TEXT;

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

-- 3. Enable RLS on new tables
ALTER TABLE public.banner_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guides ENABLE ROW LEVEL SECURITY;

-- 4. Recreate clean RLS policies idempotently
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

GRANT SELECT ON public.places, public.services, public.threads, public.comments, public.foods, public.itineraries, public.zones, public.banner_slides, public.guides, public.page_views TO anon, authenticated;
GRANT INSERT ON public.threads, public.comments, public.leads, public.partner_registrations, public.page_views TO anon, authenticated;

GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO service_role;
