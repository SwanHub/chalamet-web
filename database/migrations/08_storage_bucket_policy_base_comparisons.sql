CREATE POLICY "Public Full Access for base_comparison"
  ON storage.objects
  FOR ALL
  USING (bucket_id = 'base-comparisons')
  WITH CHECK (bucket_id = 'base-comparisons');