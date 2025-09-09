"use client";

import React, { useEffect, useState } from "react";
import { Header } from "./_components/Header";
import MediaToggle from "./_components/MediaToggle";
import { Modal_Results } from "./_components/Modal_Results";
import Header_Banner from "./_components/Header_Banner";

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
    null
  );

  function onClickGalleryItem(id: string) {
    setActiveSubmissionId(id);
  }

  useEffect(() => {
    if (activeSubmissionId) {
      setModalIsOpen(true);
    } else {
      setModalIsOpen(false);
    }
  }, [activeSubmissionId]);

  return (
    <div className="relative">
      <div className="relative">
        <div className="flex flex-col w-full px-2 sm:px-2 h-full items-center">
          <Header_Banner />
          <Header
            setModalOpen={setModalIsOpen}
            setActiveSubmissionId={setActiveSubmissionId}
            activeSubmissionId={activeSubmissionId}
          />
          <MediaToggle
            onClickItem={onClickGalleryItem}
            setModalOpen={setModalIsOpen}
            setActiveSubmissionId={setActiveSubmissionId}
            activeSubmissionId={activeSubmissionId}
          />
          <Modal_Results
            isOpen={modalIsOpen}
            onClose={() => setActiveSubmissionId(null)}
            activeSubmissionId={activeSubmissionId}
          />
        </div>
      </div>
    </div>
  );
}
