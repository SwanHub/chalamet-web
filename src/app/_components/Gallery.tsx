"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { PostgrestError } from "@supabase/supabase-js";
import useSWRInfinite from "swr/infinite";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";

interface Props {
  onClickItem: (id: string) => void;
}

const fetcher = async (): Promise<any> => {
  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select(
      `
      id,
      image_url,
      created_at,
      z_avg_similarity_score
    `
    )
    .order("created_at", { ascending: false });

  if (submissionsError) throw submissionsError as PostgrestError;

  const submissionIds = submissions.map((sub) => sub.id);

  const { data: scoreData, error: scoreError } = await supabase
    .from("submission_scores")
    .select(
      `
        submission_id,
        similarity_score
      `
    )
    .in("submission_id", submissionIds)
    .order("similarity_score", { ascending: false });

  if (scoreError) throw scoreError as PostgrestError;

  const highestScores: Record<string, number> = {};
  if (scoreData) {
    scoreData.forEach((score) => {
      if (
        !highestScores[score.submission_id] ||
        score.similarity_score > highestScores[score.submission_id]
      ) {
        highestScores[score.submission_id] = score.similarity_score;
      }
    });
  }
  const submissionsWithScores = submissions.map((submission) => ({
    ...submission,
    highest_score: highestScores[submission.id] || 0,
  }));
  return submissionsWithScores;
};

const getKey = (
  pageIndex: number,
  previousPageData: Submission[] | null
): string | null => {
  if (previousPageData && previousPageData.length === 0) return null;
  return `gallery-${pageIndex}`;
};

export const SubmissionGallery = ({ onClickItem }: Props) => {
  const { data, error } = useSWRInfinite<Submission[]>(getKey, fetcher);

  const submissions: Submission[] = data
    ? ([] as Submission[]).concat(...data)
    : [];

  if (error) {
    console.log(error);
    return <p>Error loading leaderboard data: </p>;
  }
  if (!data) return <p>Loading...</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 w-full gap-4">
      {submissions.map((item) => (
        <GalleryItem_Image
          key={item.id}
          onClick={onClickItem}
          id={item.id}
          imageUrl={item.image_url}
          rank={null}
        />
      ))}
    </div>
  );
};
