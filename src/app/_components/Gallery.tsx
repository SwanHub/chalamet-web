"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { LEADERBOARD_PAGE_SIZE } from "../constants";
import { PostgrestError } from "@supabase/supabase-js";
import useSWRInfinite from "swr/infinite";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";

const fetcher = async (
  pageIndex: number,
  pageSize: number = LEADERBOARD_PAGE_SIZE
): Promise<any> => {
  const offset: number = pageIndex * pageSize;
  const { data, error } = await supabase
    .from("submission_scores")
    .select(
      `
    id,
    created_at,
    similarity_score,
    submission_id,
    submissions (
      id,
      image_url,
      created_at
    )
  `
    )
    .order("created_at", { ascending: false });

  if (error) throw error as PostgrestError;
  return data;
};

const getKey = (
  pageIndex: number,
  previousPageData: Submission[] | null
): string | null => {
  if (previousPageData && previousPageData.length === 0) return null;
  return `gallery-${pageIndex}`;
};

export const SubmissionGallery = () => {
  const { data, error, size, setSize } = useSWRInfinite<Submission[]>(
    getKey,
    fetcher
  );

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
      {submissions.map((item, index) => (
        <GalleryItem_Image
          key={item.id}
          imageUrl={item.submissions.image_url}
          similarityScore={item.similarity_score}
          createdAt={item.created_at}
        />
      ))}
    </div>
  );
};
