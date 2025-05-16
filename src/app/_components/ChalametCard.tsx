import { Button_2 } from "@/components/shared/Button_2";
import { SubmissionResults } from "../types";
import { formatPercent } from "@/lib/utils";
import { fetchSubmissionResults } from "../_api/api";
import useSWR from "swr";

export const ChalametScoreResults = ({ id }: { id: string }) => {
  const hydrate = () => fetchSubmissionResults(id);
  const { data, error } = useSWR<SubmissionResults>(
    `submission-results-${id}`,
    hydrate,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  if (error) return <p className="text-white">Error</p>;
  if (!data) return <p className="text-white">No data error</p>;

  // Get the top score for the main display
  const topScore = data.scores.length > 0 ? data.scores[0].similarity_score : 0;

  return (
    <div className="flex items-center justify-center animate-fade-in overflow-auto py-12">
      <div className="text-white max-w-xl w-full rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-center py-4 px-2 rounded-t-2xl">
          <p className="text-xs uppercase">Your Official Chalamet-ness</p>
          <h1 className="text-3xl font-extrabold">TIMOTHÉE TEST</h1>
          <p className="text-xs tracking-wide">HOW CHALAMET ARE YOU?</p>
        </div>

        {/* User's submitted image */}
        <div className="relative">
          <img
            src={data.submission.image_url}
            alt="Your submission"
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
            <p className="text-white text-sm font-medium">You</p>
          </div>
        </div>

        {/* Top score display */}
        <div className="bg-[#0F172A] p-4 text-center">
          <p className="text-lg font-bold mb-2">Your Top Match</p>
          <div className="relative text-center py-3 text-black text-3xl font-bold rounded-lg overflow-hidden bg-white">
            <div
              className="absolute inset-y-0 left-0 bg-[#E5D2F6]"
              style={{ width: `${topScore * 100}%` }}
            />
            <div className="relative z-10">
              {formatPercent(topScore)}
              <span className="text-base font-normal ml-1">similar</span>
            </div>
          </div>
        </div>

        {/* Comparison list */}
        <div className="bg-[#0F172A] p-4">
          <h2 className="font-bold mb-3 text-lg">Chalamet Comparisons</h2>

          <div className="space-y-4">
            {data.scores.map((score) => (
              <div
                key={score.id}
                className="flex bg-gray-800 rounded-lg overflow-hidden"
              >
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={score.base_comparisons.image_url}
                    alt="Chalamet comparison"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-grow flex items-center px-3">
                  <div className="w-full">
                    <div className="relative h-6 bg-gray-700 rounded-full overflow-hidden mb-1">
                      <div
                        className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{ width: `${score.similarity_score * 100}%` }}
                      />
                    </div>
                    <div className="text-right font-bold">
                      {formatPercent(score.similarity_score)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="bg-[#0F172A] p-4 rounded-b-2xl space-y-3">
          <div className="flex justify-between gap-3">
            <Button_2 className="bg-cyan-500 text-white flex-1" label="Share" />
            <Button_2
              className="bg-cyan-500 text-white flex-1"
              label="Try Again"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
