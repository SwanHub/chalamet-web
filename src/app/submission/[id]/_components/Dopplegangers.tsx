import { Submission } from "@/app/types";
import GalleryItem_Image from "@/components/list-items/GalleryItem_Entry";
import { supabase } from "@/lib/supabase";
import useSWR from "swr";

export const Dopplegangers = ({ id, name }: { id: string; name: string }) => {
  async function hydrateSimilarSubmissions() {
    const { data } = await supabase.rpc("find_similar_submissions", {
      target_id: id,
      match_count: 6,
    });
    return data;
  }

  const { data, error } = useSWR<Submission[]>(
    `similar-submissions-${id}`,
    hydrateSimilarSubmissions
  );

  if (error) {
    console.error("Error fetching similar submissions:", error);
    return <p className="text-black">Error fetching similar submissions</p>;
  }

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-3xl text-black self-center text-center">
        See {name}&apos;s Community Dopplegangers
      </h2>
      <p className="text-sm text-black self-center">
        These are the most similar-looking community submissions
      </p>
      <div className="grid grid-cols-3 gap-4">
        {data?.map((submission, index) => (
          <GalleryItem_Image
            key={submission.id}
            id={submission.id}
            imageUrl={submission.image_url}
            flag={`#${index + 1}`}
            name={submission.name}
          />
        ))}
      </div>
    </div>
  );
};
