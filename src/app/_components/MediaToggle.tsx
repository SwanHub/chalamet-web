"use client";

import { useState } from "react";
import { RecentSubmissions } from "./RecentSubmissions";
import { TopSubmissions } from "./Leaderboard";

type View = "top" | "recent";
type TimePeriod = "weekly" | "all-time";

export default function MediaToggle() {
  const [filter, setFilter] = useState<View>("top");
  const [timePeriod, setTimePeriod] = useState<TimePeriod>("all-time");

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-between items-center gap-4 pb-6 w-full">
        <div
          className={`flex items-center gap-4 hover:cursor-pointer ${
            filter === "top" ? "opacity-100" : "opacity-50"
          }`}
        >
          <button
            onClick={() => setFilter("top")}
            className={`text-xl ${filter === "top" ? "font-bold" : ""}`}
          >
            Top
          </button>
          {filter === "top" && (
            <select
              value={timePeriod}
              onChange={(e) => setTimePeriod(e.target.value as TimePeriod)}
              className="text-xs bg-transparent border border-gray-300 rounded px-2 py-1 mx-2"
            >
              <option value="weekly">This week</option>
              <option value="all-time">All-time</option>
            </select>
          )}
        </div>

        <button
          onClick={() => setFilter("recent")}
          className={`text-xl cursor-pointer ${
            filter === "recent" ? "font-bold" : "opacity-50"
          }`}
        >
          Recent
        </button>
      </div>

      <div className="max-w-124 w-full">
        {filter === "top" && <TopSubmissions timePeriod={timePeriod} />}
        {filter === "recent" && <RecentSubmissions />}
      </div>
    </div>
  );
}
