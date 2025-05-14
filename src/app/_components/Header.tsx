"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal_Submit } from "./Modal_Submit";
import { Button_GenericWithIcon } from "@/components/shared/Button_GenericWithIcon";
import { CameraIcon } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="py-16 h-full">
      <Title />
      <div
        className="flex w-full bg-gray-900/80 hover:bg-gray-900 transition-all border-2 border-dashed hover:border-solid border-cyan-500
      py-32 justify-center items-center cursor-pointer"
      >
        <Button_GenericWithIcon
          label="Create submission"
          onClick={() => setIsOpen(true)}
          icon={<CameraIcon />}
        />
      </div>
      <Modal_Submit isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const Title = () => {
  const article =
    "https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html";
  return (
    <div className="max-w-xl text-white pb-6">
      <span className="text-6xl flex flex-col gap-4 pb-16">
        <h1 className="font-bold">Chalamet</h1>
        <h1 className="font-bold">Lookalike</h1>
        <div className="h-1 border-b w-48 pt-4" />
        <h1 className="text-4xl font-medium">Global Leaderboard</h1>
      </span>

      <span className="text-lg opacity-80">
        Did you miss the iconic{" "}
        <Link
          href={article}
          target="_blank"
          className="font-medium text-blue-200"
        >
          Timothée Chalamet Lookalike Contest
        </Link>{" "}
        in Washington Square Park, circa Summer '24? Here's your chance to
        compete.
      </span>
    </div>
  );
};
