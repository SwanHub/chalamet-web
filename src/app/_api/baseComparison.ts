import { supabase } from "@/lib/supabase";

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
