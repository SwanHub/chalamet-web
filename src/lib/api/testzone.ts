import { EmbedResponse } from "@/app/types";

export const compareToCentroid = async (imageUrl: string): Promise<any> => {
  const response = await fetch(
    "http://127.0.0.1:8000/general_chalamet_similarity",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    }
  );

  const result = await response.json();
  return result;
};

export const calculateTextClipComparison = async (
  imageUrl: string
): Promise<number[] | undefined> => {
  try {
    const response = await fetch("/api/compare_text_clip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: imageUrl }),
    });
    const data: any = await response.json();
    return data;
  } catch (error) {
    console.error("Error testing server side:", error);
  }
};
