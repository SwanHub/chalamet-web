-- Update submissions.normalized_score with the highest normalized_score from related submission_scores
UPDATE submissions
SET normalized_score = (
    SELECT MAX(normalized_score)
    FROM submission_scores
    WHERE submission_scores.submission_id = submissions.id
)
WHERE EXISTS (
    SELECT 1
    FROM submission_scores
    WHERE submission_scores.submission_id = submissions.id
); 