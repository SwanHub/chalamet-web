import { SubmitProcess2 } from "./StepwiseSubmission";

export const Modal_Submit = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-70 transition-opacity">
      <Button_Close onClose={onClose} />
      <SubmitProcess2 />
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
