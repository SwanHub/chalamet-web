import { SocialShareButton } from "@/components/shared/SocialShareButton";
import { SubmissionResults, SubmissionScore } from "../types";
import { formatTwoDecimals } from "@/lib/utils";
import { fetchSubmissionResults } from "../../lib/api/submit";
import useSWR from "swr";
import { GridLoader } from "react-spinners";
import { supabase } from "@/lib/supabase";
import { Flag, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { getResultMessage } from "../constants";

interface Props {
  id: string;
}

export const ChalametScoreResults = ({ id }: Props) => {
  const [showAllComparisons, setShowAllComparisons] = useState(false);
  const hydrate = () => fetchSubmissionResults(id);
  const { data, error, isLoading } = useSWR<SubmissionResults>(
    `submission-results-${id}`,
    hydrate,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  const handleReport = async () => {
    if (!data) return;

    try {
      const { error } = await supabase
        .from("submissions")
        .update({ report_status: "reported" })
        .eq("id", data.submission.id);

      if (error) throw error;

      alert("Successfully reported submission");
    } catch (error) {
      console.error("Error reporting submission:", error);
      alert("Failed to report submission");
    }
  };

  async function handleDelete() {
    if (!data) return;

    try {
      const fileName = data.submission.image_url.split("/").pop();
      const { error: storageError } = await supabase.storage
        .from("submissions")
        .remove([`${fileName}`]);
      if (storageError) throw storageError;

      const { error: submissionError } = await supabase
        .from("submissions")
        .delete()
        .eq("id", data.submission.id);
      if (submissionError) throw submissionError;

      const { error: scoresError } = await supabase
        .from("submission_scores")
        .delete()
        .eq("submission_id", data.submission.id);
      if (scoresError) throw scoresError;

      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting submission:", error);
    }
  }

  if (isLoading) return <Skeleton />;
  if (error) return <p className="text-white">Error</p>;
  if (!data) return <p className="text-white">No data error</p>;

  return (
    <div className="flex w-full items-center justify-center animate-fade-in overflow-auto pb-12">
      <div className="flex flex-col text-white max-w-screen-md w-full rounded-2xl overflow-hidden gap-6">
        <div className="flex flex-col items-center gap-4 sm:gap-4 pt-4 sm:pt-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600 px-4">
              The results are in... you ranked:
            </h1>
            <span className="text-lg sm:text-xl font-bold text-white px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 border border-yellow-400 shadow-lg">
              #{data.rank} out of {data.totalSubmissions}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-center text-white px-4">
            {getResultMessage(data.rank, data.totalSubmissions)}
          </h1>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          <ImageComponent title="You" imageUrl={data.submission.image_url} />
          <ImageComponent
            title={"Chalamet"}
            imageUrl={data.scores[0].base_comparisons.image_url}
          />
          <div className="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="bg-white text-center px-3 sm:px-6 py-1 sm:py-3 rounded-full shadow-lg border-2 border-gray-100">
              <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {formatTwoDecimals(data.submission.highest_normalized_score)}
              </span>
              <span className="text-lg text-cyan-700 font-medium ml-1">
                similar
              </span>
            </div>
          </div>
        </div>

        <div className="gap-2">
          <div className="flex justify-between gap-3">
            <SocialShareButton
              platform="twitter"
              submissionId={data.submission.id}
            />
            <SocialShareButton
              platform="linkedin"
              submissionId={data.submission.id}
            />
          </div>
        </div>
        <Link
          href={`/submission/${data.submission.id}`}
          className="text-center px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          {"See who else you look like 🔍"}
        </Link>

        <div className="pb-6">
          <div className="space-y-4">
            {showAllComparisons && (
              <>
                <p>
                  We compared your screenshot to 10 different Chalamet looks.
                </p>
                <div className="space-y-4 animate-fadeDown">
                  {data.scores.map((score, index) => (
                    <ComparisonItem key={index + 1} score={score} />
                  ))}
                </div>
                <p>
                  Then averaged the scores and compared{" "}
                  <strong>that average</strong> to all other submissions.
                </p>
              </>
            )}

            <button
              onClick={() => setShowAllComparisons(!showAllComparisons)}
              className="w-full cursor-pointer mt-2 py-2 px-4 text-sm text-gray-400 hover:text-gray-300 transition-colors flex items-center justify-center gap-1 rounded-lg hover:bg-gray-800/50"
            >
              {showAllComparisons ? (
                <>
                  Show less <ChevronUp className="w-4 h-4" />
                </>
              ) : (
                <>
                  See the calculations <ChevronDown className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

        <button
          onClick={handleReport}
          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer self-center text-center items-center justify-center"
          title="Report submission"
        >
          <Flag className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer self-center text-center items-center justify-center"
          title="Report submission"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

const ImageComponent = ({
  title,
  imageUrl,
}: {
  title: string;
  imageUrl: string;
}) => {
  return (
    <div className="flex flex-col w-full max-w-md">
      <div className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-center py-4 px-2 rounded-t-2xl">
        <p className="text-sm uppercase text-white font-medium">{title}</p>
      </div>
      <div className="relative w-full">
        <div className="aspect-square w-full">
          <img
            src={imageUrl}
            className="w-full h-full object-cover rounded-b-2xl"
          />
        </div>
      </div>
    </div>
  );
};

const ComparisonItem = ({ score }: { score: SubmissionScore }) => {
  return (
    <div className="flex bg-gray-800 overflow-hidden h-24 rounded-xl">
      <div className="flex items-center w-24 h-24 flex-shrink-0">
        <img
          src={score.base_comparisons.image_url}
          alt="Chalamet comparison"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow relative">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ width: `${score.normalized_score}%` }}
        />

        <div className="absolute inset-0 flex items-center px-4 z-10">
          <p className="text-white text-sm font-medium">
            {score.base_comparisons.name}
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <span className="text-xl md:text-2xl font-bold text-white">
            {formatTwoDecimals(score.normalized_score)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <GridLoader color="cyan" size={12} />
    </div>
  );
};
