"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

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
    <div className="w-full flex flex-col flex-grow justify-center items-center text-center">
      <div className="relative flex flex-col gap-4 pb-6 justify-center items-center">
        <div className="flex flex-col gap-4 items-center relative">
          <h1 className="font-bold text-5xl">chalamet.wtf</h1>
          <div className="relative">
            {submissionCount !== null && (
              <span className="text-sm bg-white px-3 py-1 w-fit absolute z-20 top-0 left-0 border">
                <span className="text-sm font-semibold">
                  {submissionCount.toLocaleString()}
                </span>{" "}
                submissions so far
              </span>
            )}
            <Link
              href="https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm bg-white p-1 w-fit absolute z-20 top-0 right-0 border"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
            <img
              src="/banners/washington-square-park.png"
              alt="Timothee Chalamet lookalike competition in Washington Square Park"
              className="w-124 h-full border"
            />
            <h1 className="bg-black text-white font-bold text-3xl font-playfair absolute z-20 bottom-0 left-0 right-0 pb-2">
              Timothee Chalamet
              <br />
              Look alike Competition
              <br />
              Judged by an AI
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header_Title;
