CREATE POLICY "Allow Public Inserts to base_comparisons"
ON public.base_comparisons
FOR INSERT
TO authenticated, anon
WITH CHECK (true);

CREATE POLICY "Allow Public Select from base_comparisons" 
ON public.base_comparisons
FOR SELECT
TO authenticated, anon
USING (true);

ALTER TABLE public.base_comparisons ENABLE ROW LEVEL SECURITY;