import { EmbedResponse } from "@/app/types";

export const createVectorEmbOfImage = async (
  imageUrl: string
): Promise<number[] | undefined> => {
  try {
    const response = await fetch("/api/embed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl: imageUrl }),
    });
    const data: EmbedResponse = await response.json();
    return data.image_embedding;
  } catch (error) {
    console.error("Error testing server side:", error);
  }
};
