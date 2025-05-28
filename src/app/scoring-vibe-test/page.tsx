"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { PostgrestError } from "@supabase/supabase-js";
import useSWR from "swr";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";

export default function ScoringTest() {
  const fetcher = async (): Promise<Submission[]> => {
    const { data: submissions, error: submissionsError } = await supabase
      .from("submissions")
      .select(
        `
        id,
        image_url,
        created_at,
        highest_normalized_score,
        z_highest_normalized_score,
        avg_similarity_score,
        z_avg_similarity_score,
        centroid_similarity_score,
        z_centroid_similarity_score,
        text_similarity_score,
        z_text_similarity_score
      `
      )
      .not("highest_normalized_score", "is", null)
      .order("highest_normalized_score", { ascending: false })
      .limit(25);

    if (submissionsError) throw submissionsError as PostgrestError;

    return submissions.map((submission: any) => ({
      ...submission,
      highest_normalized_score: submission.highest_normalized_score || 0,
      z_highest_normalized_score: submission.z_highest_normalized_score || 0,
      avg_similarity_score: submission.avg_similarity_score || 0,
      z_avg_similarity_score: submission.z_avg_similarity_score || 0,
      centroid_similarity_score: submission.centroid_similarity_score || 0,
      z_centroid_similarity_score: submission.z_centroid_similarity_score || 0,
      text_similarity_score: submission.text_similarity_score || 0,
      z_text_similarity_score: submission.z_text_similarity_score || 0,
    }));
  };

  const { data: submissions, error } = useSWR<Submission[]>(
    "leaderboard",
    fetcher
  );

  function onClickItem(id: string) {
    console.log("clicked item", id);
  }

  return (
    <div className="flex flex-col w-full gap-4 max-w-screen-sm min-h-screen self-center">
      <h1 className="text-white text-2xl font-bold py-12 self-center">
        Scoring Vibe Test
      </h1>
      {error && (
        <p className="text-white italic text-sm">
          Error loading leaderboard data
        </p>
      )}
      {!submissions && (
        <div className="flex justify-center items-center h-full">
          <p className="text-white italic text-sm">Loading...</p>
        </div>
      )}

      {submissions && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
          {submissions.map((item, index) => (
            <GalleryItem_Image
              key={item.id}
              id={item.id}
              imageUrl={item.image_url}
              similarityScore={item.highest_normalized_score}
              createdAt={item.created_at}
              rank={index + 1}
              onClick={onClickItem}
            />
          ))}
        </div>
      )}
    </div>
  );
}
