-- ===================================================================
-- BHUVI MEHANDI LUXURY STUDIO — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ===================================================================

-- 1. TABLE: site_content
-- Stores all live studio CMS data: bridal gallery, hero banners, packages, rates, reviews
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'live',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

-- Enable RLS for site_content
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

-- Allow everyone (public visitors and admin) to view and update site_content
DROP POLICY IF EXISTS "Allow public read site_content" ON public.site_content;
CREATE POLICY "Allow public read site_content" 
    ON public.site_content FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public insert site_content" ON public.site_content;
CREATE POLICY "Allow public insert site_content" 
    ON public.site_content FOR INSERT 
    WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update site_content" ON public.site_content;
CREATE POLICY "Allow public update site_content" 
    ON public.site_content FOR UPDATE 
    USING (true);


-- 2. TABLE: inquiries
-- Stores client booking requests submitted from website appointment form
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    occasion TEXT,
    event_date TEXT,
    time_slot TEXT,
    city TEXT,
    guests TEXT,
    package_id TEXT,
    budget TEXT,
    notes TEXT,
    status TEXT DEFAULT 'Pending',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    status_updated_at TIMESTAMPTZ
);

-- Enable RLS for inquiries
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Allow public to insert booking inquiries
DROP POLICY IF EXISTS "Allow public insert inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert inquiries" 
    ON public.inquiries FOR INSERT 
    WITH CHECK (true);

-- Allow viewing and managing inquiries
DROP POLICY IF EXISTS "Allow public read inquiries" ON public.inquiries;
CREATE POLICY "Allow public read inquiries" 
    ON public.inquiries FOR SELECT 
    USING (true);

DROP POLICY IF EXISTS "Allow public update inquiries" ON public.inquiries;
CREATE POLICY "Allow public update inquiries" 
    ON public.inquiries FOR UPDATE 
    USING (true);

DROP POLICY IF EXISTS "Allow public delete inquiries" ON public.inquiries;
CREATE POLICY "Allow public delete inquiries" 
    ON public.inquiries FOR DELETE 
    USING (true);


-- 3. STORAGE BUCKET FOR PHOTO UPLOADS (Optional)
-- Allows direct high-res bridal image uploads to Supabase Storage
INSERT INTO storage.buckets (id, name, public) 
VALUES ('studio-gallery', 'studio-gallery', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public access to studio-gallery" ON storage.objects;
CREATE POLICY "Public access to studio-gallery" 
    ON storage.objects FOR SELECT 
    USING (bucket_id = 'studio-gallery');

DROP POLICY IF EXISTS "Public upload to studio-gallery" ON storage.objects;
CREATE POLICY "Public upload to studio-gallery" 
    ON storage.objects FOR INSERT 
    WITH CHECK (bucket_id = 'studio-gallery');

DROP POLICY IF EXISTS "Public update to studio-gallery" ON storage.objects;
CREATE POLICY "Public update to studio-gallery" 
    ON storage.objects FOR UPDATE 
    USING (bucket_id = 'studio-gallery');

-- Done! Your database tables are ready for instant connection.
