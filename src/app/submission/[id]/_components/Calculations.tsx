"use client";

import { SubmissionResults, SubmissionScore } from "@/app/types";
import { formatTwoDecimals } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Props {
  data: SubmissionResults;
}

export const Calculations = ({ data }: Props) => {
  const [showAllComparisons, setShowAllComparisons] = useState(false);
  return (
    <div>
      <button
        onClick={() => setShowAllComparisons(!showAllComparisons)}
        className="w-full cursor-pointer mt-2 py-2 px-4 text-sm flex items-center justify-center gap-1 border border-black text-black bg-white"
      >
        {showAllComparisons ? (
          <>
            Hide calculations <ChevronUp className="w-4 h-4" />
          </>
        ) : (
          <>
            See Chalamet calculations <ChevronDown className="w-4 h-4" />
          </>
        )}
      </button>

      {showAllComparisons && (
        <div className="space-y-4 py-4">
          <p className="text-sm text-black">
            We compared your screenshot to 10 unique Chalamet looks. The
            percentage on the right is your similarity score to that version of
            Timmy. We then averaged the scores and compared{" "}
            <strong>that average</strong> to all other submissions, which
            resulted in a final score of{" "}
            <strong>
              {formatTwoDecimals(data.submission.z_avg_similarity_score)}
            </strong>
            .
          </p>
          <div className="space-y-4 animate-fadeDown">
            {data.scores.map((score, index) => (
              <ComparisonItem key={index + 1} score={score} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const ComparisonItem = ({ score }: { score: SubmissionScore }) => {
  return (
    <div className="flex bg-white overflow-hidden h-24 border border-black">
      <div className="flex items-center w-24 h-24 flex-shrink-0">
        <img
          src={score.base_comparisons.image_url}
          alt="Chalamet comparison"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow relative">
        <div
          className="absolute inset-y-0 left-0 bg-black"
          style={{ width: `${score.normalized_score}%` }}
        />

        <div className="absolute inset-0 flex items-center px-4 z-10">
          <p className="text-black text-sm font-medium">
            {score.base_comparisons.name}
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <span className="text-xl md:text-2xl font-bold text-black">
            {formatTwoDecimals(score.normalized_score)}
          </span>
        </div>
      </div>
    </div>
  );
};
