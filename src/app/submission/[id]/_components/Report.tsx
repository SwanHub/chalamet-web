import { SubmissionResults } from "@/app/types";
import { supabase } from "@/lib/supabase";
import { Flag } from "lucide-react";

export const Report = ({ data }: { data: SubmissionResults }) => {
  const handleReport = async () => {
    if (!data) return;

    try {
      const { error } = await supabase
        .from("submissions")
        .update({ report_status: "reported" })
        .eq("id", data.submission.id);

      if (error) throw error;

      alert("Successfully reported submission");
    } catch (error) {
      console.error("Error reporting submission:", error);
      alert("Failed to report submission");
    }
  };
  return (
    <button
      onClick={handleReport}
      className="text-black hover:text-red-600 transition-colors cursor-pointer self-center text-center items-center justify-center my-12"
      title="Report submission"
    >
      <Flag className="w-4 h-4" />
    </button>
  );
};
