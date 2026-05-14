-- ==========================================
-- PHASE 9: ADMIN AUTHORITY OVERRIDE (HOTFIX)
-- Purpose: Grant System Admins absolute CRUD logic over Providers globally
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. OVERRIDE PROVIDERS RLS FOR ADMINS
ALTER TABLE public.providers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin Global Update on Providers"
ON public.providers FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Admin Global Delete on Providers"
ON public.providers FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. OVERRIDE ORDERS RLS FOR ADMINS
-- So Admins can forcefully shift Orders from WAIT to PAID smoothly
CREATE POLICY "Admin Global Update on Orders"
ON public.orders FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
