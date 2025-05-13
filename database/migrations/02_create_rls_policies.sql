ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "base_comparisons" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "submissions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "submission_scores" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Base comparisons are viewable by everyone" 
ON "base_comparisons" FOR SELECT USING (true);

CREATE POLICY "All submissions are publicly viewable" 
ON "submissions" FOR SELECT USING (true);

CREATE POLICY "Anyone can create a submission" 
ON "submissions" FOR INSERT WITH CHECK (true);

CREATE POLICY "All submission scores are publicly viewable" 
ON "submission_scores" FOR SELECT USING (true);

CREATE POLICY "Only service roles can insert scores" 
ON "submission_scores" FOR INSERT 
WITH CHECK (auth.role() = 'service_role' OR auth.role() = 'authenticated');

CREATE POLICY "Users can only update their own submissions" 
ON "submissions" FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can only delete their own submissions" 
ON "submissions" FOR DELETE 
USING (auth.uid() = user_id);