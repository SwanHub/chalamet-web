DROP POLICY IF EXISTS "Anyone can create a submission" ON "submissions";
CREATE POLICY "Anyone can create a submission" 
ON "submissions" 
FOR INSERT 
WITH CHECK (true);

DROP POLICY IF EXISTS "Anyone can insert scores" ON "submission_scores";
CREATE POLICY "Anyone can insert scores" 
ON "submission_scores" 
FOR INSERT 
WITH CHECK (true);