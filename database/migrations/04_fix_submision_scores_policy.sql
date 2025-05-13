DROP POLICY "Only service roles can insert scores" ON submission_scores;
CREATE POLICY "Anyone can insert scores" ON submission_scores FOR INSERT WITH CHECK (true);
