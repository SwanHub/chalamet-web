import React from "react";
import { Header } from "./_components/Header";
import MediaToggle from "./_components/MediaToggle";

export default function Home() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed p-12"
      style={{
        backgroundImage: "url('/banners/washington-square-park.png')",
      }}
    >
      <div className="flex flex-col w-full justify-between bg-gray-900/90 px-8 h-full">
        <Header />
        <MediaToggle />
      </div>
    </div>
  );
}
