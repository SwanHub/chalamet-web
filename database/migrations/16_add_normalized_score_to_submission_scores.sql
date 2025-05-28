-- Add normalized_score column to submission_scores
ALTER TABLE submission_scores
ADD COLUMN normalized_score FLOAT;

-- Create function to calculate normalized scores using z-score standardization
CREATE OR REPLACE FUNCTION normalize_submission_scores()
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

-- Execute the normalization function
SELECT normalize_submission_scores();

-- Create index for faster querying
CREATE INDEX idx_submission_scores_normalized ON submission_scores(normalized_score DESC NULLS LAST);

-- Create trigger function to update normalized scores when new scores are added
CREATE OR REPLACE FUNCTION update_normalized_scores()
RETURNS TRIGGER AS $$
BEGIN
    -- Recalculate all normalized scores when a new score is added
    PERFORM normalize_submission_scores();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger that fires after INSERT or UPDATE on submission_scores
CREATE TRIGGER update_normalized_scores_trigger
    AFTER INSERT OR UPDATE OF similarity_score
    ON submission_scores
    FOR EACH ROW
    EXECUTE FUNCTION update_normalized_scores(); 