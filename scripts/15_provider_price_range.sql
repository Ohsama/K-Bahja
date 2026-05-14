-- ==========================================
-- PHASE 15: PROVIDER PRICE RANGE
-- Purpose: Add price_range column to providers table for customer expectations
-- ==========================================

-- 1. Add the column to providers
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS price_range TEXT DEFAULT 'حسب الطلب';

-- No additional RLS required as 'providers' table handles select/update rules.
