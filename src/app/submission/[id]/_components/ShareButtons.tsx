import Link from "next/link";
import { FaLinkedin } from "react-icons/fa";
import { Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";
import { FaXTwitter } from "react-icons/fa6";

interface Props {
  submissionId: string;
}

export const ShareButtons: React.FC<Props> = ({ submissionId }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = `https://chalamet.wtf/submission/${submissionId}`;
  const label = copied ? "Copied!" : "Copy link";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 4000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="grid grid-cols-3 w-full gap-3">
      <Link
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
          shareUrl
        )}&text=${encodeURIComponent(
          "Check out my Timothée Chalamet lookalike results @chalametwtf:"
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-center justify-between flex items-center gap-1 whitespace-nowrap border text-black px-2 py-1`}
      >
        <span className="text-xs">Share on X</span>
        <FaXTwitter className="w-4 h-4 text-black" />
      </Link>
      <Link
        href={`https://www.linkedin.com/feed/?shareActive&mini=true&text=${encodeURIComponent(
          "Check out my Timothée Chalamet lookalike results:" + " " + shareUrl
        )}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-center justify-between flex items-center gap-1 whitespace-nowrap border text-black px-2 py-1`}
      >
        <span className="text-xs">Share on LinkedIn</span>
        <FaLinkedin className="w-4 h-4 text-black" />
      </Link>
      <button
        onClick={handleCopy}
        className={`cursor-pointer text-center justify-between flex items-center gap-1 whitespace-nowrap border text-black px-2 py-1`}
      >
        <span className="text-xs">{label}</span>
        {copied ? (
          <Check className="w45 h-4 text-green-400" />
        ) : (
          <LinkIcon className="w-4 h-4 text-gray-400" />
        )}
      </button>
    </div>
  );
};
