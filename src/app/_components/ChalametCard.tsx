import { SocialShareButton } from "@/components/shared/SocialShareButton";
import { Submission, SubmissionResults, SubmissionScore } from "../types";
import { formatTwoDecimals } from "@/lib/utils";
import { fetchSubmissionResults } from "../../lib/api/submit";
import useSWR from "swr";
import { GridLoader } from "react-spinners";
import { supabase } from "@/lib/supabase";
import { Flag, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";
import { useRouter } from "next/navigation";

interface Props {
  id: string;
}

export const ChalametScoreResults = ({ id }: Props) => {
  const [showAllComparisons, setShowAllComparisons] = useState(false);
  const [showDoppelgangers, setShowDoppelgangers] = useState(false);
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

  // async function handleDelete() {
  //   if (!data) return;

  //   try {
  //     const fileName = data.submission.image_url.split("/").pop();
  //     const { error: storageError } = await supabase.storage
  //       .from("submissions")
  //       .remove([`${fileName}`]);
  //     if (storageError) throw storageError;

  //     const { error: submissionError } = await supabase
  //       .from("submissions")
  //       .delete()
  //       .eq("id", data.submission.id);
  //     if (submissionError) throw submissionError;

  //     const { error: scoresError } = await supabase
  //       .from("submission_scores")
  //       .delete()
  //       .eq("submission_id", data.submission.id);
  //     if (scoresError) throw scoresError;

  //     window.location.href = "/";
  //   } catch (error) {
  //     console.error("Error deleting submission:", error);
  //   }
  // }

  if (isLoading) return <Skeleton />;
  if (error) return <p className="text-white">Error</p>;
  if (!data) return <p className="text-white">No data error</p>;

  return (
    <div className="flex w-full items-center justify-center animate-fade-in overflow-auto pb-12">
      <div className="flex flex-col text-white max-w-screen-md w-full rounded-2xl overflow-hidden gap-6">
        <div className="flex flex-col items-center gap-4 sm:gap-4 pt-4 sm:pt-8">
          <div className="flex items-center justify-center">
            <h1 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
              Ranking:
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-yellow-500 via-yellow-400 to-yellow-500 border border-yellow-400 shadow-lg text-white mx-2">
                #{data.rank}
                <span className="text-sm ml-1">/{data.totalSubmissions}</span>
              </span>
              in overall Chalamet-ness.
            </h1>
          </div>
        </div>
        <div className="relative grid grid-cols-2 gap-4">
          <ImageComponent
            title={`Submission #${data.submission.created_order}`}
            imageUrl={data.submission.image_url}
          />
          <ImageComponent
            title={"Chalamet"}
            imageUrl={data.scores[0].base_comparisons.image_url}
          />
          <div className="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-2">
            <div className="bg-white text-center px-3 sm:px-6 py-1 sm:py-3 rounded-full shadow-lg border-2 border-gray-100">
              <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {formatTwoDecimals(data.submission.z_avg_similarity_score)}
              </span>
              <span className="text-lg text-cyan-700 font-medium ml-1">
                similar
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col w-full gap-3">
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
          <div className="flex justify-center w-full">
            <SocialShareButton
              platform="copy"
              submissionId={data.submission.id}
            />
          </div>
        </div>

        <div>
          <button
            onClick={() => setShowAllComparisons(!showAllComparisons)}
            className="w-full cursor-pointer mt-2 py-2 px-4 text-sm text-gray-200 hover:text-gray-300 transition-colors flex items-center justify-center gap-1 rounded-lg bg-gray-800/30 hover:bg-gray-800/50"
          >
            {showAllComparisons ? (
              <>
                Hide calculations <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                See Chalamet calculations <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {showAllComparisons && (
            <div className="space-y-4 py-4">
              <p className="text-sm">
                We compared your screenshot to 10 unique Chalamet looks. The
                percentage on the right is your similarity score to that version
                of Timmy. We then averaged the scores and compared{" "}
                <strong>that average</strong> to all other submissions, which
                resulted in a final score of{" "}
                <strong>
                  {formatTwoDecimals(data.submission.z_avg_similarity_score)}
                </strong>
                .
              </p>
              <div className="space-y-4 animate-fadeDown">
                {data.scores.map((score, index) => (
                  <ComparisonItem key={index + 1} score={score} />
                ))}
              </div>
            </div>
          )}
          <button
            onClick={() => setShowDoppelgangers(!showDoppelgangers)}
            className="w-full cursor-pointer mt-2 py-2 px-4 text-sm text-gray-200 hover:text-gray-300 transition-colors flex items-center justify-center gap-1 rounded-lg bg-gray-800/30 hover:bg-gray-800/50"
          >
            {showDoppelgangers ? (
              <>
                Hide similar submissions <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                See similar submissions <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>

          {showDoppelgangers && (
            <Gallery_Doppleganger id={data.submission.id} />
          )}
        </div>

        <button
          onClick={handleReport}
          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer self-center text-center items-center justify-center"
          title="Report submission"
        >
          <Flag className="w-4 h-4" />
        </button>
        {/* <button
          onClick={handleDelete}
          className="text-gray-400 hover:text-red-400 transition-colors cursor-pointer self-center text-center items-center justify-center"
          title="Report submission"
        >
          Delete
        </button> */}
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

const Gallery_Doppleganger = ({ id }: { id: string }) => {
  const router = useRouter();

  async function hydrateSimilarSubmissions() {
    const { data } = await supabase.rpc("find_similar_submissions", {
      target_id: id,
      match_count: 6,
    });
    return data;
  }

  const { data, error } = useSWR<Submission[]>(
    `similar-submissions-${id}`,
    hydrateSimilarSubmissions
  );

  if (error) {
    console.error("Error fetching similar submissions:", error);
    return <p className="text-white">Error fetching similar submissions</p>;
  }

  return (
    <div className="animate-fadeDown">
      <h2 className="text-sm text-white py-4 self-center text-center">
        Check out your dopplegangers...
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {data?.map((submission, index) => (
          <GalleryItem_Image
            key={submission.id}
            id={submission.id}
            imageUrl={submission.image_url}
            rank={index + 1}
            onClick={() => router.push(`/submission/${submission.id}`)}
          />
        ))}
      </div>
    </div>
  );
};
