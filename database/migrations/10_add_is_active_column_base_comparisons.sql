ALTER TABLE public.base_comparisons
ADD COLUMN is_active BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX idx_base_comparisons_is_active ON public.base_comparisons(is_active);