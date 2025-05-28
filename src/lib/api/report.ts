import { supabase } from "../supabase";

export const fetchReportedSubmissions = async (): Promise<any> => {
  const { data: submissionData, error: submissionError } = await supabase
    .from("submissions")
    .select("id, image_url, highest_score, normalized_score, created_at")
    .eq("report_status", "reported");

  if (submissionError) throw submissionError;

  return submissionData;
};
