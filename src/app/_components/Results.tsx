import { BarChart2 } from "lucide-react";
import { Button_Generic } from "@/components/shared/Button_Generic";

interface Props {
  screenshot: string | null;
  similarityScore: number | null;
  submissionId: string | null;
}

export const Results = ({
  screenshot,
  similarityScore,
  submissionId,
}: Props) => {
  return (
    <div className="animate-fade-in w-full max-w-md mx-auto">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-cyan-500 to-blue-500">
          <h2 className="text-white text-xl font-bold">Results</h2>
        </div>

        <div className="p-6">
          {screenshot && (
            <div className="mb-6">
              <h3 className="text-gray-700 font-medium mb-2">Your Image</h3>
              <img
                src={screenshot}
                alt="Submitted screenshot"
                className="w-full rounded-lg border border-gray-200"
              />
            </div>
          )}

          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-gray-700 font-medium mb-1">
                Similarity Score
              </h3>
              <div className="flex items-center space-x-2">
                <div className="text-3xl font-bold text-cyan-600">
                  {similarityScore}%
                </div>
                <BarChart2 className="text-cyan-500" />
              </div>
            </div>

            {submissionId && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-gray-700 font-medium mb-1">
                  Submission ID
                </h3>
                <div className="font-mono text-sm bg-gray-100 p-2 rounded">
                  {submissionId}
                </div>
              </div>
            )}

            <div className="mt-6">
              <Button_Generic
                label="Share Results"
                onClick={() => {
                  // Implement share functionality
                  navigator.clipboard.writeText(
                    `My similarity score: ${similarityScore}%`
                  );
                  alert("Results copied to clipboard!");
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
