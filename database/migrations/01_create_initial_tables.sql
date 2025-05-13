CREATE TABLE IF NOT EXISTS "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "name" VARCHAR(100),
  "email" VARCHAR(255) UNIQUE
);

CREATE TABLE IF NOT EXISTS "base_comparisons" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "name" VARCHAR(100) NOT NULL,
  "description" TEXT,
  "embedding_url" TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS "submissions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "image_url" TEXT NOT NULL,
  "user_id" UUID REFERENCES "users"(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS "submission_scores" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  "submission_id" UUID REFERENCES "submissions"(id) ON DELETE CASCADE NOT NULL,
  "base_comparison_id" UUID REFERENCES "base_comparisons"(id) ON DELETE CASCADE NOT NULL,
  "similarity_score" DECIMAL(5,4) NOT NULL,
  UNIQUE("submission_id", "base_comparison_id")
);
