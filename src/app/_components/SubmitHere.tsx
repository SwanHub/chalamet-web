"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { SubmissionSimple } from "./SubmissionSimple";

const SubmitHere = () => {
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
    <div className="relative w-full text-center flex flex-col items-center justify-center gap-4 pb-16">
      {submissionCount !== null && (
        <span className="text-sm bg-white px-2 py-1 w-fit border">
          <span className="text-sm font-semibold text-violet-700">
            {submissionCount.toLocaleString()}
          </span>{" "}
          total submissions
        </span>
      )}
      <div className="w-full self-center flex justify-between items-center gap-4 pt-6">
        <SubmissionSimple />
        <p>vs.</p>
        <div className="flex flex-col w-full max-w-md">
          <div className="relative w-full">
            <div className="aspect-square w-full">
              <img
                src={"/images/chalamet.jpg"}
                alt={`Timothee Chalamet`}
                className="w-full h-full object-cover border border-black border-t-0"
              />
            </div>
          </div>
          <div className="w-full bg-white text-center py-2 px-2 border border-black">
            <p className="text-sm uppercase text-black font-medium">
              Timothee Chalamet
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubmitHere;
