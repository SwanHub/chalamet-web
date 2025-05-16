import useSWR from "swr";
import { ChalametScoreCard } from "./ChalametCard";
import { fetchSubmissionResults } from "../_api/api";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  newSubId: string;
}

export const Modal_Results = ({ isOpen, onClose, newSubId }: Props) => {
  if (!isOpen) return null;

  const hydrate = () => fetchSubmissionResults(newSubId);
  const { data, error } = useSWR(`submission-results-${newSubId}`, hydrate, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    revalidateIfStale: true,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 transition-opacity">
      <Button_Close onClose={onClose} />
      {/* {screenshot && similarityScore && newSubId && (
        <ChalametScoreCard
          imageSrc={screenshot}
          similarityScore={similarityScore}
          submissionId={newSubId}
        />
      )} */}
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
