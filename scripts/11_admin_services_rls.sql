-- ==========================================
-- Admin Services RLS Hotfix
-- Purpose: Grant System Admins absolute CRUD logic over Services
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Insert Policy
CREATE POLICY "Admin Global Insert on Services"
ON public.services FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 2. Update Policy
CREATE POLICY "Admin Global Update on Services"
ON public.services FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 3. Delete Policy
CREATE POLICY "Admin Global Delete on Services"
ON public.services FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);
