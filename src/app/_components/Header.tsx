"use client";

import { useState } from "react";
import { Modal_Submit } from "./Modal_Submit";
import { Button_GenericWithIcon } from "@/components/shared/Button_GenericWithIcon";
import { CameraIcon } from "lucide-react";
import Header_Title from "./Header_Title";
import { SubmitProcess2 } from "./StepwiseSubmission";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-16 flex justify-between h-full">
      <Header_Title />
      <SubmitProcess2 />
      {/* <Button_Submit setIsOpen={setIsOpen} /> */}
      {/* <Modal_Submit isOpen={isOpen} onClose={() => setIsOpen(false)} /> */}
    </div>
  );
};

const Button_Submit = ({ setIsOpen }: { setIsOpen: (b: boolean) => void }) => {
  return (
    <div
      className="flex rounded-lg w-full bg-gray-900/80 hover:bg-gray-900 aspect-square
      max-w-sm
        transition-all border-2 border-dashed hover:border-solid border-cyan-500
        py-32 justify-center items-center cursor-pointer"
    >
      <Button_GenericWithIcon
        label=""
        onClick={() => setIsOpen(true)}
        icon={<CameraIcon />}
      />
    </div>
  );
};
