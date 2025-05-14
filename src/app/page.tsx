import React from "react";
import { Leaderboard } from "./_components/Leaderboard";
import { Header } from "./_components/Header";

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center p-12"
      style={{
        backgroundImage: "url('/banners/washington-square-park.png')",
      }}
    >
      <div className="flex w-full justify-between bg-gray-900/80 px-8 h-full">
        <Header />
        <div className="max-w-3xl py-16 h-full w-full">
          <Leaderboard />
        </div>
      </div>
    </div>
  );
}
