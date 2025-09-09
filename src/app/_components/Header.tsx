"use client";

import { SubmitProcess2 } from "./StepwiseSubmission";

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
    <div className="flex flex-col h-full w-full justify-center items-center">
      <SubmitProcess2
        activeSubmissionId={activeSubmissionId}
        setActiveSubmissionId={setActiveSubmissionId}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};
