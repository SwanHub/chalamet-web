import { SocialShareButton } from "@/components/shared/SocialShareButton";
import { SubmissionResults, SubmissionScore } from "../types";
import { formatPercent } from "@/lib/utils";
import { fetchSubmissionResults } from "../_api/api";
import useSWR from "swr";
import { GridLoader } from "react-spinners";

interface Props {
  id: string;
}

export const ChalametScoreResults = ({ id }: Props) => {
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

  if (isLoading) return <Skeleton />;
  if (error) return <p className="text-white">Error</p>;
  if (!data) return <p className="text-white">No data error</p>;

  const topScore = data.scores.length > 0 ? data.scores[0].similarity_score : 0;

  return (
    <div className="flex w-full items-center justify-center animate-fade-in overflow-auto py-12">
      <div className="flex flex-col text-white max-w-screen-md w-full rounded-2xl overflow-hidden gap-6">
        <div className="relative grid grid-cols-2 gap-4">
          <ImageComponent
            title="Contestant"
            imageUrl={data.submission.image_url}
          />
          <ImageComponent
            title="Chalamet"
            imageUrl={data.scores[0].base_comparisons.image_url}
          />
          <div className="absolute z-20 bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-white text-center px-3 sm:px-6 py-1 sm:py-3 rounded-full shadow-lg border-2 border-gray-100">
              <span className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {formatPercent(topScore)}
              </span>
              <span className="text-lg text-cyan-700 font-medium ml-1">
                similar
              </span>
            </div>
          </div>
        </div>
        <div className="gap-2">
          <div className="flex justify-between gap-3">
            <SocialShareButton platform="twitter" url="https://twitter.com" />
            <SocialShareButton platform="linkedin" url="https://linkedin.com" />
          </div>
        </div>

        <div className="pb-6">
          <h2 className="font-bold mb-3 text-lg">Chalamet Comparisons</h2>

          <div className="space-y-4">
            {data.scores.map((score, index) => (
              <ComparisonItem key={index} score={score} />
            ))}
          </div>
        </div>
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
      <div className="w-24 h-24 flex-shrink-0">
        <img
          src={score.base_comparisons.image_url}
          alt="Chalamet comparison"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-grow relative">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
          style={{ width: `${score.similarity_score * 100}%` }}
        />

        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
          <span className="text-xl md:text-2xl font-bold text-white">
            {formatPercent(score.similarity_score)}
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
