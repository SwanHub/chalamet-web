"use client";

import { use } from "react";
import { ChalametScoreResults } from "@/app/_components/ChalametCard";
import Link from "next/link";
import { Home } from "lucide-react";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);

  return (
    <div className="p-8 bg-gray-900 min-h-screen">
      <Link href="/" className="flex justify-center pb-4">
        <Home color="white" size={24} />
      </Link>
      <ChalametScoreResults id={resolvedParams.id} />
    </div>
  );
}
