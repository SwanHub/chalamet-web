import { supabase } from "@/lib/supabase";
import { ID_CHALAMET_BASE_COMPARISON_TEXT_EMB } from "../constants";
import { ClipResponse } from "../types";

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
          api_key: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY,
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

export async function createSubmission(imageUrl: string): Promise<string> {
  const { data, error } = await supabase
    .from("submissions")
    .insert([{ image_url: imageUrl }])
    .select();

  if (error) throw error;
  return data[0].id;
}

export async function createSubmissionScore(
  submissionId: string,
  similarityScore: number
) {
  const { error } = await supabase.from("submission_scores").insert([
    {
      submission_id: submissionId,
      base_comparison_id: ID_CHALAMET_BASE_COMPARISON_TEXT_EMB,
      similarity_score: similarityScore,
    },
  ]);
  if (error) throw error;
}
