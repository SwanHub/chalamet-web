import { supabase } from "@/lib/supabase";

export const fetchEmbedToAvg = async (imageUrl: string): Promise<any> => {
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

export const createVectorEmbOfImage = async (
  imageUrl: string
): Promise<any> => {
  const response = await fetch(
    "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/single-clip-embedding",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY,
        inputs: {
          image: { type: "url", value: imageUrl },
        },
        version: "ViT-B-32",
      }),
    }
  );

  const result = await response.json();
  if (result) {
    return result.outputs[0].image_embedding;
  } else {
    return null;
  }
};

export const testFastAPI = async (): Promise<any> => {
  const response = await fetch("http://127.0.0.1:8000/", { method: "GET" });
  const result = await response.json();
  return result;
};

export async function testEdgeFunction() {
  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/create-submission`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Functions" }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Response:", data);
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

export const fetchSubmissionResults = async (
  submissionId: string
): Promise<any> => {
  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .select("id, image_url")
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
