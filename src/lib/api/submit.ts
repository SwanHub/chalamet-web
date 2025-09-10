import { supabase } from "@/lib/supabase";
import { SubmitScore } from "../../app/types";
import similarity from "compute-cosine-similarity";
import { capitalizeFirstLetters } from "../utils";

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
  embedding: number[],
  name: string
): Promise<string> {
  const { data, error } = await supabase
    .from("submissions")
    .insert([
      {
        image_url: imageUrl,
        embedding_vector: embedding,
        name: capitalizeFirstLetters(name),
      },
    ])
    .select();

  if (error) throw error;
  return data[0].id;
}

export const fetchSubmissionResults = async (
  submissionId: string
): Promise<any> => {
  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .select(
      "id, image_url, z_avg_similarity_score, created_order, name, created_at"
    )
    .eq("id", submissionId)
    .single();

  if (submissionError) throw submissionError;

  const { count: rank, error: rankError } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true })
    .gt("z_avg_similarity_score", submissionData.z_avg_similarity_score)
    .neq("id", submissionData.id);

  if (rankError) throw rankError;

  const { count: totalSubmissions } = await supabase
    .from("submissions")
    .select("*", { count: "exact", head: true });

  const { data: scoresData, error: scoresError } = await supabase
    .from("submission_scores")
    .select(
      `
      id,
      created_at,
      similarity_score,
      normalized_score,
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
    rank: (rank || 0) + 1,
    totalSubmissions: totalSubmissions,
    scores: scoresData,
    name: submissionData.name,
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

export async function recomputeSimilarityScores(): Promise<{
  success: boolean;
  total: number;
  updated: number;
  errors: string[];
}> {
  // ensure submission_scores table is empty
  const result = {
    success: false,
    total: 0,
    updated: 0,
    errors: [] as string[],
  };

  try {
    // Fetch all submissions with their embeddings
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select("id, embedding_vector");

    if (submissionsError) throw submissionsError;
    result.total = submissions.length;

    // Get all base comparisons once to avoid multiple queries
    const baseComparisons = await getAllBaseComparisons();

    // Process each submission
    for (const submission of submissions) {
      try {
        if (!submission.embedding_vector) {
          result.errors.push(
            `Submission ${submission.id} has no embedding vector`
          );
          continue;
        }

        const submissionVector = Array.isArray(submission.embedding_vector)
          ? submission.embedding_vector
          : JSON.parse(submission.embedding_vector);

        const scores: SubmitScore[] = [];
        baseComparisons.forEach((item) => {
          const baseVector = Array.isArray(item.embedding_vector)
            ? item.embedding_vector
            : JSON.parse(item.embedding_vector);

          const cosine_similarity = similarity(submissionVector, baseVector);
          scores.push({
            similarity_score: cosine_similarity ? cosine_similarity : 0,
            submission_id: submission.id,
            base_comparison_id: item.id,
          });
        });

        // Insert new scores
        const { error: insertError } = await supabase
          .from("submission_scores")
          .insert(scores);

        if (insertError) {
          result.errors.push(
            `Failed to insert new scores for submission ${submission.id}: ${insertError.message}`
          );
          continue;
        }

        result.updated++;
      } catch (err: any) {
        result.errors.push(
          `Error processing submission ${submission.id}: ${err.message}`
        );
      }
    }

    result.success = true;
  } catch (err: any) {
    result.errors.push(`General error: ${err.message}`);
  }

  return result;
}
