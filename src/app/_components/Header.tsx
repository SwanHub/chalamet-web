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
    <div className="py-16 flex flex-col h-full w-full max-w-screen-md">
      <Header_Title />
      <div className="justify-center items-center flex">
        <SubmitProcess2
          newSubId={activeSubmissionId}
          setNewSubId={setActiveSubmissionId}
          setModalOpen={setModalOpen}
        />
      </div>
    </div>
  );
};
