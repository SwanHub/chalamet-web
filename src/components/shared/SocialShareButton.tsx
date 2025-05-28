import Link from "next/link";
import { FaTwitter, FaLinkedin } from "react-icons/fa";

interface SocialShareButtonProps {
  platform: "twitter" | "linkedin";
  submissionId: string;
  className?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  className = "",
  submissionId,
}) => {
  const icons = {
    twitter: <FaTwitter className="w-5 h-5 text-[#1DA1F2]" />,
    linkedin: <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />,
  };

  const defaultShareText =
    platform === "twitter"
      ? "My @chalametwtf lookalike results:"
      : "My chalamet.wtf lookalike results:";
  const fullUrl = `https://chalamet.wtf/submission/${submissionId}`;

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      fullUrl
    )}&text=${encodeURIComponent(defaultShareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      fullUrl
    )}`,
  };

  const label =
    platform === "twitter" ? "Share on Twitter" : "Share on LinkedIn";

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
