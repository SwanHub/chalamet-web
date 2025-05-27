-- Drop existing trigger and function if they exist
DROP TRIGGER IF EXISTS update_highest_score_trigger ON submission_scores;
DROP FUNCTION IF EXISTS update_highest_score();

-- Create the function
CREATE FUNCTION update_highest_score() 
RETURNS trigger AS $$
BEGIN
    UPDATE submissions
    SET highest_score = NEW.similarity_score
    WHERE id = NEW.submission_id
    AND (highest_score IS NULL OR NEW.similarity_score > highest_score);
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
CREATE TRIGGER update_highest_score_trigger
AFTER INSERT OR UPDATE ON submission_scores
FOR EACH ROW
EXECUTE FUNCTION update_highest_score();