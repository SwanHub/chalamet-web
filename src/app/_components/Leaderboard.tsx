"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { LEADERBOARD_PAGE_SIZE } from "../constants";
import { PostgrestError } from "@supabase/supabase-js";
import useSWRInfinite from "swr/infinite";
import { FirstPlace } from "../../components/list-items/ListItem_Entry";
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
    .order("similarity_score", { ascending: false });

  if (error) throw error as PostgrestError;
  return data;
};

const getKey = (
  pageIndex: number,
  previousPageData: Submission[] | null
): string | null => {
  if (previousPageData && previousPageData.length === 0) return null;
  return `leaderboard-${pageIndex}`;
};

export const Leaderboard = () => {
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
    <div className="flex flex-col w-full gap-4">
      {submissions[0] && (
        <FirstPlace key={submissions[0].id} item={submissions[0]} index={0} />
      )}

      {submissions.length > 2 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {submissions.slice(1, 3).map((item, index) => (
            <GalleryItem_Image
              key={item.id}
              imageUrl={item.submissions.image_url}
              similarityScore={item.similarity_score}
              createdAt={item.created_at}
              rank={index + 2}
            />
          ))}
        </div>
      )}

      {submissions.length > 3 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {submissions.slice(3).map((item, index) => (
            <GalleryItem_Image
              key={item.id}
              imageUrl={item.submissions.image_url}
              similarityScore={item.similarity_score}
              createdAt={item.created_at}
              rank={index + 4}
            />
          ))}
        </div>
      )}
    </div>
  );
};
