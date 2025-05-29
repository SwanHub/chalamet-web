"use client";

import { Submission } from "../types";
import useSWR from "swr";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";
import { fetchReportedSubmissions } from "@/lib/api/report";
import { GridLoader } from "react-spinners";

export default function ReportedSubmissions() {
  const { data: submissions, error } = useSWR<Submission[]>(
    "reported-submissions",
    fetchReportedSubmissions,
    {
      refreshInterval: 0,
      revalidateOnFocus: true,
    }
  );

  const onClickItem = (id: string) => {
    console.log("clicked item: ", id);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900/80 px-4">
        <div className="text-red-400 bg-red-900/20 p-4 rounded-lg">
          <p className="font-medium">Error loading reported submissions</p>
          <p className="text-sm opacity-80 mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!submissions) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900/80">
        <GridLoader color="cyan" size={12} />
        <p className="text-cyan-400 mt-4 text-sm">
          Loading reported submissions...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full bg-gray-900/80 px-4 sm:px-8 min-h-screen">
      <div className="max-w-screen-lg mx-auto w-full py-8">
        <h1 className="text-2xl font-bold text-white mb-2">
          Reported Submissions
        </h1>
        <p className="text-gray-400 mb-8">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}{" "}
          reported
        </p>

        {submissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400">No reported submissions found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {submissions.map((item) => (
              <GalleryItem_Image
                key={item.id}
                id={item.id}
                imageUrl={item.image_url}
                similarityScore={item.z_avg_similarity_score}
                createdAt={item.created_at}
                rank={null}
                onClick={onClickItem}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
