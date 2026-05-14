-- ==========================================
-- PHASE 8: THE MASTER FINANCE & FIXES SCRIPT
-- Purpose: Create missing Provider Status metrics
-- and configure the Marketplace Commission tracker
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. FIX THE MISSING PROVIDER SUBMISSION BUG
-- If you missed the previous script, this will safely add the status column.
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'PENDING';

-- 2. Migrate existing Booleans if they exist
UPDATE public.providers
SET status = 'APPROVED'
WHERE is_approved = true AND status = 'PENDING';

-- 3. ESTABLISH PROVIDER COMMISSION RATES
-- By default, all newly signed up providers will owe the platform 10%
ALTER TABLE public.providers 
ADD COLUMN IF NOT EXISTS commission_rate NUMERIC DEFAULT 10.0;

-- 4. ESTABLISH PROFIT TRACKING ON ORDERS
-- When the provider marks a job DONE, we will record how much they took
-- and definitively lock mathematically how much they owe you.
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS price_collected NUMERIC DEFAULT 0.0,
ADD COLUMN IF NOT EXISTS commission_due NUMERIC DEFAULT 0.0;
