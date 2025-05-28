"use client";

import { Button_Generic } from "@/components/shared/Button_Generic";
import { createVectorEmbOfImage } from "../../lib/api/embed";
import { Input_Text } from "@/components/shared/Input_Text";
import { useState } from "react";
import {
  createBaseComparison,
  uploadImageToBaseComparisons,
} from "../../lib/api/baseComparison";
import { v4 as uuidv4 } from "uuid";
import { imageUrlToBlob, getCentroidOfBaseComparisons } from "@/lib/utils";
import { calculateTextClipComparison } from "@/lib/api/testzone";
import { supabase } from "@/lib/supabase";
import { getAllBaseComparisons } from "@/lib/api/submit";
import similarity from "compute-cosine-similarity";

export default function NewBaseComparison() {
  // part 1
  const [inputImageUrl, setInputImageUrl] = useState<string>("");
  const [supabaseImageUrl, setSupabaseImageUrl] = useState<string | null>(null);
  // part 2
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  // part 3
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function createNewImage() {
    try {
      const blob = await imageUrlToBlob(inputImageUrl);
      const fileName = `${uuidv4()}.jpg`;
      const newImageUrl = await uploadImageToBaseComparisons(blob, fileName);
      if (newImageUrl) {
        setSupabaseImageUrl(newImageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function setImageEmbedding() {
    if (supabaseImageUrl) {
      const embedding = await createVectorEmbOfImage(supabaseImageUrl);
      if (embedding) {
        setEmbedding(embedding);
      }
    }
  }
  async function saveBaseComparison() {
    if (embedding && supabaseImageUrl) {
      const res = await createBaseComparison(
        name,
        description,
        embedding,
        supabaseImageUrl
      );
      console.log(res);
    }
  }

  // const [isRecalculating, setIsRecalculating] = useState(false);
  // const recalculateAllBaseComparisons = async () => {
  //   setIsRecalculating(true);
  //   const res = await recalculateBaseComparisons();
  //   console.log(res);
  //   setIsRecalculating(false);
  // };
  // const [isWorking, setIsWorking] = useState(false);
  // const recalculateAllSubmissionScores = async () => {
  //   setIsRecalculating(true);
  //   const res = await recomputeSimilarityScores();
  //   console.log(res);
  //   setIsRecalculating(false);
  // };
  // const normalizeSubmissionScores = async () => {
  //   await supabase.rpc("correct_all_highest_normalized_scores");
  // };

  // const [isProcessing, setIsProcessing] = useState(false);
  // async function processNullTextSimilarityScores() {
  //   try {
  //     setIsProcessing(true);
  //     const { data: submissions, error: submissionsError } = await supabase
  //       .from("submissions")
  //       .select("id, image_url")
  //       .is("text_similarity_score", null);

  //     if (submissionsError) throw submissionsError;

  //     if (!submissions || submissions.length === 0) {
  //       console.log("No submissions found with null text_similarity_score");
  //       return;
  //     }

  //     for (const submission of submissions) {
  //       try {
  //         const score = await calculateTextClipComparison(submission.image_url);

  //         if (score) {
  //           const { error: updateError } = await supabase
  //             .from("submissions")
  //             .update({ text_similarity_score: score })
  //             .eq("id", submission.id);

  //           if (updateError) {
  //             console.error(
  //               `Error updating submission ${submission.id}:`,
  //               updateError
  //             );
  //           } else {
  //             console.log(
  //               `Successfully updated submission ${submission.id} with score ${score}`
  //             );
  //           }
  //         }
  //       } catch (error) {
  //         console.error(`Error processing submission ${submission.id}:`, error);
  //       }
  //     }

  //     console.log("Finished processing submissions");
  //   } catch (error) {
  //     console.error("Error in processNullTextSimilarityScores:", error);
  //   } finally {
  //     setIsProcessing(false);
  //   }
  // }
  // const [isProcessingCentroid, setIsProcessingCentroid] = useState(false);
  // async function processCentroidSimilarityScores() {
  //   try {
  //     setIsProcessingCentroid(true);
  //     const baseComparisons = await getAllBaseComparisons();
  //     const centroid = await getCentroidOfBaseComparisons(baseComparisons);

  //     const { data: submissions, error: submissionsError } = await supabase
  //       .from("submissions")
  //       .select("id, image_url, embedding_vector")
  //       .is("centroid_similarity_score", null);

  //     if (submissionsError) throw submissionsError;

  //     if (!submissions || submissions.length === 0) {
  //       console.log("No submissions found with null centroid_similarity_score");
  //       return;
  //     }

  //     for (const submission of submissions) {
  //       try {
  //         if (!submission.embedding_vector) {
  //           console.log(
  //             `Submission ${submission.id} has no embedding vector, skipping`
  //           );
  //           continue;
  //         }

  //         const submissionVector = Array.isArray(submission.embedding_vector)
  //           ? submission.embedding_vector
  //           : JSON.parse(submission.embedding_vector);

  //         const cosine_similarity = similarity(submissionVector, centroid);

  //         if (cosine_similarity !== null) {
  //           const { error: updateError } = await supabase
  //             .from("submissions")
  //             .update({ centroid_similarity_score: cosine_similarity })
  //             .eq("id", submission.id);

  //           if (updateError) {
  //             console.error(
  //               `Error updating submission ${submission.id}:`,
  //               updateError
  //             );
  //           } else {
  //             console.log(
  //               `Successfully updated submission ${submission.id} with centroid similarity score ${cosine_similarity}`
  //             );
  //           }
  //         }
  //       } catch (error) {
  //         console.error(`Error processing submission ${submission.id}:`, error);
  //       }
  //     }

  //     console.log("Finished processing submissions");
  //   } catch (error) {
  //     console.error("Error in processNullTextSimilarityScores:", error);
  //   } finally {
  //     setIsProcessingCentroid(false);
  //   }
  // }

  return (
    <div className="flex flex-col max-w-screen-sm justify-center gap-12 w-full bg-amber-200 self-center">
      <div className="flex flex-col gap-12">
        {/* <Button_Generic
          label={
            isRecalculating ? "Calculating" : "Recalculate all base comparisons"
          }
          onClick={recalculateAllBaseComparisons}
        /> */}
        {/* <Button_Generic
          label={isWorking ? "Working" : "Recalculate all submission scores"}
          onClick={recalculateAllSubmissionScores}
          inverted
        /> */}
        {/* <Button_Generic
          label={"Correct submission scores"}
          onClick={normalizeSubmissionScores}
          inverted
        /> */}
        {/* <Button_Generic
          label={
            isProcessing
              ? "Processing"
              : "Process submissions with null text similarity scores"
          }
          onClick={processNullTextSimilarityScores}
        /> */}
        {/* <Button_Generic
          label={
            isProcessingCentroid
              ? "Processing centroid"
              : "Process centroid similarity scores"
          }
          onClick={processCentroidSimilarityScores}
        /> */}
      </div>

      <div className="flex flex-col w-full gap-12 justify-center">
        <h1 className="text-2xl font-bold">Create a new base comparison</h1>
        {/* part 1: create new image */}
        <div className="flex flex-col">
          <div className="flex w-full pb-6">
            <Input_Text
              label="Initial image url"
              value={inputImageUrl}
              setValue={setInputImageUrl}
              placeholder="img url"
            />
          </div>
          <img
            src={inputImageUrl}
            className="aspect-square w-128 object-cover"
          />
          <Button_Generic
            label="Save image to our bucket"
            onClick={createNewImage}
          />
        </div>

        {/* part 2: create vector embedding of said image */}
        {supabaseImageUrl && (
          <div>
            <Button_Generic
              label="Get and save image embedding"
              onClick={setImageEmbedding}
            />
            <p>Embedding, printed (to check): {JSON.stringify(embedding)}</p>
          </div>
        )}

        {/* part 3: given a vector embedding and imageUrl, insert value to our "base_comparisons" table */}
        {embedding && (
          <div>
            <div className="flex w-full pb-6">
              <Input_Text
                label="Name"
                value={name}
                setValue={setName}
                placeholder="img url"
              />
            </div>
            <div className="flex w-full pb-6">
              <Input_Text
                label="Description"
                value={description}
                setValue={setDescription}
                placeholder="img url"
              />
            </div>
            <Button_Generic
              label="Create base comparison"
              onClick={saveBaseComparison}
            />
          </div>
        )}
      </div>
    </div>
  );
}
