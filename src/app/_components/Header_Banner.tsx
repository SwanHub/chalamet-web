"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const Header_Banner = () => {
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
    <div className="relative w-full text-center flex flex-col items-center justify-center gap-4">
      {submissionCount !== null && (
        <span className="text-sm bg-white px-2 py-1 w-fit border">
          <span className="text-sm font-semibold">
            {submissionCount.toLocaleString()}
          </span>{" "}
          total submissions
        </span>
      )}
      <img
        src="/images/chalamet.jpg"
        alt="Timothee Chalamet lookalike competition in Washington Square Park"
        className="w-124 h-full border"
      />
    </div>
  );
};

export default Header_Banner;
