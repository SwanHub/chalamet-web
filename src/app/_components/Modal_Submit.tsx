import { Button_Generic } from "@/components/shared/Button_Generic";
import { SubmitProcess } from "./SubmitProcess";
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
      <div className="bg-white text-black rounded-2xl p-8 max-w-lg w-full relative animate-fade-in">
        <h2 className="text-2xl font-bold mb-4">Ready?</h2>
        <Button_Close onClose={onClose} />
        <p className="mb-6">
          {
            "Start the camera and we'll auto-capture a screenshot after a few seconds. Good luck 🤝"
          }
        </p>
        <SubmitProcess2 />
      </div>
    </div>
  );
};

const Button_Close = ({ onClose }: { onClose: () => void }) => {
  return (
    <button
      onClick={onClose}
      className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
    >
      ✕
    </button>
  );
};
