import Link from "next/link";

interface SocialShareButtonProps {
  platform: "twitter" | "linkedin";
  url: string;
  text?: string;
  className?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  url,
  text = "",
  className = "",
}) => {
  const logos = {
    twitter: "/logos/twitter.png",
    linkedin: "/logos/linkedin.png",
  };

  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
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
        bg-white text-gray-900 flex-1 hover:opacity-90
          items-center gap-2 rounded-full px-4 py-3 transition ${className}`}
    >
      <img src={logos[platform]} alt={`${platform} logo`} className="w-5 h-5" />
      <span className="font-medium text-xs sm:text-sm">{label}</span>
    </Link>
  );
};
