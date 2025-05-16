"use client";

import { useState } from "react";
import Header_Title from "./Header_Title";
import { SubmitProcess2 } from "./StepwiseSubmission";
import { Modal_Results } from "./Modal_Results";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSubId, setNewSubId] = useState<string | null>(null);

  return (
    <div className="py-16 flex justify-between h-full">
      <Header_Title />
      <SubmitProcess2
        newSubId={newSubId}
        setNewSubId={setNewSubId}
        setModalOpen={setIsOpen}
      />
      {newSubId && (
        <Modal_Results
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          activeSubmissionId={newSubId}
        />
      )}
    </div>
  );
};
