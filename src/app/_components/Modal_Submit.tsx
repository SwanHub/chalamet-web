import { Button_Generic } from "@/components/shared/Button_Generic";

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
      <div className="bg-white text-black rounded-2xl p-8 max-w-md w-full shadow-lg relative animate-fade-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black cursor-pointer"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold mb-4">Ready to Compete?</h2>
        <p className="mb-6">
          We'll take a screenshot of your face and give you a similarity score
          to Timothée Chalamet.
        </p>
        <Button_Generic label="Get started" />
      </div>
    </div>
  );
};
