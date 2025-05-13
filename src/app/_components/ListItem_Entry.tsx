export const ListItem_LeaderboardEntry = ({
  item,
  index,
}: {
  item: any;
  index: number;
}) => {
  return (
    <div
      className="w-full mb-4 bg-cover bg-center flex items-stretch text-white group
        bg-gradient-to-r from-gray-900/60 to-transparent rounded-lg border-2 border-gray-900
        cursor-pointer hover:border-gray-800 transition-all
        hover:scale-101 
        duration-300"
      style={{
        backgroundImage: `url(${item.submissions.image_url})`,
      }}
    >
      <div className="flex w-full justify-between rounded-md bg-gradient-to-r from-gray-900/90 group-hover:from-gray-800/90 to-transparent">
        <div className="flex">
          <div className="p-8 flex items-center justify-center text-white/80">
            <span className="bg-gray-900/70 font-serif h-20 w-20 flex items-center justify-center text-3xl font-bold">
              {index + 1}
            </span>
          </div>

          <div className="flex flex-col justify-center flex-grow">
            <div className="text-xl font-semibold">Submission</div>
            <div className="text-sm opacity-80">
              {new Date(item.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="flex font-serif items-center justify-center px-6 text-5xl font-bold bg-transparent">
          {(parseFloat(item.similarity_score) * 100).toFixed(1)}%
        </div>
      </div>
    </div>
  );
};
