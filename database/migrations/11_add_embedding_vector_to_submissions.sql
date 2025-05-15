ALTER TABLE submissions
ADD COLUMN embedding_vector vector(512);

CREATE INDEX ON submissions
USING ivfflat (embedding_vector vector_cosine_ops);