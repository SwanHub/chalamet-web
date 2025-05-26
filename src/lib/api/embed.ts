import { supabase } from "@/lib/supabase";

export async function createVectorEmbOfImage(
  imageUrl: string
): Promise<number[] | null> {
  try {
    const response = await fetch("/api/embed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageUrl }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const result = await response.json();
    return result.embedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    return null;
  }
}
