-- ===================================================================
-- BHUVI MEHANDI LUXURY STUDIO — COMPLETE SUPABASE DATABASE SETUP
-- Creates all tables, columns, security policies, and inserts current data
-- Run this in your Supabase Dashboard: SQL Editor -> New Query -> Run
-- ===================================================================

-- -------------------------------------------------------------------
-- 1. TABLE: site_content
-- Used by website & admin engine for live gallery, banners & settings
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_content (
    id TEXT PRIMARY KEY DEFAULT 'live',
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read site_content" ON public.site_content;
CREATE POLICY "Allow public read site_content" ON public.site_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert site_content" ON public.site_content;
CREATE POLICY "Allow public insert site_content" ON public.site_content FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update site_content" ON public.site_content;
CREATE POLICY "Allow public update site_content" ON public.site_content FOR UPDATE USING (true);

-- INSERT CURRENT STUDIO CATALOG DATA INTO site_content
INSERT INTO public.site_content (id, data, updated_at)
VALUES (
    'live',
    '{
        "heroBanners": [
            {
                "id": "banner-1",
                "image": "hero-banner.png",
                "title": "Bhuvi Mehandi Luxury Henna Art & Bridal Studio"
            },
            {
                "id": "banner-2",
                "image": "https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=2000&q=85",
                "title": "Royal Rajasthani Bridal Mehndi - Udaipur Heritage"
            },
            {
                "id": "banner-3",
                "image": "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=2000&q=85",
                "title": "Exquisite Fine-Line Floral & Arabic Bridal Henna"
            }
        ],
        "hero": {
            "bannerImage": "hero-banner.png",
            "bannerEnabled": true,
            "eyebrow": "✦ UDAIPUR''S PREMIER BRIDAL MEHNDI ARTIST",
            "headingPrefix": "Exquisite Mehndi Art",
            "headingHighlight": "for Your Royal Moments",
            "description": "Experience the magic of authentic Rajasthani heritage and contemporary bridal artistry. Handcrafted with 100% natural organic henna for deep, dark stains and unforgettable wedding memories.",
            "image": "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1000&q=85",
            "badgeStars": "★★★★★",
            "badgeCount": "500+ Happy Brides",
            "badgeSub": "Udaipur Palace & Destination Weddings"
        },
        "about": {
            "image": "https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&w=900&q=85",
            "expYears": "8+",
            "expLabel": "Years of Bridal Henna Artistry",
            "heading": "Where Mewari Tradition Meets Fine Bridal Couture.",
            "bio1": "Hello, I am <strong>Bhuvi Prajapat</strong>, the artist behind Bhuvi Mehandi in Udaipur. Rooted in the royal city of lakes and palaces, my passion is creating breathtaking henna that honors ancient Indian customs while complementing modern bridal elegance.",
            "bio2": "Every bridal design is drawn with patience, pure concentration, and organic Sojat henna freshly infused with pure essential oils. Whether you dream of a traditional Marwari Doli-Baraat story or contemporary fine-line lace, I am dedicated to making your bridal experience unforgettable."
        },
        "gallery": [
            {
                "id": "gal-1",
                "src": "https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=900&q=80",
                "alt": "Intricate royal bridal mehndi design",
                "title": "Royal Bridal Full-Arm Mehndi",
                "category": "bridal",
                "categoryLabel": "Bridal Collection",
                "subtitle": "Royal Bridal Henna",
                "isLarge": true
            },
            {
                "id": "gal-2",
                "src": "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80",
                "alt": "Arabic floral mehndi design",
                "title": "Modern Arabic Floral Trail",
                "category": "arabic",
                "categoryLabel": "Arabic Style",
                "subtitle": "Floral Trail",
                "isLarge": false
            },
            {
                "id": "gal-3",
                "src": "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80",
                "alt": "Traditional Rajasthani Marwari wedding mehndi",
                "title": "Heritage Marwari Bharwa Mehndi",
                "category": "rajasthani",
                "categoryLabel": "Rajasthani",
                "subtitle": "Heritage Marwari",
                "isLarge": false
            },
            {
                "id": "gal-4",
                "src": "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80",
                "alt": "Elegant engagement ring ceremony mehndi",
                "title": "Delicate Ring Ceremony Mehndi",
                "category": "engagement",
                "categoryLabel": "Engagement",
                "subtitle": "Delicate Mandala",
                "isLarge": false
            },
            {
                "id": "gal-5",
                "src": "https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=700&q=80",
                "alt": "Festive Indian celebration mehndi",
                "title": "Festive Teej & Karwa Chauth Henna",
                "category": "festival",
                "categoryLabel": "Festivals",
                "subtitle": "Festive Grace",
                "isLarge": false
            },
            {
                "id": "gal-6",
                "src": "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=700&q=80",
                "alt": "Intricate bridal palm and wrist mehndi",
                "title": "Intricate Bridal Palms & Cuffs",
                "category": "bridal",
                "categoryLabel": "Bridal Collection",
                "subtitle": "Palms & Cuffs",
                "isLarge": false
            },
            {
                "id": "gal-7",
                "src": "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=700&q=80",
                "alt": "Contemporary designer Arabic mehndi",
                "title": "Contemporary Negative-Space Arabic",
                "category": "arabic",
                "categoryLabel": "Arabic Designer",
                "subtitle": "Negative Space",
                "isLarge": false
            },
            {
                "id": "gal-8",
                "src": "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=700&q=80",
                "alt": "Traditional Rajasthani peacock henna art",
                "title": "Traditional Jharokha & Peacock Art",
                "category": "rajasthani",
                "categoryLabel": "Rajasthani Heritage",
                "subtitle": "Jharokha & Peacock",
                "isLarge": false
            }
        ],
        "reviews": [
            {
                "id": "rev-1",
                "name": "Pooja Rathore",
                "role": "Destination Bride • Jagmandir Palace, Udaipur",
                "stars": 5,
                "text": "Bhuvi is an absolute magician! She drew our destination wedding story and hidden portraits so exquisitely on my hands. The stain on my wedding day was pitch dark and lasted for over 3 weeks. Highly recommend her to every Udaipur bride!"
            },
            {
                "id": "rev-2",
                "name": "Ananya Singhal",
                "role": "Royal Wedding • The Oberoi Udaivilas, Udaipur",
                "stars": 5,
                "text": "The patience and precision Bhuvi has is unmatched. She arrived on time at our resort, brought natural organic henna that smelled heavenly, and created the cleanest fine lines I''ve ever seen. Every single wedding guest was mesmerized!"
            },
            {
                "id": "rev-3",
                "name": "Sneha Sharma",
                "role": "Sangeet & Bridal • Aurika, Udaipur",
                "stars": 5,
                "text": "Booked Bhuvi for my engagement and then again for my sister''s wedding group. Her designs are super modern, chic, and the color payoff is extraordinary. She is polite, gentle, and a true artist!"
            }
        ],
        "settings": {
            "whatsapp": "918094935632",
            "phone": "+91 80949 35632",
            "email": "prajapatbhavna2003@gmail.com",
            "address": "Near Mohanlal Sukhadia University, Udaipur, Rajasthan 313001",
            "instagram": "bhuvi_mehandi_24",
            "adminUsername": "admin",
            "adminPassword": "admin123",
            "adminPin": "1234"
        }
    }'::jsonb,
    timezone('utc'::text, now())
)
ON CONFLICT (id) DO UPDATE 
SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at;


-- -------------------------------------------------------------------
-- 2. TABLE: inquiries
-- Stores bridal booking requests submitted from website
-- -------------------------------------------------------------------
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
    status TEXT DEFAULT 'New',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    status_updated_at TIMESTAMPTZ
);

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert inquiries" ON public.inquiries FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read inquiries" ON public.inquiries;
CREATE POLICY "Allow public read inquiries" ON public.inquiries FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public update inquiries" ON public.inquiries;
CREATE POLICY "Allow public update inquiries" ON public.inquiries FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Allow public delete inquiries" ON public.inquiries;
CREATE POLICY "Allow public delete inquiries" ON public.inquiries FOR DELETE USING (true);

-- INSERT SAMPLE CURRENT BRIDAL BOOKINGS INTO inquiries
INSERT INTO public.inquiries (id, name, phone, occasion, event_date, time_slot, city, guests, package_id, budget, notes, status, created_at)
VALUES 
(
    'inq-1710600001',
    'Priyanka Chundawat',
    '+91 98290 12345',
    'Royal Bridal Full-Arm',
    '2026-11-18',
    'Morning (09:00 AM)',
    'The Leela Palace, Udaipur',
    '8-12 Bridesmaids',
    'royal-bridal',
    '₹25,000 - ₹35,000',
    'Destination wedding at Udaipur lakefront. Looking for Marwari traditional portraits with organic henna.',
    'Confirmed',
    timezone('utc'::text, now() - interval '2 days')
),
(
    'inq-1710600002',
    'Aarohi Mehra',
    '+91 98201 54321',
    'Bridal + Sangeet Party',
    '2026-12-05',
    'Afternoon (02:00 PM)',
    'The Oberoi Udaivilas, Udaipur',
    '15-20 Family Guests',
    'bridal-sangeet-combo',
    '₹40,000 - ₹50,000',
    'Need fine-line contemporary Arabic and lotus motifs. Sister of bride also wants heavy designs.',
    'Contacted',
    timezone('utc'::text, now() - interval '1 day')
),
(
    'inq-1710600003',
    'Kavya Solanki',
    '+91 97845 67890',
    'Engagement & Ring Ceremony',
    '2026-10-24',
    'Evening (05:00 PM)',
    'Fateh Garh Heritage Resort, Udaipur',
    '4-6 Guests',
    'engagement-special',
    '₹12,000 - ₹18,000',
    'Mandala style on back of hands with intricate cuff bracelets.',
    'New',
    timezone('utc'::text, now() - interval '3 hours')
)
ON CONFLICT (id) DO NOTHING;


-- -------------------------------------------------------------------
-- 3. TABLE: gallery (Relational table for Supabase Table Editor view)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.gallery (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT,
    subtitle TEXT,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_large BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read gallery" ON public.gallery;
CREATE POLICY "Allow public read gallery" ON public.gallery FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public all gallery" ON public.gallery;
CREATE POLICY "Allow public all gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- INSERT CURRENT 8 GALLERY PHOTOS INTO gallery
INSERT INTO public.gallery (id, title, category, category_label, subtitle, image_url, alt_text, is_large, display_order)
VALUES
('gal-1', 'Royal Bridal Full-Arm Mehndi', 'bridal', 'Bridal Collection', 'Royal Bridal Henna', 'https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=900&q=80', 'Intricate royal bridal mehndi design', true, 1),
('gal-2', 'Modern Arabic Floral Trail', 'arabic', 'Arabic Style', 'Floral Trail', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=700&q=80', 'Arabic floral mehndi design', false, 2),
('gal-3', 'Heritage Marwari Bharwa Mehndi', 'rajasthani', 'Rajasthani', 'Heritage Marwari', 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=700&q=80', 'Traditional Rajasthani Marwari wedding mehndi', false, 3),
('gal-4', 'Delicate Ring Ceremony Mehndi', 'engagement', 'Engagement', 'Delicate Mandala', 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=700&q=80', 'Elegant engagement ring ceremony mehndi', false, 4),
('gal-5', 'Festive Teej & Karwa Chauth Henna', 'festival', 'Festivals', 'Festive Grace', 'https://images.unsplash.com/photo-1609220136736-443140cffec6?auto=format&fit=crop&w=700&q=80', 'Festive Indian celebration mehndi', false, 5),
('gal-6', 'Intricate Bridal Palms & Cuffs', 'bridal', 'Bridal Collection', 'Palms & Cuffs', 'https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=700&q=80', 'Intricate bridal palm and wrist mehndi', false, 6),
('gal-7', 'Contemporary Negative-Space Arabic', 'arabic', 'Arabic', 'Negative Space', 'https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=700&q=80', 'Contemporary designer Arabic mehndi', false, 7),
('gal-8', 'Traditional Jharokha & Peacock Art', 'rajasthani', 'Rajasthani/Bharwa', 'Jharokha & Peacock', 'https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=700&q=80', 'Traditional Rajasthani peacock henna art', false, 8),
('gal-9', 'Luxury Royal Designer Mandala & Grid', 'designer', 'Designer', 'Mandala & Grid Fusion', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=700&q=80', 'Luxury designer mehndi art with intricate cuffs', false, 9)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title, category = EXCLUDED.category, image_url = EXCLUDED.image_url;


-- -------------------------------------------------------------------
-- 4. TABLE: hero_banners (Relational table for Supabase Table Editor view)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    image_url TEXT NOT NULL,
    display_order INT DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all hero_banners" ON public.hero_banners;
CREATE POLICY "Allow public all hero_banners" ON public.hero_banners FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.hero_banners (id, title, image_url, display_order, is_active)
VALUES
('banner-1', 'Bhuvi Mehandi Luxury Henna Art & Bridal Studio', 'hero-banner.png', 1, true),
('banner-2', 'Royal Rajasthani Bridal Mehndi - Udaipur Heritage', 'https://images.unsplash.com/photo-1599833975787-5f6b0e8d1b55?auto=format&fit=crop&w=2000&q=85', 2, true),
('banner-3', 'Exquisite Fine-Line Floral & Arabic Bridal Henna', 'https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=2000&q=85', 3, true)
ON CONFLICT (id) DO UPDATE
SET title = EXCLUDED.title, image_url = EXCLUDED.image_url;


-- -------------------------------------------------------------------
-- 5. TABLE: reviews (Relational table for Supabase Table Editor view)
-- -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    role TEXT,
    stars INT DEFAULT 5,
    review_text TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public all reviews" ON public.reviews;
CREATE POLICY "Allow public all reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

INSERT INTO public.reviews (id, name, role, stars, review_text)
VALUES
('rev-1', 'Pooja Rathore', 'Destination Bride • Jagmandir Palace, Udaipur', 5, 'Bhuvi is an absolute magician! She drew our destination wedding story and hidden portraits so exquisitely on my hands. The stain on my wedding day was pitch dark and lasted for over 3 weeks. Highly recommend her to every Udaipur bride!'),
('rev-2', 'Ananya Singhal', 'Royal Wedding • The Oberoi Udaivilas, Udaipur', 5, 'The patience and precision Bhuvi has is unmatched. She arrived on time at our resort, brought natural organic henna that smelled heavenly, and created the cleanest fine lines I''ve ever seen. Every single wedding guest was mesmerized!'),
('rev-3', 'Sneha Sharma', 'Sangeet & Bridal • Aurika, Udaipur', 5, 'Booked Bhuvi for my engagement and then again for my sister''s wedding group. Her designs are super modern, chic, and the color payoff is extraordinary. She is polite, gentle, and a true artist!')
ON CONFLICT (id) DO UPDATE
SET name = EXCLUDED.name, review_text = EXCLUDED.review_text;


-- -------------------------------------------------------------------
-- 6. STORAGE BUCKET FOR PHOTO UPLOADS (Optional)
-- -------------------------------------------------------------------
INSERT INTO storage.buckets (id, name, public) 
VALUES ('studio-gallery', 'studio-gallery', true) 
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public access to studio-gallery" ON storage.objects;
CREATE POLICY "Public access to studio-gallery" ON storage.objects FOR SELECT USING (bucket_id = 'studio-gallery');

DROP POLICY IF EXISTS "Public upload to studio-gallery" ON storage.objects;
CREATE POLICY "Public upload to studio-gallery" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'studio-gallery');

-- ===================================================================
-- Setup Complete! Your Supabase database is 100% created & populated.
-- ===================================================================
