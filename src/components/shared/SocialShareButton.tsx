import Link from "next/link";
import { FaTwitter, FaLinkedin } from "react-icons/fa";
import { Link as LinkIcon, Check } from "lucide-react";
import { useState } from "react";

interface SocialShareButtonProps {
  platform: "twitter" | "linkedin" | "copy";
  submissionId: string;
  className?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  className = "",
  submissionId,
}) => {
  const [copied, setCopied] = useState(false);

  const icons = {
    twitter: <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />,
    linkedin: <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />,
    copy: copied ? (
      <Check className="w-5 h-5 text-green-400" />
    ) : (
      <LinkIcon className="w-5 h-5 text-gray-400" />
    ),
  };

  const defaultShareText =
    platform === "twitter"
      ? "Check out my Timothée Chalamet lookalike results @chalametwtf:"
      : "Check out my Timothée Chalamet lookalike results:";
  const fullUrl = `https://chalamet.wtf/submission/${submissionId}`;

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      fullUrl
    )}&text=${encodeURIComponent(defaultShareText)}`,
    linkedin: `https://www.linkedin.com/feed/?shareActive&mini=true&text=${encodeURIComponent(
      defaultShareText + " " + fullUrl
    )}`,
    copy: fullUrl,
  };

  const label =
    platform === "twitter"
      ? "Share on Twitter"
      : platform === "linkedin"
      ? "Share on LinkedIn"
      : copied
      ? "Copied!"
      : "Share link";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  if (platform === "copy") {
    return (
      <button
        onClick={handleCopy}
        className={`flex text-center justify-center whitespace-nowrap cursor-pointer
        bg-white/10 backdrop-blur-sm border border-white/20 text-white
        hover:bg-white/20 flex-1 items-center gap-2 rounded-full 
        px-4 py-3 transition-all duration-200 ${className}`}
      >
        {icons[platform]}
        <span className="font-medium text-xs sm:text-sm">{label}</span>
      </button>
    );
  }

  return (
    <Link
      href={shareUrls[platform]}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex text-center justify-center whitespace-nowrap
        bg-white/10 backdrop-blur-sm border border-white/20 text-white
        hover:bg-white/20 flex-1 items-center gap-2 rounded-full 
        px-4 py-3 transition-all duration-200 ${className}`}
    >
      {icons[platform]}
      <span className="font-medium text-xs sm:text-sm">{label}</span>
    </Link>
  );
};
