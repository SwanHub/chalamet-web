import useSWR from "swr";
import { fetchSubmissionResults } from "../_api/api";
import { SubmissionResults } from "../types";
import { ChalametScoreResults } from "./ChalametCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newSubId: string;
}

export const Modal_Results = ({ isOpen, onClose, newSubId }: Props) => {
  if (!isOpen) return null;

  const hydrate = () => fetchSubmissionResults(newSubId);
  const { data, error } = useSWR<SubmissionResults>(
    `submission-results-${newSubId}`,
    hydrate,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      revalidateIfStale: true,
    }
  );

  if (error) return <p>Error</p>;
  if (!data) return <p>No data error</p>;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 transition-opacity overflow-y-auto p-4">
      <div className="max-h-screen overflow-y-auto">
        <Button_Close onClose={onClose} />
        {data && <ChalametScoreResults data={data} />}
      </div>
    </div>
  );
};

const Button_Close = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-300 hover:text-gray-200 cursor-pointer"
    >
      ✕
    </button>
  );
};
