import { formatPercent, formatRelativeTimestamp } from "@/lib/utils";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  similarityScore: number;
  createdAt: number;
  rank: number | null;
  onClick: (id: string) => void;
}

const gradientVariants = [
  "from-yellow-400 to-pink-500",
  "from-blue-500 to-indigo-600",
  "from-green-400 to-emerald-600",
  "from-rose-400 to-fuchsia-600",
];

const getGradientForScore = () => {
  const index = Math.floor(Math.random() * gradientVariants.length);
  return gradientVariants[index];
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
  const gradient = getGradientForScore();
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

        <div
          className={`absolute top-2 left-2 bg-gradient-to-br ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}
        >
          {formatPercent(similarityScore)} Chalamet-ness
        </div>

        <div className="absolute top-2 right-2 bg-gray-800/40 text-gray-200 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-gray-800/60 transition-colors duration-200">
          {formatRelativeTimestamp(createdAt)}
        </div>

        {rank && (
          <div
            className={`absolute bottom-2 left-2 bg-gradient-to-br ${rankStyle} text-xs font-extrabold px-3 py-1 rounded-full shadow-md`}
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
      </div>
    </div>
  );
};

export default GalleryItem_Image;
