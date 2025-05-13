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
