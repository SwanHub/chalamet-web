"use client";

import React, { useEffect, useState } from "react";
import { Header } from "./_components/Header";
import MediaToggle from "./_components/MediaToggle";
import { Modal_Results } from "./_components/Modal_Results";

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
    null
  );

  function onClickGalleryItem(id: string) {
    console.log("id: ", id);
    setActiveSubmissionId(id);
    // setModalIsOpen(true);
  }

  useEffect(() => {
    if (activeSubmissionId) {
      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  }, [activeSubmissionId]);

  return (
    <div
      className="relative min-h-screen bg-cover bg-center bg-fixed p-12"
      style={{
        backgroundImage: "url('/banners/washington-square-park.png')",
      }}
    >
      <div className="flex flex-col w-full justify-between bg-gray-900/90 px-8 h-full">
        {/* <Header /> */}
        <MediaToggle onClickItem={onClickGalleryItem} />
        <Modal_Results
          isOpen={true}
          onClose={() => setModalIsOpen(false)}
          activeSubmissionId={activeSubmissionId}
        />
      </div>
      {/* {activeSubmissionId && (
      )} */}
    </div>
  );
}
