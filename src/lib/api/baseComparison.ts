import { supabase } from "@/lib/supabase";
import { createVectorEmbOfImage } from "./embed";

export async function uploadImageToBaseComparisons(
  blob: Blob,
  fileName: string
): Promise<string> {
  const { error: storageError } = await supabase.storage
    .from("base-comparisons")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      cacheControl: "3600",
    });

  if (storageError) throw storageError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("base-comparisons").getPublicUrl(fileName);

  return publicUrl;
}

export async function createBaseComparison(
  name: string,
  description: string,
  embedding: number[],
  imageUrl: string
) {
  const { data, error } = await supabase.from("base_comparisons").insert([
    {
      name: name,
      description: description,
      embedding_vector: embedding,
      image_url: imageUrl,
    },
  ]);
  if (error) throw error;
  console.log("return data from insert: ", data);
}

export async function recalculateBaseComparisons(): Promise<{
  success: boolean;
  total: number;
  updated: number;
  errors: string[];
}> {
  const result = {
    success: false,
    total: 0,
    updated: 0,
    errors: [] as string[],
  };

  try {
    const { data: baseComparisons, error } = await supabase
      .from("base_comparisons")
      .select("id, image_url")
      .eq("is_active", true);

    if (error) throw error;
    result.total = baseComparisons.length;

    for (const comparison of baseComparisons) {
      try {
        const newEmbedding = await createVectorEmbOfImage(comparison.image_url);
        console.log(`newEmbedding: for ${comparison.id}`, newEmbedding);

        if (!newEmbedding) {
          result.errors.push(
            `Failed to generate embedding for comparison ${comparison.id}`
          );
          continue;
        }

        const { error: updateError } = await supabase
          .from("base_comparisons")
          .update({ embedding_vector: newEmbedding })
          .eq("id", comparison.id);

        if (updateError) {
          result.errors.push(
            `Failed to update comparison ${comparison.id}: ${updateError.message}`
          );
          continue;
        }

        result.updated++;
      } catch (err: any) {
        result.errors.push(
          `Error processing comparison ${comparison.id}: ${err.message}`
        );
      }
    }

    result.success = true;
  } catch (err: any) {
    result.errors.push(`General error: ${err.message}`);
  }

  return result;
}
