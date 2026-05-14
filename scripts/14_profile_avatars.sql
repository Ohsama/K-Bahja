-- ==========================================
-- PHASE 14: PROFILE AVATARS INITIALIZATION
-- Purpose: Support profile pictures platform-wide
-- ==========================================

-- 1. Add Avatar column to Profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create the Avatars Bucket (Public)
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- 3. Grant Public Read Access to Files in the Bucket
CREATE POLICY "Public Avatar Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'avatars' );

-- 4. Grant Upload Access to Authenticated Users for Avatars
CREATE POLICY "Authenticated Avatar Uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- 5. Grant Update Access to Avatars
CREATE POLICY "Authenticated Avatar Update"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'avatars' );
