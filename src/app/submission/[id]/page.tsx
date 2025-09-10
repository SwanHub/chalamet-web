"use client";

import { use } from "react";
import { ChalametScoreResults } from "@/app/submission/[id]/_components/ChalametCard";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return <ChalametScoreResults id={resolvedParams.id} />;
}
