"use client";

import { SubmissionResults } from "@/app/types";
import Link from "next/link";

interface Props {
  data: SubmissionResults;
}

export const Calculations = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-4 pt-24">
      <h2 className="text-3xl text-black self-center text-center">
        How it works
      </h2>
      <p className="text-sm text-black self-center">
        We use{" "}
        <Link
          href="https://openai.com/index/clip/"
          target="_blank"
          className="underline"
        >
          OpenAI CLIP
        </Link>{" "}
        to compare the submission image with the average of 10 random chalamet
        images.
      </p>
      <p className="text-sm text-black self-center">
        Here is the image in that small dataset of 10 images you look MOST
        similar to:
      </p>
      <img
        src={data.scores[0].base_comparisons.image_url}
        alt="Chalamet comparison"
        className="w-24 h-24 object-cover"
      />
      <p className="text-sm text-black">Here are the other images:</p>
      <div className="flex flex-wrap gap-2">
        {data.scores.slice(1).map((score) => (
          <img
            key={score.id}
            src={score.base_comparisons.image_url}
            alt="Chalamet comparison"
            className="w-6 h-6 object-cover"
          />
        ))}
      </div>
    </div>
  );
};
