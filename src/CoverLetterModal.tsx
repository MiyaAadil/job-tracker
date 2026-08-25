import { X } from "lucide-react";
import { useEffect } from "react";

interface CoverLetterModalProps {
  coverLetter: string;
  onClose: () => void;
}

const CoverLetterModal = ({ coverLetter, onClose }: CoverLetterModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Generated cover letter"
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <h2 className="font-bold text-lg mb-3">Cover Letter</h2>
        <p className="text-sm whitespace-pre-line">{coverLetter}</p>
      </div>
    </div>
  );
};

export default CoverLetterModal;