-- First, drop any existing trigger and function
DROP TRIGGER IF EXISTS update_submission_highest_score ON submission_scores;
DROP FUNCTION IF EXISTS update_submission_highest_score();

-- Create the function that will be called by the trigger
CREATE OR REPLACE FUNCTION update_submission_highest_score()
RETURNS TRIGGER AS $$
BEGIN
    -- Update submissions table only if new score is higher or current is null
    UPDATE submissions
    SET highest_score = NEW.similarity_score
    WHERE id = NEW.submission_id
    AND (highest_score IS NULL OR NEW.similarity_score > highest_score);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_submission_highest_score
AFTER INSERT ON submission_scores
FOR EACH ROW
EXECUTE FUNCTION update_submission_highest_score();