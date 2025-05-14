"use client";

import { useState } from "react";
import { SubmissionGallery } from "./Gallery";
import { Leaderboard } from "./Leaderboard";

export default function MediaToggle() {
  const [filter, setFilter] = useState<"leaderboard" | "gallery">(
    "leaderboard"
  );

  return (
    <div className="">
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setFilter("leaderboard")}
            className={`px-5 py-2.5 rounded-full text-base font-semibold transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer
      shadow-md hover:shadow-lg
      ${
        filter === "leaderboard"
          ? "bg-cyan-500 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
          >
            Global Leaderboard
          </button>

          <button
            onClick={() => setFilter("gallery")}
            className={`px-5 py-2.5 rounded-full text-base font-semibold transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer
      shadow-md hover:shadow-lg
      ${
        filter === "gallery"
          ? "bg-cyan-500 text-white"
          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
      }`}
          >
            Recent
          </button>
        </div>
      </div>
      {filter === "leaderboard" ? <Leaderboard /> : <SubmissionGallery />}
    </div>
  );
}
