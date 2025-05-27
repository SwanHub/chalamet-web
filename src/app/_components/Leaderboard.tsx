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
        highest_score,
        normalized_score
      `
      )
      .order("highest_score", { ascending: false })
      .limit(25);

    if (submissionsError) throw submissionsError as PostgrestError;

    return submissions.map((submission) => ({
      ...submission,
      highest_score: submission.highest_score || 0,
      normalized_score:
        submission.normalized_score || submission.highest_score || 0,
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
    <div className="flex flex-col w-full gap-4 pb-36">
      {!submissions && (
        <div className="flex justify-center items-center h-full">
          <p className="text-white italic text-sm">Loading...</p>
        </div>
      )}
      {submissions && submissions[0] && (
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

      {submissions && submissions.length > 2 && (
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

      {submissions && submissions.length > 3 && (
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
