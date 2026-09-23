-- Enable public insertions for listings
DROP POLICY IF EXISTS "Anyone can insert a listing." ON public.listings;
CREATE POLICY "Anyone can insert a listing." ON public.listings
  FOR INSERT WITH CHECK (true);

-- We need to ensure that the user policy for inserting listings isn't conflicting, but the new policy "Anyone can insert a listing." is permissive, so it will allow all inserts (both authenticated and anonymous).

-- Storage Setup
-- 1. Create bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('business-images', 'business-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 2. Storage RLS Policies for business-images
-- Allow public select
DROP POLICY IF EXISTS "Public View Access" ON storage.objects;
CREATE POLICY "Public View Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'business-images' );

-- Allow public insert (upload)
DROP POLICY IF EXISTS "Public Insert Access" ON storage.objects;
CREATE POLICY "Public Insert Access"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'business-images' );

-- Optional: Allow public updates to their own uploads based on some criteria, or just allow anyone to upload new files.
-- We'll just allow inserts for now, as updating isn't strictly required for public submission if they just upload a new file.
