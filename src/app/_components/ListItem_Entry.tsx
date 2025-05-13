import { formatRelativeTimestamp } from "@/lib/utils";

export const ListItem_LeaderboardEntry = ({
  item,
  index,
  isActive = false,
}: {
  item: any;
  index: number;
  isActive?: boolean;
}) => {
  return (
    <div
      className={`${
        isActive ? "border-cyan-400 mb-0 flex-col" : "border-gray-900 mb-4"
      }
        flex w-full bg-cover bg-center items-stretch text-white group
        bg-gradient-to-r from-gray-900/60 to-transparent border-2 
        cursor-pointer transition-all hover:scale-102 duration-300`}
      style={{
        backgroundImage: `url(${item.submissions.image_url})`,
      }}
    >
      <div className="flex w-full justify-between bg-gradient-to-r from-gray-900/90 group-hover:from-gray-800/90 to-transparent">
        <div className="flex">
          <div className="flex">
            <Ranking isActive={isActive} index={index} />
            <SubmissionDetails createdAt={item.created_at} />
          </div>
          <SimilarityScore score={item.similarity_score} />
        </div>
        <ActiveDetails createdAt={item.created_at} isActive={isActive} />
      </div>
    </div>
  );
};

const ActiveDetails = ({
  isActive,
  createdAt,
}: {
  isActive: boolean;
  createdAt: string | number | Date;
}) => {
  return (
    <div
      className={`w-full overflow-hidden ${
        isActive ? "block max-h-40" : "hidden max-h-0"
      }`}
    >
      <div className="p-8">
        <h3 className="text-2xl font-semibold mb-2">Chalamet Lookalike</h3>
        <SubmissionDetails createdAt={createdAt} />
        <div className="flex mt-6 gap-2">
          <button className="bg-transparent hover:bg-white/10 cursor-pointer border border-white text-white font-medium py-2 px-6 rounded">
            SHARE
          </button>
        </div>
      </div>
    </div>
  );
};

const Ranking = ({ isActive, index }: { isActive: boolean; index: number }) => {
  return (
    <div className="p-8 flex items-center justify-center text-white/80">
      <span
        className={`${isActive ? "bg-cyan-600" : "bg-gray-900/70"}
        font-serif h-14 w-14 flex items-center justify-center text-2xl font-bold`}
      >
        {index + 1}
      </span>
    </div>
  );
};

const SubmissionDetails = ({
  createdAt,
}: {
  createdAt: string | number | Date;
}) => {
  return (
    <div className="flex flex-col justify-center flex-grow">
      <div className="text-xl font-semibold">Submission</div>
      <div className="text-sm opacity-80">
        {formatRelativeTimestamp(createdAt)}
      </div>
    </div>
  );
};

const SimilarityScore = ({ score }: { score: string }) => {
  return (
    <div className="flex font-serif items-center justify-center px-6 text-5xl font-bold bg-transparent">
      {(parseFloat(score) * 100).toFixed(1)}%
    </div>
  );
};
