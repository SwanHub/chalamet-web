ALTER TABLE submissions
ADD COLUMN highest_score FLOAT,
ADD COLUMN normalized_score FLOAT;

CREATE INDEX idx_submissions_highest_score ON submissions(highest_score DESC NULLS LAST);
CREATE INDEX idx_submissions_normalized_score ON submissions(normalized_score DESC NULLS LAST); 