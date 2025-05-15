"use client";

import { useState } from "react";
import { SubmissionGallery } from "./Gallery";
import { Leaderboard } from "./Leaderboard";
import { HowItWorks } from "./HowItWorks";

type View = "leaderboard" | "gallery" | "how";

export default function MediaToggle() {
  const [filter, setFilter] = useState<View>("leaderboard");

  const buttonStyle = (active: boolean) =>
    `px-5 py-2.5 rounded-full text-base font-semibold transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer
    shadow-md hover:shadow-lg ${
      active
        ? "bg-cyan-500 text-white"
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setFilter("leaderboard")}
          className={buttonStyle(filter === "leaderboard")}
        >
          Global Leaderboard
        </button>

        <button
          onClick={() => setFilter("gallery")}
          className={buttonStyle(filter === "gallery")}
        >
          Recent
        </button>

        <button
          onClick={() => setFilter("how")}
          className={buttonStyle(filter === "how")}
        >
          How it works
        </button>
      </div>

      {/* Active View */}
      <div className="max-w-screen-md w-full">
        {filter === "leaderboard" && <Leaderboard />}
        {filter === "gallery" && <SubmissionGallery />}
        {filter === "how" && <HowItWorks />}
      </div>
    </div>
  );
}
