"use client";

import { supabase } from "@/lib/supabase";
import { Submission } from "../types";
import { LEADERBOARD_PAGE_SIZE } from "../constants";
import { PostgrestError } from "@supabase/supabase-js";
import useSWRInfinite from "swr/infinite";
import { ListItem_LeaderboardEntry } from "./ListItem_Entry";

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
    <div className="flex flex-col w-full">
      {submissions.map((item, index) => (
        <ListItem_LeaderboardEntry
          key={item.id}
          item={item}
          index={index}
          isActive={index === 0}
        />
      ))}
    </div>
  );
};
