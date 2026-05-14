-- ==========================================
-- PHASE 16: ADMIN POST MODERATION RLS
-- Purpose: Allow admins to delete inappropriate provider posts
-- ==========================================

-- Admins can delete any post.
DROP POLICY IF EXISTS "Admins can delete any post" ON public.provider_posts;
CREATE POLICY "Admins can delete any post" ON public.provider_posts FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    )
  );
