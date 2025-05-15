import { formatPercent, formatRelativeTimestamp } from "@/lib/utils";

interface ImageCardProps {
  imageUrl: string;
  similarityScore: number;
  createdAt: number;
  rank?: number;
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

const GalleryItem_Image = ({
  imageUrl,
  similarityScore,
  createdAt,
  rank = 12,
}: ImageCardProps) => {
  const gradient = getGradientForScore();

  return (
    <div className="cursor-pointer group relative">
      <div className="relative w-full aspect-square overflow-hidden rounded-xl shadow-lg">
        <img
          src={imageUrl}
          alt="Submission"
          className="absolute top-0 left-0 w-full h-full object-cover bg-gray-900 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Chalamet-ness Badge with dynamic gradient */}
        <div
          className={`absolute top-2 left-2 bg-gradient-to-br ${gradient} text-white text-xs font-bold px-3 py-1 rounded-full shadow-md`}
        >
          {formatPercent(similarityScore)} Chalamet-ness
        </div>

        {/* Timestamp Badge */}
        <div className="absolute top-2 right-2 bg-gray-800/70 text-gray-200 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-gray-800/90 transition-colors duration-200">
          {formatRelativeTimestamp(createdAt)}
        </div>
      </div>
    </div>
  );
};

export default GalleryItem_Image;
