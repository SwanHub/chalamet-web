import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";

export function formatRelativeTimestamp(
  timestamp: string | number | Date
): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  if (diffInSeconds < 60) {
    return "just now";
  }
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes}${minutes === 1 ? "min" : "mins"} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours}${hours === 1 ? "hr" : "hrs"} ago`;
  }
  if (diffInSeconds < 172800) {
    return "yesterday";
  }
  const currentYear = now.getFullYear();
  const timestampYear = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  if (currentYear === timestampYear) {
    return `${month}/${day}`;
  }
  const yearShort = timestampYear.toString().slice(-2);
  return `${month}/${day}/${yearShort}`;
}

export async function imageUrlToBlob(imageUrl: string) {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return blob;
}

export const base64ToBlob = async (base64Data: string): Promise<Blob> => {
  const base64 = base64Data.includes("base64,")
    ? base64Data.split("base64,")[1]
    : base64Data;

  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);

  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return new Blob([bytes], { type: "image/jpeg" });
};

export const formatSimilarityScore = (score: number): string => {
  return `${(score * 100).toFixed(2)}%`;
};

export function formatPercent(score: number | string): string {
  const value = typeof score === "string" ? parseFloat(score) : score;
  if (isNaN(value)) return "0.0%";
  return `${(value * 100).toFixed(1)}%`;
}

export function formatTwoDecimals(score: number | string | null): string {
  if (!score) return "0.0%";
  const value = typeof score === "string" ? parseFloat(score) : score;
  if (isNaN(value)) return "0.0%";
  return `${value.toFixed(1)}%`;
}

function calculateCentroid(embeddings: number[][]): number[] {
  if (!embeddings || embeddings.length === 0) {
    throw new Error("Embeddings array is empty");
  }

  const embeddingDim = embeddings[0].length;

  // Calculate mean across all embeddings (axis=0 equivalent)
  const avg = new Array(embeddingDim).fill(0);

  for (const embedding of embeddings) {
    for (let i = 0; i < embeddingDim; i++) {
      avg[i] += embedding[i];
    }
  }

  // Divide by number of embeddings to get mean
  for (let i = 0; i < embeddingDim; i++) {
    avg[i] /= embeddings.length;
  }

  // Calculate L2 norm (magnitude)
  let embeddingNorm = 0;
  for (const value of avg) {
    embeddingNorm += value * value;
  }
  embeddingNorm = Math.sqrt(embeddingNorm);

  if (embeddingNorm === 0) {
    throw new Error("Zero vector encountered during normalization.");
  }

  // Normalize by dividing each component by the norm
  const normalizedAvg = avg.map((value) => value / embeddingNorm);

  return normalizedAvg;
}

export const getCentroidOfBaseComparisons = async (
  baseComparisons: { id: string; embedding_vector: number[] }[]
): Promise<number[]> => {
  try {
    // Extract just the embedding vectors from the base comparisons
    const embeddings = baseComparisons.map((comp) => comp.embedding_vector);

    // Calculate and return the centroid
    return calculateCentroid(embeddings);
  } catch (error) {
    console.error("Error calculating centroid of base comparisons:", error);
    throw error;
  }
};

export const capitalizeFirstLetters = (string: string): string => {
  return string
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const randomName = () => {
  const filteredAdjectives = adjectives.filter(
    (word) => word.length >= 4 && word.length <= 8
  );
  const filteredAnimals = animals.filter(
    (word) => word.length >= 4 && word.length <= 8
  );
  const filteredColors = colors.filter(
    (word) => word.length >= 4 && word.length <= 8
  );

  const name = uniqueNamesGenerator({
    dictionaries: [filteredAdjectives, [...filteredAnimals, ...filteredColors]],
    separator: " ",
    length: 2,
    style: "capital",
  });

  return name;
};
