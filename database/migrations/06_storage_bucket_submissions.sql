CREATE POLICY "Allow public uploads"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'submissions');