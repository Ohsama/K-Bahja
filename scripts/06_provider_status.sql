-- ==========================================
-- PHASE 7: PROVIDER STATUS MIGRATION
-- Purpose: Support explicitly REJECTED states
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Add a hard String ENUM status to existing providers table
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'PENDING';

-- 2. Migrate existing booleans over to the text field so old records aren't lost
UPDATE public.providers
SET status = 'APPROVED'
WHERE is_approved = true;

-- Note: is_approved column can be deprecated eventually, but for now we leave it intact to prevent UI crashes during the transition.
