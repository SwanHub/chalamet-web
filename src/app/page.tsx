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
    <div className="relative min-h-screen bg-white">
      <div className="relative min-h-screen">
        <div className="flex flex-col w-full px-4 sm:px-8 h-full min-h-screen items-center">
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
