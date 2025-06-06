"use client";

import { useState } from "react";
import { SubmissionGallery } from "./Gallery";
import { Leaderboard } from "./Leaderboard";
import { PrivacyPolicy } from "./PrivacyPolicy";
import { FAQ } from "./FAQ";

type View = "leaderboard" | "gallery" | "privacy" | "faq";

interface Props {
  onClickItem: (id: string) => void;
  setModalOpen: (val: boolean) => void;
  setActiveSubmissionId: (id: string | null) => void;
  activeSubmissionId: string | null;
}

export default function MediaToggle({ onClickItem }: Props) {
  const [filter, setFilter] = useState<View>("leaderboard");

  const buttonStyle = (active: boolean) =>
    `px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-200 
    focus:outline-none focus:ring-2 focus:ring-cyan-400 cursor-pointer
    shadow-md hover:shadow-lg whitespace-nowrap ${
      active
        ? "bg-cyan-500 text-white"
        : "bg-gray-800 text-gray-300 hover:bg-gray-700"
    }`;

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center gap-4 pb-6">
        <button
          onClick={() => setFilter("leaderboard")}
          className={buttonStyle(filter === "leaderboard")}
        >
          Top 25
        </button>
        <button
          onClick={() => setFilter("gallery")}
          className={buttonStyle(filter === "gallery")}
        >
          Recent
        </button>

        <button
          onClick={() => setFilter("faq")}
          className={buttonStyle(filter === "faq")}
        >
          FAQ
        </button>
        <button
          onClick={() => setFilter("privacy")}
          className={buttonStyle(filter === "privacy")}
        >
          Privacy
        </button>
      </div>

      <div className="max-w-screen-sm w-full">
        {filter === "leaderboard" && <Leaderboard onClickItem={onClickItem} />}
        {filter === "gallery" && (
          <SubmissionGallery onClickItem={onClickItem} />
        )}
        {filter === "faq" && <FAQ />}
        {filter === "privacy" && <PrivacyPolicy />}
      </div>
    </div>
  );
}
