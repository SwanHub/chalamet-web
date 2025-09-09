interface ImageCardProps {
  id: string;
  imageUrl: string;
  rank: number | null;
  onClick: (id: string) => void;
}

const GalleryItem_Image = ({ id, imageUrl, rank, onClick }: ImageCardProps) => {
  function clickItem() {
    onClick(id);
  }

  return (
    <div className="cursor-pointer group relative border" onClick={clickItem}>
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt="Submission"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div
          className={`bg-white absolute top-0 left-0 px-1 border-r border-b`}
        >
          #{rank}
        </div>
      </div>
    </div>
  );
};

export default GalleryItem_Image;
