import { supabase } from "@/lib/supabase";
import { ClipResponse, SubmitScore } from "../../app/types";

export const batchInsertSimilarityScores = async (
  scores: SubmitScore[]
): Promise<{ success: boolean; count: number }> => {
  try {
    if (!scores || scores.length === 0) {
      return { success: true, count: 0 };
    }

    const { error } = await supabase.from("submission_scores").insert(scores);

    if (error) {
      console.error("Error inserting similarity scores:", error);
      throw error;
    }

    return {
      success: true,
      count: scores.length,
    };
  } catch (error) {
    console.error("Failed to insert similarity scores:", error);
    return {
      success: false,
      count: 0,
    };
  }
};

export async function createSubmissionWithEmbedding(
  imageUrl: string,
  embedding: number[]
): Promise<string> {
  const { data, error } = await supabase
    .from("submissions")
    .insert([{ image_url: imageUrl, embedding_vector: embedding }])
    .select();

  if (error) throw error;
  return data[0].id;
}

export const fetchSubmissionResults = async (
  submissionId: string
): Promise<any> => {
  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .select("id, image_url, highest_score, normalized_score")
    .eq("id", submissionId)
    .single();

  if (submissionError) throw submissionError;

  const { data: scoresData, error: scoresError } = await supabase
    .from("submission_scores")
    .select(
      `
      id,
      created_at,
      similarity_score,
      submission_id,
      base_comparison_id,
      base_comparisons(id, image_url, name)
    `
    )
    .eq("submission_id", submissionId)
    .order("similarity_score", { ascending: false });

  if (scoresError) throw scoresError;

  const returnObj = {
    submission: submissionData,
    scores: scoresData,
  };
  return returnObj;
};

export const getAllBaseComparisons = async () => {
  const { data, error } = await supabase
    .from("base_comparisons")
    .select("id, embedding_vector")
    .eq("is_active", true);

  if (error) throw error;

  return data.map((item) => ({
    id: item.id,
    embedding_vector: JSON.parse(item.embedding_vector),
  }));
};

export async function uploadImageToSubmissions(
  blob: Blob,
  fileName: string
): Promise<string> {
  const { error: storageError } = await supabase.storage
    .from("submissions")
    .upload(fileName, blob, {
      contentType: "image/jpeg",
      cacheControl: "3600",
    });

  if (storageError) throw storageError;

  const {
    data: { publicUrl },
  } = supabase.storage.from("submissions").getPublicUrl(fileName);

  return publicUrl;
}

// ------- OLD -------------------------------------------------

export const fetchSimilarityScore = async (
  base64Image: string
): Promise<number> => {
  try {
    const base64Data = base64Image.includes("base64,")
      ? base64Image.split("base64,")[1]
      : base64Image;

    const response = await fetch(
      "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/detect-and-classify",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.ROBOFLOW_API_KEY,
          inputs: {
            image: {
              type: "base64",
              value: base64Data,
            },
            text_classes: ["timothée chalamet"],
            version: "ViT-B-16",
          },
        }),
      }
    );
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const result: ClipResponse = await response.json();
    if (result.outputs) {
      return result.outputs[0].clip_comparison.similarities[0];
    } else {
      throw new Error("No similarity score returned");
    }
  } catch (err: any) {
    console.error("Error fetching similarity score:", err);
    throw err;
  }
};

export async function createSubmission(imageUrl: string): Promise<string> {
  const { data, error } = await supabase
    .from("submissions")
    .insert([{ image_url: imageUrl }])
    .select();

  if (error) throw error;
  return data[0].id;
}
