"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { LEADERBOARD_PAGE_SIZE } from "../constants";
import { PostgrestError } from "@supabase/supabase-js";
import useSWRInfinite from "swr/infinite";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";

interface Props {
  onClickItem: (id: string) => void;
}

const fetcher = async (
  pageIndex: number,
  pageSize: number = LEADERBOARD_PAGE_SIZE
): Promise<any> => {
  // const offset: number = pageIndex * pageSize;
  console.log(pageIndex, pageSize);

  const { data: submissions, error: submissionsError } = await supabase
    .from("submissions")
    .select(
      `
      id,
      image_url,
      created_at
    `
    );

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
    .in("submission_id", submissionIds);

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

  submissionsWithScores.sort((a, b) => b.highest_score - a.highest_score);

  return submissionsWithScores;
};

const getKey = (
  pageIndex: number,
  previousPageData: Submission[] | null
): string | null => {
  if (previousPageData && previousPageData.length === 0) return null;
  return `leaderboard-${pageIndex}`;
};

export const Leaderboard = ({ onClickItem }: Props) => {
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
    <div className="flex flex-col w-full gap-4">
      {submissions[0] && (
        <GalleryItem_Image
          key={submissions[0].id}
          id={submissions[0].id}
          imageUrl={submissions[0].image_url}
          similarityScore={submissions[0].highest_score}
          createdAt={submissions[0].created_at}
          rank={1}
          onClick={onClickItem}
        />
      )}

      {submissions.length > 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {submissions.slice(1, 3).map((item, index) => (
            <GalleryItem_Image
              key={item.id}
              id={item.id}
              imageUrl={item.image_url}
              similarityScore={item.highest_score}
              createdAt={item.created_at}
              rank={index + 2}
              onClick={onClickItem}
            />
          ))}
        </div>
      )}

      {submissions.length > 3 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {submissions.slice(3).map((item, index) => (
            <GalleryItem_Image
              key={item.id}
              id={item.id}
              imageUrl={item.image_url}
              similarityScore={item.highest_score}
              createdAt={item.created_at}
              rank={index + 4}
              onClick={onClickItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
