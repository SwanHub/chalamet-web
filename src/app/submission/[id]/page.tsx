"use client";

import { use } from "react";
import { ChalametScoreResults } from "@/app/_components/ChalametCard";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <ChalametScoreResults id={resolvedParams.id} />
    </div>
  );
}
