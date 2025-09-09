"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { PostgrestError } from "@supabase/supabase-js";
import useSWR from "swr";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";

interface Props {
  onClickItem: (id: string) => void;
}

export const Leaderboard = ({ onClickItem }: Props) => {
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
      .not("z_avg_similarity_score", "is", null)
      .order("z_avg_similarity_score", { ascending: false })
      .limit(25);

    if (submissionsError) {
      console.log("submissionsError: ", submissionsError);
      throw submissionsError as PostgrestError;
    }
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

  if (error) {
    return <p>Error loading leaderboard data</p>;
  }

  return (
    <div className="flex flex-col w-full gap-4">
      {!submissions && (
        <div className="flex justify-center items-center h-full">
          <p className="text-white italic text-sm">Loading...</p>
        </div>
      )}

      {submissions && submissions.length > 3 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {submissions.map((item, index) => (
            <GalleryItem_Image
              key={item.id}
              id={item.id}
              imageUrl={item.image_url}
              rank={index + 1}
              onClick={onClickItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
