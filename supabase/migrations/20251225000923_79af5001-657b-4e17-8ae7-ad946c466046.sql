-- Create storage bucket for reference images
INSERT INTO storage.buckets (id, name, public) VALUES ('reference-images', 'reference-images', true);

-- Storage policies for reference images bucket
CREATE POLICY "Anyone can upload reference images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'reference-images');

CREATE POLICY "Anyone can view reference images"
ON storage.objects FOR SELECT
USING (bucket_id = 'reference-images');

-- Add reference_images column to orders table to store URLs
ALTER TABLE public.orders ADD COLUMN reference_images text[] DEFAULT NULL;