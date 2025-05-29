"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Header_Title = () => {
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
    <div className="text-white w-full flex flex-col flex-grow justify-center items-center text-center">
      <div className="relative flex flex-col gap-4 pb-6 justify-center items-center">
        <h1 className="font-light text-gray-300 text-base uppercase">
          Calling all doppelgängers
        </h1>
        <h1 className="font-bold sm:text-5xl text-4xl font-playfair">
          Timothée Chalamet Lookalike Contest
        </h1>
        {submissionCount !== null && (
          <span className="text-sm text-cyan-300 bg-gray-800/50 border border-cyan-500 px-3 py-1 rounded-full w-fit shadow-md">
            <span className="font-mono text-sm font-semibold">
              {submissionCount.toLocaleString()}
            </span>{" "}
            submissions so far
          </span>
        )}
      </div>
    </div>
  );
};

export default Header_Title;
