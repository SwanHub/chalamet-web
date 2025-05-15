import { formatPercent, formatRelativeTimestamp } from "@/lib/utils";

interface FirstPlaceProps {
  imageUrl: string;
  similarityScore: number;
  createdAt: number;
  rank: number | null;
}

const getGradientForScore = () => {
  const variants = [
    "from-yellow-400 to-pink-500",
    "from-blue-500 to-indigo-600",
    "from-green-400 to-emerald-600",
    "from-rose-400 to-fuchsia-600",
  ];
  return variants[Math.floor(Math.random() * variants.length)];
};

const FirstPlace = ({
  imageUrl,
  similarityScore,
  createdAt,
  rank,
}: FirstPlaceProps) => {
  const gradient = getGradientForScore();

  return (
    <div className="cursor-pointer group relative">
      <div className="relative w-full aspect-[16/10] overflow-hidden rounded-2xl shadow-xl border-2 border-cyan-500">
        <img
          src={imageUrl}
          alt="First Place Submission"
          className="absolute top-0 left-0 w-full h-full object-cover bg-gray-900 opacity-90 group-hover:opacity-100 transition-opacity duration-300"
        />

        {rank === 1 && (
          <div
            className="absolute top-4 left-4 font-serif
            text-2xl font-extrabold bg-gradient-to-r from-yellow-300 to-yellow-500 text-black 
            px-6 py-2 rounded-full shadow-lg backdrop-blur-sm"
          >
            🏆 1st Place
          </div>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
          <div
            className={`bg-gradient-to-br ${gradient} text-white text-xs md:text-sm font-bold px-4 py-1 rounded-full shadow-md`}
          >
            {formatPercent(similarityScore)} Chalamet-ness
          </div>
          <div className="bg-gray-800/50 text-gray-200 text-[11px] font-medium px-3 py-1 rounded-full shadow-sm backdrop-blur-sm group-hover:bg-gray-800/70 transition-colors duration-200">
            {formatRelativeTimestamp(createdAt)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FirstPlace;
