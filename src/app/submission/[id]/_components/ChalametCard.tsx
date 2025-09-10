import { ShareButtons } from "@/app/submission/[id]/_components/ShareButtons";
import { Submission, SubmissionResults, SubmissionScore } from "../../../types";
import { formatTwoDecimals } from "@/lib/utils";
import { fetchSubmissionResults } from "../../../../lib/api/submit";
import useSWR from "swr";
import { SquareLoader } from "react-spinners";
import { supabase } from "@/lib/supabase";
import { Flag } from "lucide-react";
import { useState } from "react";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";

interface Props {
  id: string;
}

export const ChalametScoreResults = ({ id }: Props) => {
  const [showAllComparisons, setShowAllComparisons] = useState(false);
  const hydrate = () => fetchSubmissionResults(id);
  const { data, error, isLoading } = useSWR<SubmissionResults>(
    `submission-${id}`,
    hydrate,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
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

  if (isLoading) return <Skeleton />;
  if (error) return <p className="text-black">Error</p>;
  if (!data) return <p className="text-black">No data error</p>;

  return (
    <div className="flex w-full items-center justify-center overflow-auto pb-12">
      <div className="flex flex-col text-black max-w-screen-md w-full gap-6">
        <Summary data={data} />
        <div className="w-full self-center flex justify-between items-center gap-4">
          <ImageComponent
            title={`${data.submission.name ?? "SUBMISSION"}`}
            imageUrl={data.submission.image_url}
          />
          <p>vs.</p>
          <ImageComponent
            title={"Timothee Chalamet"}
            imageUrl={"/images/chalamet.jpg"}
          />
        </div>
        <ShareButtons submissionId={data.submission.id} />

        {/* <div>
          <button
            onClick={() => setShowAllComparisons(!showAllComparisons)}
            className="w-full cursor-pointer mt-2 py-2 px-4 text-sm flex items-center justify-center gap-1 border border-black text-black bg-white"
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
              <p className="text-sm text-black">
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
        </div> */}

        <Gallery_Doppleganger
          id={data.submission.id}
          name={data.submission.name ?? "Your"}
        />

        <button
          onClick={handleReport}
          className="text-black hover:text-red-600 transition-colors cursor-pointer self-center text-center items-center justify-center"
          title="Report submission"
        >
          <Flag className="w-4 h-4" />
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
      <div className="relative w-full">
        <div className="aspect-square w-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover border border-black border-t-0"
          />
        </div>
      </div>
      <div className="w-full bg-white text-center py-2 px-2 border border-black">
        <p className="text-sm uppercase text-black font-medium">{title}</p>
      </div>
    </div>
  );
};

const ComparisonItem = ({ score }: { score: SubmissionScore }) => {
  return (
    <div className="flex bg-white overflow-hidden h-24 border border-black">
      <div className="flex items-center w-24 h-24 flex-shrink-0">
        <img
          src={score.base_comparisons.image_url}
          alt="Chalamet comparison"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow relative">
        <div
          className="absolute inset-y-0 left-0 bg-black"
          style={{ width: `${score.normalized_score}%` }}
        />

        <div className="absolute inset-0 flex items-center px-4 z-10">
          <p className="text-black text-sm font-medium">
            {score.base_comparisons.name}
          </p>
        </div>

        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <span className="text-xl md:text-2xl font-bold text-black">
            {formatTwoDecimals(score.normalized_score)}
          </span>
        </div>
      </div>
    </div>
  );
};

const Summary = ({ data }: { data: SubmissionResults }) => {
  return (
    <div className="text-center space-y-2">
      <h2 className="text-lg sm:text-xl text-black">
        <strong>{data.submission.name ?? "SUBMISSION"}</strong>
      </h2>
      <h2 className="text-lg sm:text-xl text-black">
        All-time:{" "}
        <strong>
          #{data.rank} out of {data.totalSubmissions}
        </strong>
      </h2>
      <h2 className="text-lg sm:text-xl text-black">
        Similarity:{" "}
        <strong>
          {formatTwoDecimals(data.submission.z_avg_similarity_score)}
        </strong>
      </h2>
    </div>
  );
};

const Skeleton = () => {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <SquareLoader color="black" size={12} />
    </div>
  );
};

const Gallery_Doppleganger = ({ id, name }: { id: string; name: string }) => {
  async function hydrateSimilarSubmissions() {
    const { data } = await supabase.rpc("find_similar_submissions", {
      target_id: id,
      match_count: 3,
    });
    return data;
  }

  const { data, error } = useSWR<Submission[]>(
    `similar-submissions-${id}`,
    hydrateSimilarSubmissions
  );

  if (error) {
    console.error("Error fetching similar submissions:", error);
    return <p className="text-black">Error fetching similar submissions</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl text-black self-center text-center">
        See {name} Community Dopplegangers
      </h2>
      <p className="text-sm text-black self-center">
        These are the most similar-looking community submissions
      </p>
      <div className="grid grid-cols-3 gap-4">
        {data?.map((submission, index) => (
          <GalleryItem_Image
            key={submission.id}
            id={submission.id}
            imageUrl={submission.image_url}
            rank={index + 1}
          />
        ))}
      </div>
    </div>
  );
};
