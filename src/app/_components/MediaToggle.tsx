"use client";

import { useState } from "react";
import { SubmissionGallery } from "./Gallery";
import { Leaderboard } from "./Leaderboard";

type View = "leaderboard" | "gallery" | "privacy" | "faq";

export default function MediaToggle() {
  const [filter, setFilter] = useState<View>("leaderboard");

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center gap-4 pb-6">
        <button onClick={() => setFilter("leaderboard")} className={"text-3xl"}>
          Top submissions
        </button>
      </div>

      <div className="max-w-124 w-full">
        {filter === "leaderboard" && <Leaderboard />}
        {filter === "gallery" && <SubmissionGallery />}
      </div>
    </div>
  );
}
