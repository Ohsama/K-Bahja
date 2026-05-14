-- ==========================================
-- PHASE 10: STORAGE BUCKETS INITIALIZATION
-- Purpose: Create physical attachment endpoints
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the Post Images Bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('post-images', 'post-images', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Create the Order Attachments Bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-attachments', 'order-attachments', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Grant Public Read Access to Files in the Buckets
CREATE POLICY "Public File Access"
ON storage.objects FOR SELECT
USING ( bucket_id IN ('post-images', 'order-attachments') );

-- 4. Grant Upload Access to Authenticated Users
CREATE POLICY "Authenticated File Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id IN ('post-images', 'order-attachments') );
