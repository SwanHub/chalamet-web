"use client";

import React, { useEffect, useState } from "react";
import { Header } from "./_components/Header";
import MediaToggle from "./_components/MediaToggle";
import { Modal_Results } from "./_components/Modal_Results";
import { BG_IMAGES } from "./constants";
import { PoweredBy } from "./_components/PoweredBy";

export default function Home() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [activeSubmissionId, setActiveSubmissionId] = useState<string | null>(
    null
  );
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setCurrentBgIndex((prevIndex) => (prevIndex + 1) % BG_IMAGES.length);
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [BG_IMAGES.length]);

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
    <div className="relative min-h-screen bg-gray-900">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `url(${BG_IMAGES[currentBgIndex]})`,
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 1s ease-in-out",
        }}
      />

      <div className="relative min-h-screen">
        <div className="flex flex-col w-full bg-gray-900/80 px-4 sm:px-8 h-full min-h-screen items-center">
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
          <PoweredBy />
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
