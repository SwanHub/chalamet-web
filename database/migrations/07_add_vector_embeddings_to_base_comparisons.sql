CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE base_comparisons
ADD COLUMN image_url TEXT;

ALTER TABLE base_comparisons
ADD COLUMN embedding_vector vector(512);

ALTER TABLE base_comparisons
DROP COLUMN embedding_url;

CREATE INDEX ON base_comparisons
USING ivfflat (embedding_vector vector_cosine_ops);

