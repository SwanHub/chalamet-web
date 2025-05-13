export type ClipResponse = {
  outputs: ClipComparisonOuter[];
};

export type ClipComparisonOuter = {
  clip_comparison: ClipComparison;
};

export interface ClipComparison {
  parent_id: string;
  root_parent_id: string;
  similarities: number[];
  max_similarity: number;
  most_similar_class: string;
  min_similarity: number;
  least_similar_class: string;
  classification_predictions: ClassificationPredictions;
}

export interface ClassificationPrediction {
  class: string;
  class_id: number;
  confidence: number;
}

export interface ClassificationPredictions {
  predictions: ClassificationPrediction[];
  top: string;
  confidence: number;
  parent_id: string;
}

export interface ClipComparisonResponse {
  clip_comparison: ClipComparison;
}

export type ClipComparisonResponseArray = ClipComparisonResponse[];

export type Submission = {
  id: string;
  created_at: number;
  similarity_score: number;
  submissions: {
    image_url: string;
  };
};

export type SubmissionWithScore = {
  id: string;
  created_at: string; // or `Date` if you're converting it
  similarity_score: number;
  submission_id: string;
  submissions: {
    id: string;
    image_url: string;
    created_at: string; // or `Date`
  };
};
