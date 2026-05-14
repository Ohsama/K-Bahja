-- ==========================================
-- PHASE 8: THE GREAT PURGE & RESET
-- Purpose: Destroy all legacy prototype anomalies
-- and configure the 3 exact test categories
-- Run this in your Supabase SQL Editor AFTER 07_finance_and_fixes.sql
-- ==========================================

-- 1. NUKE ALL OLD STATE (WARNING: Destructive)
TRUNCATE TABLE public.provider_posts CASCADE;
TRUNCATE TABLE public.order_attachments CASCADE;
TRUNCATE TABLE public.orders CASCADE;
TRUNCATE TABLE public.provider_reviews CASCADE;
TRUNCATE TABLE public.providers CASCADE;
TRUNCATE TABLE public.services CASCADE;

-- 2. SEED THE 3 MARRIAGE SERVICES
INSERT INTO public.services (id, name, icon_name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'قاعات الأفراح', 'Home', 'حجز صالات وقاعات الحفلات (Salles de Fêtes)'),
  ('22222222-2222-2222-2222-222222222222', 'حلاقة و تجميل', 'Scissors', 'تجميل عرائس، حلاقة رجال'),
  ('33333333-3333-3333-3333-333333333333', 'التصوير والفيديو', 'Camera', 'مصورين محترفين لجلسات التصوير والفيديو');
  
-- Note: As soon as this finishes, open the app, register exactly 3
-- different providers. Have the Admin set one to Approved, one to Rejected,
-- and leave one Pending to flawlessly verify the Flow!
