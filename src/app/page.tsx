import React from "react";
import MediaToggle from "./_components/MediaToggle";
import SubmitHere from "./_components/SubmitHere";

export default function Home() {
  return (
    <div className="relative">
      <div className="relative">
        <div className="flex flex-col w-full px-2 sm:px-2 h-full items-center">
          <SubmitHere />
          <MediaToggle />
        </div>
      </div>
    </div>
  );
}
