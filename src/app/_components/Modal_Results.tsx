import { ChalametScoreResults } from "./ChalametCard";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  activeSubmissionId: string | null;
}

export const Modal_Results = ({
  isOpen,
  onClose,
  activeSubmissionId,
}: Props) => {
  if (!isOpen || !activeSubmissionId) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 transition-opacity overflow-y-auto p-4">
      <div className="max-h-screen overflow-y-auto">
        <Button_Close onClose={onClose} />
        <ChalametScoreResults id={activeSubmissionId} />
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
