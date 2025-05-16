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
      <div className="relative text-6xl flex flex-col gap-4 pb-8">
        <h1 className="font-thin text-gray-400 text-base uppercase">
          Compete in the Internet Official
          {/* <br /> */}
        </h1>
        <h1 className="font-bold">
          Timothée Chalamet
          <br />
          Lookalike Contest
        </h1>
      </div>

      <span className="text-lg pb-2">
        Did you miss the iconic{" "}
        <Link
          href={article}
          target="_blank"
          className="font-medium text-cyan-500 underline underline-offset-2"
        >
          Timothée Chalamet Lookalike Contest
        </Link>{" "}
        in NYC?
      </span>
      <span className="text-lg">Here's your chance{" →"}</span>
      {/* {submissionCount !== null && (
        <span className="text-base text-cyan-300 bg-gray-800/50 border border-cyan-500 px-4 py-2 rounded-full w-fit shadow-md">
          <span className="font-mono text-lg font-semibold">
            {submissionCount.toLocaleString()}
          </span>{" "}
          submissions so far
        </span>
      )} */}
    </div>
  );
};

export default Header_Title;
