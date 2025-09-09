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

  return (
    <div className="w-full flex flex-col items-center">
      <div className="flex justify-center gap-4 pb-6">
        <button onClick={() => setFilter("leaderboard")} className={"text-3xl"}>
          Top submissions
        </button>
      </div>

      <div className="max-w-124 w-full">
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
