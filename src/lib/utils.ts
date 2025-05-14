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
