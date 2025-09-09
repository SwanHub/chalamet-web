"use client";

import React from "react";
import { Header } from "./_components/Header";
import MediaToggle from "./_components/MediaToggle";
import Header_Banner from "./_components/Header_Banner";

export default function Home() {
  return (
    <div className="relative">
      <div className="relative">
        <div className="flex flex-col w-full px-2 sm:px-2 h-full items-center">
          <Header_Banner />
          <Header />
          <MediaToggle />
        </div>
      </div>
    </div>
  );
}
