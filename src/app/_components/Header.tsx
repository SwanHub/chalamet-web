"use client";

import Header_Title from "./Header_Title";
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
    <div className="py-16 flex justify-between h-full">
      <Header_Title />
      <SubmitProcess2
        newSubId={activeSubmissionId}
        setNewSubId={setActiveSubmissionId}
        setModalOpen={setModalOpen}
      />
    </div>
  );
};
