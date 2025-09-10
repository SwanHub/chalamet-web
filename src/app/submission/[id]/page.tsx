"use client";

import { use } from "react";
import { fetchSubmissionResults } from "@/lib/api/submit";
import useSWR from "swr";
import { SubmissionResults } from "@/app/types";
import { SquareLoader } from "react-spinners";
import { ResultsSummary } from "./_components/ResultsSummary";
import { Comparison } from "./_components/Comparison";
import { ShareButtons } from "./_components/ShareButtons";
import { Dopplegangers } from "./_components/Dopplegangers";
import { Report } from "./_components/Report";
import { Calculations } from "./_components/Calculations";

export default function SubmissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const hydrate = () => fetchSubmissionResults(resolvedParams.id);
  const { data, error, isLoading } = useSWR<SubmissionResults>(
    `submission-${resolvedParams.id}`,
    hydrate,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    }
  );

  if (isLoading) return <Skeleton />;
  if (error) return <p className="text-black">Error</p>;
  if (!data) return <p className="text-black">No data error</p>;

  return (
    <div className="flex w-full items-center justify-center overflow-auto pb-12">
      <div className="flex flex-col text-black max-w-screen-md w-full gap-6">
        <ResultsSummary data={data} />
        <Comparison data={data} />
        <ShareButtons submissionId={data.submission.id} />
        <Report data={data} />
        <Dopplegangers
          id={data.submission.id}
          name={data.submission.name ?? "Your"}
        />
        <Calculations data={data} />
      </div>
    </div>
  );
}

const Skeleton = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full h-full min-h-screen">
      <SquareLoader color="black" size={12} />
    </div>
  );
};
