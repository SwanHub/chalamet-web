import { SubmissionResults } from "@/app/types";

export const Comparison = ({ data }: { data: SubmissionResults }) => {
  return (
    <div className="w-full self-center flex justify-between items-center gap-4">
      <div className="flex flex-col w-full max-w-md">
        <div className="relative w-full">
          <div className="aspect-square w-full">
            <img
              src={data.submission.image_url}
              alt={`${data.submission.name ?? "SUBMISSION"}`}
              className="w-full h-full object-cover border border-black border-t-0"
            />
          </div>
        </div>
        <div className="w-full bg-white text-center py-2 px-2 border border-black">
          <p className="text-sm uppercase text-black font-medium">{`${
            data.submission.name ?? "SUBMISSION"
          }`}</p>
        </div>
      </div>
      <p>vs.</p>
      <div className="flex flex-col w-full max-w-md">
        <div className="relative w-full">
          <div className="aspect-square w-full">
            <img
              src={"/images/chalamet.jpg"}
              alt={`Timothee Chalamet`}
              className="w-full h-full object-cover border border-black border-t-0"
            />
          </div>
        </div>
        <div className="w-full bg-white text-center py-2 px-2 border border-black">
          <p className="text-sm uppercase text-black font-medium">
            Timothee Chalamet
          </p>
        </div>
      </div>
    </div>
  );
};
