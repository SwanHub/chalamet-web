"use client";

import Link from "next/link";
import Header_Title from "./Header_Title";
import { SubmitProcess2 } from "./StepwiseSubmission";
import { NYT_ARTICLE } from "../constants";

interface Props {
  setModalOpen: (val: boolean) => void;
  setActiveSubmissionId: (id: string | null) => void;
  activeSubmissionId: string | null;
}

export const Header = ({
  activeSubmissionId,
  setActiveSubmissionId,
  setModalOpen,
}: Props) => {
  return (
    <div className="py-16 flex flex-col h-full w-full max-w-screen-sm">
      <Header_Title />
      <div className="justify-center items-center flex pb-6">
        <SubmitProcess2
          activeSubmissionId={activeSubmissionId}
          setActiveSubmissionId={setActiveSubmissionId}
          setModalOpen={setModalOpen}
        />
      </div>
      <div className="text-sm text-white flex justify-center items-center">
        <span className="inline sm:block pb-2">
          Inspired by{" "}
          <Link
            href={NYT_ARTICLE}
            target="_blank"
            className="font-medium text-cyan-500 underline underline-offset-2"
          >
            the original
          </Link>{" "}
          in-person contest in NYC.{" "}
        </span>
      </div>
    </div>
  );
};
