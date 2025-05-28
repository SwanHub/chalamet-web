-- Create the normalization function
CREATE OR REPLACE FUNCTION submission_score_normalizer()
RETURNS void AS $$
DECLARE
    mean_score FLOAT;
    std_dev FLOAT;
BEGIN
    -- Calculate mean and standard deviation of all non-null similarity_scores
    SELECT 
        AVG(similarity_score),
        STDDEV(similarity_score)
    INTO
        mean_score,
        std_dev
    FROM submission_scores
    WHERE similarity_score IS NOT NULL;

    -- Only proceed if we have valid statistics
    IF std_dev IS NOT NULL AND std_dev > 0 THEN
        -- Update all normalized scores using z-score formula
        -- Then transform to 0-100 scale:
        -- 1. Z-score gives us roughly -3 to +3 (99.7% of data)
        -- 2. Add 3 to shift to 0-6 range
        -- 3. Divide by 6 to get 0-1 range
        -- 4. Multiply by 100 to get 0-100 range
        UPDATE submission_scores
        SET normalized_score = (
            (((similarity_score - mean_score) / std_dev) + 3) / 6 * 100
        )
        WHERE similarity_score IS NOT NULL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Execute the function
SELECT submission_score_normalizer();