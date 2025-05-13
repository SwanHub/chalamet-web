import Link from "next/link";
import React from "react";
import { Leaderboard } from "./_components/Leaderboard";
import { Button_Generic } from "@/components/shared/Button_Generic";

export default function Home() {
  const article =
    "https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html";
  return (
    <div
      className="relative min-h-screen bg-cover bg-center p-12"
      style={{
        backgroundImage: "url('/banners/washington-square-park.png')",
      }}
    >
      <div className="flex w-full justify-between bg-gray-900/80 px-8 ">
        <div className="py-16 h-full">
          <div className="max-w-xl text-white pb-24">
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
          <Button_Generic label="Submit" />
        </div>

        <div className="max-w-3xl py-16 h-full w-full">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
