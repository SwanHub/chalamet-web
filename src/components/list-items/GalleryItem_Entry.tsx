import Link from "next/link";

interface ImageCardProps {
  id: string;
  imageUrl: string;
  flag: string | null;
}

const GalleryItem_Image = ({ id, imageUrl, flag }: ImageCardProps) => {
  return (
    <Link href={`/submission/${id}`}>
      <div className="cursor-pointer group relative border">
        <div className="relative w-full aspect-square overflow-hidden">
          <img
            src={imageUrl}
            alt="Submission"
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
          {flag && (
            <div
              className={`bg-white absolute top-0 left-0 px-1 border-r border-b`}
            >
              {flag}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default GalleryItem_Image;
