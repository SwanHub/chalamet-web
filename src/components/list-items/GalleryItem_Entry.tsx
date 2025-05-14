import { formatPercent, formatRelativeTimestamp } from "@/lib/utils";

interface ImageCardProps {
  imageUrl: string;
  similarityScore: number;
  createdAt: number;
}

const GalleryItem_Image = ({
  imageUrl,
  similarityScore,
  createdAt,
}: ImageCardProps) => {
  return (
    <div className="cursor-pointer group">
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt="Submission"
          className="absolute top-0 left-0 w-full h-full object-cover bg-gray-900 opacity-90 hover:opacity-100 transition-opacity duration-300"
        />

        <div className="absolute bottom-0 left-0 group-hover:bg-gray-900/80 bg-gray-900/40 w-full bg-opacity-50 text-white p-3 text-center">
          {similarityScore !== undefined && (
            <p className="text-2xl">{formatPercent(similarityScore)} similar</p>
          )}
          {createdAt && (
            <p className="text-sm text-gray-300">
              {formatRelativeTimestamp(createdAt)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryItem_Image;
