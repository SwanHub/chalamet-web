"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Header_Title = () => {
  const article =
    "https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html";

  const [submissionCount, setSubmissionCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true });

      if (!error) setSubmissionCount(count ?? 0);
    };

    fetchCount();
  }, []);

  return (
    <div className="text-white pb-6 w-full flex flex-col flex-grow">
      <div className="relative flex flex-col gap-4 pb-8">
        {submissionCount !== null && (
          <span className="absolute top-0 md:right-36 hidden md:block text-sm text-cyan-300 bg-gray-800/50 border border-cyan-500 px-3 py-1 rounded-full w-fit shadow-md">
            <span className="font-mono text-sm font-semibold">
              {submissionCount.toLocaleString()}
            </span>{" "}
            submissions so far
          </span>
        )}
        {/* add small chalamet images here */}
        <h1 className="font-thin text-gray-400 text-base uppercase">
          Compete in the Internet Official
        </h1>
        <h1 className="font-bold sm:text-6xl text-4xl">
          Timothée Chalamet Lookalike Contest
        </h1>
      </div>

      <div className="text-lg">
        <span className="inline sm:block pb-2">
          Did you miss the iconic{" "}
          <Link
            href={article}
            target="_blank"
            className="font-medium text-cyan-500 underline underline-offset-2"
          >
            Timothée Chalamet Lookalike Contest
          </Link>{" "}
          in NYC?{" "}
          <span className="sm:hidden">
            Here&apos;s your chance to compete{" 👇"}
          </span>
        </span>
        <span className="hidden sm:block">
          Here&apos;s your chance to compete{" 👇"}
        </span>
      </div>
    </div>
  );
};

export default Header_Title;
