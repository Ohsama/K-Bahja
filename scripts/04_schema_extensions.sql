-- ==========================================
-- PHASE 1: DATABASE EXTENSIONS
-- Purpose: 3-Sided Marketplace Upgrade
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. UPGRADE ROLES ENUM
-- Note: PostgreSQL doesn't allow easy altering of CHECK constraints. 
-- We drop the old constraint by name (if it's automatically named, we might have to bypass, but we'll manually replace it).
-- A safer approach for Supabase is to drop the check constraint entirely and re-add it.
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('customer', 'admin', 'provider'));

-- 2. AUGMENT PROVIDERS TABLE
ALTER TABLE public.providers 
  ADD COLUMN IF NOT EXISTS nin_or_rc TEXT,
  ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT false;

-- 3. UPGRADE ORDER STATUS ENUM
ALTER TABLE public.orders DROP CONSTRAINT IF EXISTS orders_status_check;
ALTER TABLE public.orders ADD CONSTRAINT orders_status_check 
  CHECK (status IN ('SUBMITTED', 'CONFIRMED', 'WAITING_FOR_PAYMENT', 'PAID', 'CANCELLED', 'DONE'));
-- Note: "ACCEPTED" is equivalent to "CONFIRMED". We will use CONFIRMED. "DONE" is successful completion. 
-- AWAITING_PAYMENT / WAITING_FOR_PAYMENT -> We unify to 'WAITING_FOR_PAYMENT'. Let's map it properly.

-- 4. CREATE PROVIDER POSTS TABLE
CREATE TABLE IF NOT EXISTS public.provider_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  image_url TEXT,
  caption TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.provider_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for provider posts" ON public.provider_posts FOR SELECT USING (true);
CREATE POLICY "Providers can manage their own posts" ON public.provider_posts FOR ALL 
  USING (
    provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid())
  );

-- 5. CREATE ORDER ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS public.order_attachments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

ALTER TABLE public.order_attachments ENABLE ROW LEVEL SECURITY;
-- Customers and Providers linked to the order and Admins can view
CREATE POLICY "Parties can view order attachments" ON public.order_attachments FOR SELECT USING (
  EXISTS(
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id AND (o.customer_id = auth.uid() OR o.provider_id IN (SELECT id FROM public.providers WHERE user_id = auth.uid()))
  )
);
-- Customers can insert attachments
CREATE POLICY "Customers can add attachments" ON public.order_attachments FOR INSERT WITH CHECK (
  EXISTS(
    SELECT 1 FROM public.orders o
    WHERE o.id = order_id AND o.customer_id = auth.uid()
  )
);

-- 6. CREATE REVIEWS TABLE AND AUTO-RATING UPDATE TRIGGER
CREATE TABLE IF NOT EXISTS public.provider_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  provider_id UUID REFERENCES public.providers(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  UNIQUE(provider_id, customer_id) -- Ensures a customer only reviews a provider once!
);

ALTER TABLE public.provider_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access for reviews" ON public.provider_reviews FOR SELECT USING (true);
CREATE POLICY "Customers can insert their own reviews" ON public.provider_reviews FOR INSERT WITH CHECK (auth.uid() = customer_id);

-- 7. TRIGGER FOR AUTO UPDATING THE PROVIDER RATING
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.providers
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.provider_reviews
    WHERE provider_id = NEW.provider_id
  )
  WHERE id = NEW.provider_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_rating ON public.provider_reviews;
CREATE TRIGGER trg_update_rating
AFTER INSERT OR UPDATE ON public.provider_reviews
FOR EACH ROW EXECUTE PROCEDURE update_provider_rating();

-- =======================================
-- NEW STORAGE BUCKETS REQUIREMENT (Create these in Dashboard > Storage)
-- 1. 'post-images' bucket (public)
-- 2. 'order-attachments' bucket (public)
-- =======================================
