-- ==========================================
-- FINAL SERVICES BULK SEED
-- Purpose: Injects the remaining 8 specific service categories automatically for the Admin.
-- Instructions: Run this script directly in your Supabase SQL Editor.
-- Note: 'ON CONFLICT DO NOTHING' is not used since services don't have a unique constraint on 'name', so running this twice will create duplicates. Run ONLY ONCE.
-- ==========================================

INSERT INTO public.services (name, icon_name, description) VALUES
('ديجي', 'Music', 'خدمات الديجي (DJ) المتنقل'),
('محل كراء الفساتين', 'Shirt', 'تأجير فساتين الحفلات والسهرات والأعراس'),
('محل الحلويات', 'Cake', 'صناعة وتوفير جميع أنواع الحلويات التقليدية والعصرية'),
('محل كراء الديكور', 'Package', 'كراء ديكورات وتجهيزات قاعات الأفراح'),
('محل الورود', 'Flower2', 'تجهيز الورود وباقات الورد الطبيعي والصناعي'),
('كراء السيارات', 'Car', 'تأجير السيارات الخاصة والمميزة لحفلات الزفاف'),
('خيالة وبارود', 'Swords', 'فرق البارود التراثية والخيالة للأفراح والمناسبات'),
('فوتوغراف', 'Camera', 'تصوير فوتوغرافي وفيديو إحترافي وتغطية شاملة')
;
