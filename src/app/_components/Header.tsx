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
    <div className="py-16 flex flex-col h-full w-full max-w-screen-sm">
      <Header_Title />
      <div className="justify-center items-center flex pb-6">
        <SubmitProcess2
          activeSubmissionId={activeSubmissionId}
          setActiveSubmissionId={setActiveSubmissionId}
          setModalOpen={setModalOpen}
        />
      </div>
    </div>
  );
};
