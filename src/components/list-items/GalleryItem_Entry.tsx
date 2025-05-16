import { formatPercent, formatRelativeTimestamp } from "@/lib/utils";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  similarityScore: number;
  createdAt: number;
  rank: number | null;
  onClick: (id: string) => void;
}

const getGradientForScore = (score: number): string => {
  const percentage = score * 100;
  if (percentage >= 75) {
    return "bg-gradient-to-r from-purple-600 to-pink-500";
  } else if (percentage >= 50) {
    return "bg-gradient-to-r from-cyan-500 to-blue-500";
  } else if (percentage >= 25) {
    return "bg-gradient-to-r from-yellow-400 to-orange-500";
  } else {
    return "bg-gradient-to-r from-gray-400 to-gray-600";
  }
};

const getRankStyle = (rank: number | null) => {
  if (rank) {
    if (rank === 1) return "from-yellow-300 to-yellow-500 text-black";
    if (rank === 2) return "from-gray-300 to-gray-500 text-black";
    if (rank === 3) return "from-amber-400 to-orange-500 text-black";
    return "from-gray-700 to-gray-900 text-white";
  } else {
    return "";
  }
};

const GalleryItem_Image = ({
  id,
  imageUrl,
  similarityScore,
  createdAt,
  rank,
  onClick,
}: ImageCardProps) => {
  const gradient = getGradientForScore(similarityScore);
  const rankStyle = getRankStyle(rank);
  function clickItem() {
    onClick(id);
  }

  return (
    <div className="cursor-pointer group relative" onClick={clickItem}>
      <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-lg">
        <img
          src={imageUrl}
          alt="Submission"
          className="absolute top-0 left-0 w-full h-full object-cover bg-gray-900 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />

        {rank && (
          <div
            className={`absolute top-2 left-2 bg-gradient-to-br ${rankStyle} text-xs font-extrabold px-3 py-1 rounded-full shadow-md`}
          >
            {rank === 1
              ? "1st Place"
              : rank === 2
              ? "2nd Place"
              : rank === 3
              ? "3rd Place"
              : `Rank #${rank}`}
          </div>
        )}

        <div
          className={`absolute bottom-2 left-2 bg-gradient-to-br ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}
        >
          {formatPercent(similarityScore)} similar
        </div>

        <div className="absolute bottom-2 right-2 bg-gray-800/40 text-gray-200 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-gray-800/60 transition-colors duration-200">
          {formatRelativeTimestamp(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default GalleryItem_Image;
