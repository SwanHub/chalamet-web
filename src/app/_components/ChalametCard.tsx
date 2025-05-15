import { Button_2 } from "@/components/shared/Button_2";

interface Props {
  imageSrc: string;
  similarityScore: number;
  submissionId: string;
}

export const ChalametScoreCard = ({
  imageSrc,
  similarityScore,
  submissionId,
}: Props) => {
  return (
    <div className="flex items-center justify-center">
      <div className="text-white max-w-md w-full rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-center py-4 px-2 rounded-t-2xl">
          <p className="text-xs uppercase">Your Official Chalamet-ness</p>
          <h1 className="text-3xl font-extrabold">WOWZERS</h1>
          <p className="text-xs tracking-wide">THE LIKENESS IS UNCANNY</p>
        </div>

        <img
          src={imageSrc}
          alt="Lookalike"
          className="w-full h-auto object-cover"
        />

        <div className="bg-[#0F172A] py-2 text-center text-xs">
          <p>
            {/* ID: {submissionId} */}
            Rank: <strong>#12</strong> / 124,124
          </p>
        </div>

        <div className="relative text-center py-4 text-black text-3xl font-bold rounded-b-2xl overflow-hidden">
          <div className="absolute inset-0 bg-white" />

          <div
            className="absolute inset-y-0 left-0 bg-[#E5D2F6]"
            style={{ width: `${similarityScore * 100}%` }}
          />

          <div className="relative z-10">
            {(similarityScore * 100).toFixed(1)}%
            <span className="text-base font-normal ml-1">similar</span>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <Button_2 className="bg-cyan-500 text-white w-1/2" label="Twitter" />
          <Button_2
            className="bg-cyan-500 text-white w-1/2"
            label="Instagram"
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <Button_2 className="bg-cyan-500 text-white" label="Done" />
        </div>
      </div>
    </div>
  );
};
