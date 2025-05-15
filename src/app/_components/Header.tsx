"use client";

import Link from "next/link";
import { useState } from "react";
import { Modal_Submit } from "./Modal_Submit";
import { Button_GenericWithIcon } from "@/components/shared/Button_GenericWithIcon";
import { CameraIcon } from "lucide-react";
import Header_Title from "./Header_Title";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="py-16 flex justify-between h-full">
      <Header_Title />
      <Button_Submit setIsOpen={setIsOpen} />
      <Modal_Submit isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
};

const Title = () => {
  const article =
    "https://www.nytimes.com/2024/10/28/nyregion/timothee-chalamet-lookalike-contest-new-york.html";
  return (
    <div className="max-w-xl text-white pb-6 w-full flex flex-col flex-grow">
      <span className="text-6xl flex flex-col gap-4 pb-16">
        <h1 className="font-bold">
          Compete in the Internet Official Timothée Chalamet Lookalike Contest
        </h1>
      </span>

      <span className="text-lg opacity-80">
        Did you miss the iconic{" "}
        <Link
          href={article}
          target="_blank"
          className="font-medium text-blue-200"
        >
          Timothée Chalamet Lookalike Contest
        </Link>{" "}
        in Washington Square Park?{" "}
        <strong>Here's your chance to compete.</strong>
      </span>
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
