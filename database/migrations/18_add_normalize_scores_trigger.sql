-- Drop existing function and trigger if they exist
DROP TRIGGER IF EXISTS normalize_scores_trigger ON submission_scores;
DROP FUNCTION IF EXISTS normalize_raw_similarity_scores();

-- Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION normalize_raw_similarity_scores()
RETURNS TRIGGER AS $$
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
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER normalize_scores_trigger
    AFTER INSERT OR UPDATE OF similarity_score
    ON submission_scores
    FOR EACH ROW
    EXECUTE FUNCTION normalize_raw_similarity_scores(); 