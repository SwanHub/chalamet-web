"use client";

import { useEffect } from "react";
import { ChalametScoreResults } from "./ChalametCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeSubmissionId: string | null;
}

export const Modal_Results = ({
  isOpen,
  onClose,
  activeSubmissionId,
}: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen || !activeSubmissionId) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900
    bg-opacity-70 transition-opacity overflow-y-auto"
    >
      <div className="max-h-screen h-full overflow-y-auto w-full pt-12 p-4">
        <Button_Close onClose={onClose} />
        <ChalametScoreResults id={activeSubmissionId} />
      </div>
    </div>
  );
};

const Button_Close = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-8 z-20 right-8 text-gray-300 hover:text-gray-200 cursor-pointer h-12 w-12 aspect-square rounded-full bg-black hover:bg-gray-700"
    >
      ✕
    </button>
  );
};
