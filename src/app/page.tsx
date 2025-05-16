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
  const backgroundImages = [
    "https://m.media-amazon.com/images/M/MV5BZTIyZWY4ZjktOGJiZi00NGFkLTllMjctZjJjMmNiMjIxOTY2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    "https://m.media-amazon.com/images/M/MV5BYjUxNDRmOGEtMDc3OC00MjNiLWE3ZjMtN2FiOGNjYzNmYzUyXkEyXkFqcGc@._V1_QL75_UX804_.jpg",
    "https://m.media-amazon.com/images/M/MV5BZjJhYzVjNzctMjkwOC00N2Q5LWEwMDktNGE2OTRlMDQ5OGEzXkEyXkFqcGc@._V1_QL75_UX1640_.jpg",
    "https://m.media-amazon.com/images/M/MV5BNmQ2MjhhOGQtMjEwYi00Y2NiLWEyMWUtODJkZWM3MjliMTUyXkEyXkFqcGc@._V1_QL75_UX1616_.jpg",
  ];
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsTransitioning(true);
      const timeout = setTimeout(() => {
        setCurrentBgIndex(
          (prevIndex) => (prevIndex + 1) % backgroundImages.length
        );
        setIsTransitioning(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

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
          backgroundImage: `url(${backgroundImages[currentBgIndex]})`,
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 1s ease-in-out",
        }}
      />

      <div className="relative min-h-screen">
        <div className="flex flex-col w-full bg-gray-900/90 px-8 h-full min-h-screen items-center">
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
