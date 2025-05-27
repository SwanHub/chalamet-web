CREATE OR REPLACE FUNCTION normalize_submission_scores()
RETURNS TRIGGER AS $$
DECLARE
    mean_score FLOAT;
    std_dev FLOAT;
BEGIN
    -- Calculate mean and standard deviation of all non-null highest_scores
    SELECT 
        AVG(highest_score),
        STDDEV(highest_score)
    INTO
        mean_score,
        std_dev
    FROM submissions
    WHERE highest_score IS NOT NULL;

    -- Only proceed if we have valid statistics
    IF std_dev IS NOT NULL AND std_dev > 0 THEN
        -- Update all normalized scores using z-score formula
        -- Then transform to 0-100 scale:
        -- 1. Z-score gives us roughly -3 to +3 (99.7% of data)
        -- 2. Add 3 to shift to 0-6 range
        -- 3. Divide by 6 to get 0-1 range
        -- 4. Multiply by 100 to get 0-100 range
        UPDATE submissions
        SET normalized_score = (
            (((highest_score - mean_score) / std_dev) + 3) / 6 * 100
        )
        WHERE highest_score IS NOT NULL;
    END IF;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that runs after any update to highest_score
CREATE TRIGGER normalize_submission_scores
AFTER UPDATE OF highest_score ON submissions
FOR EACH STATEMENT
EXECUTE FUNCTION normalize_submission_scores();