-- ==========================================
-- PHASE 6: MARRIAGE ECOSYSTEM SEED DATA
-- Purpose: 3-Sided Marketplace Upgrade
-- Run this in your Supabase SQL Editor
-- ==========================================

-- CLEAR ANY OLD PROTOTYPE DATA IF DESIRED (Uncomment to fully reset services)
-- TRUNCATE TABLE public.services CASCADE;

-- Insert Marriage & Wedding Preparation Categories
INSERT INTO public.services (id, name, icon_name, description) VALUES
  ('11111111-1111-1111-1111-111111111111', 'قاعات الأفراح', 'Home', 'حجز صالات وقاعات الحفلات (Salles de Fêtes)'),
  ('22222222-2222-2222-2222-222222222222', 'حلاقة و تجميل وتصديرة', 'Scissors', 'تجميل عرائس، حلاقة رجال، وتأجير الفساتين'),
  ('33333333-3333-3333-3333-333333333333', 'التصوير والفيديو', 'Camera', 'مصورين محترفين لجلسات التصوير والفيديو'),
  ('44444444-4444-4444-4444-444444444444', 'الإطعام (Catering)', 'Coffee', 'طباخين، حلويات تقليدية، تقديم الطعام للضيوف'),
  ('55555555-5555-5555-5555-555555555555', 'الديكور والتزيين', 'Image', 'تزيين القاعات، سيارات الأعراس، وتنسيق الورود'),
  ('66666666-6666-6666-6666-666666666666', 'الموسيقى والفرق', 'Music', 'دي جي (DJ)، فرق موسيقية، وزرنة')
ON CONFLICT DO NOTHING;
