import { SubmissionResults } from "@/app/types";
import { formatTwoDecimals } from "@/lib/utils";

export const ResultsSummary = ({ data }: { data: SubmissionResults }) => {
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
