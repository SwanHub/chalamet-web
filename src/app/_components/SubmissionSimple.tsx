"use client";

import { useState, useRef, useEffect } from "react";
import { CameraIcon } from "lucide-react";
import {
  batchInsertSimilarityScores,
  createSubmissionWithEmbedding,
  getAllBaseComparisons,
  uploadImageToSubmissions,
} from "../../lib/api/submit";
import { base64ToBlob } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { createVectorEmbOfImage } from "../../lib/api/embed";
import similarity from "compute-cosine-similarity";
import { SubmitScore } from "../types";
import { supabase } from "@/lib/supabase";
import { SquareLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  colors,
} from "unique-names-generator";

export const SubmissionSimple = () => {
  // STATE.
  const router = useRouter();
  const [step, setStep] = useState(0); // 0: placeholder, 1: camera, 2: screenshot, 3: processing, 4: complete
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [localNewSubId, setLocalNewSubId] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Cleanup camera on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
      });

      // Store stream in state and move to step 1
      setStream(mediaStream);
      setStep(1);
    } catch {
      setError("Unable to start camera");
    }
  };

  // Step 1: When step becomes 1 and we have a stream, set up video
  useEffect(() => {
    if (step === 1 && stream && videoRef.current) {
      videoRef.current.srcObject = stream;
      setCameraActive(true);
    } else if (step === 1) {
      setError("Video stream or videoRef not found.");
    }
  }, [step, stream]);

  // Step 2: When camera becomes active, start video and countdown
  useEffect(() => {
    if (cameraActive && videoRef.current) {
      videoRef.current.onloadedmetadata = () => {
        if (videoRef.current) {
          videoRef.current.play();
        }
      };
      startCountdown();
    } else if (cameraActive) {
      setError("Camera active but no videoRef.");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cameraActive]);

  // Step 3: When screenshot is taken, create submission
  useEffect(() => {
    if (screenshot && step === 2) {
      createNewSubmission();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenshot, step]);

  // Step 4: When submission is created, compute similarity scores
  useEffect(() => {
    if (localNewSubId && embedding && step === 3) {
      computeSimilarityScores();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localNewSubId, embedding, step]);

  const startCountdown = () => {
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          setTimeout(() => {
            takeScreenshot();
          }, 500);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const takeScreenshot = () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Missing video or canvas ref.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check if video is ready
    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return;
    }

    // Calculate the square size (use the smaller dimension)
    const size = Math.min(video.videoWidth, video.videoHeight);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      // Calculate offset to center the crop
      const xOffset = (video.videoWidth - size) / 2;
      const yOffset = (video.videoHeight - size) / 2;

      // Draw the centered square portion of the video
      ctx.drawImage(
        video,
        xOffset,
        yOffset,
        size,
        size, // Source rectangle
        0,
        0,
        size,
        size // Destination rectangle
      );
      const imageData = canvas.toDataURL("image/jpeg");
      setScreenshot(imageData);
      stopCamera();
      setStep(2);
    }
  };

  const createNewSubmission = async () => {
    if (screenshot) {
      try {
        const blob = await base64ToBlob(screenshot);
        const fileName = `${uuidv4()}.jpg`;
        const uploadedImageUrl = await uploadImageToSubmissions(blob, fileName);

        if (uploadedImageUrl) {
          const emb = await createVectorEmbOfImage(uploadedImageUrl);

          if (emb) {
            // Generate random name with adjective + noun (animals/colors), 4-8 letters each
            const filteredAdjectives = adjectives.filter(
              (word) => word.length >= 4 && word.length <= 8
            );
            const filteredAnimals = animals.filter(
              (word) => word.length >= 4 && word.length <= 8
            );
            const filteredColors = colors.filter(
              (word) => word.length >= 4 && word.length <= 8
            );

            const name = uniqueNamesGenerator({
              dictionaries: [
                filteredAdjectives,
                [...filteredAnimals, ...filteredColors],
              ],
              separator: " ",
              style: "lowerCase",
            });

            setEmbedding(emb);
            const newsubID = await createSubmissionWithEmbedding(
              uploadedImageUrl,
              emb,
              name
            );
            if (newsubID) {
              setLocalNewSubId(newsubID);
              setStep(3);
            }
          }
        }
      } catch {
        setError("Failed to create submission");
      }
    }
  };

  const computeSimilarityScores = async () => {
    if (embedding && localNewSubId) {
      try {
        const baseComparisons = await getAllBaseComparisons();

        const scores: SubmitScore[] = [];
        baseComparisons.forEach((item) => {
          const cosine_similarity = similarity(
            embedding,
            item.embedding_vector
          );
          scores.push({
            similarity_score: cosine_similarity ? cosine_similarity : 0,
            submission_id: localNewSubId,
            base_comparison_id: item.id,
          });
        });

        const result = await batchInsertSimilarityScores(scores);
        if (result.success) {
          await supabase.rpc("submission_score_normalizer");
          await supabase.rpc("correct_all_highest_normalized_scores");
          await supabase.rpc("calculate_z_highest_normalized_scores");
          await supabase.rpc("calculate_avg_similarity_scores");
          await supabase.rpc("calculate_z_avg_similarity_scores");
          router.push(`/submission/${localNewSubId}`);
        }
      } catch {
        setError("Failed to compute similarity scores");
      }
    }
  };

  const stopCamera = () => {
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  return (
    <div className="w-full max-w-md">
      {step === 0 && (
        <>
          <div
            className="aspect-square w-full bg-gray-100 hover:bg-gray-200 transition-all duration-300 border-t border-x flex flex-col justify-center items-center cursor-pointer"
            onClick={startCamera}
          >
            <CameraIcon className="w-10 h-10 text-violet-700 pb-2" />
            <p className="text-sm font-semibold">Start analysis</p>
          </div>
          <div className="w-full bg-white text-center py-2 px-2 border border-black">
            <p className="text-sm uppercase text-black font-medium">You</p>
          </div>
        </>
      )}

      {step === 1 && (
        <div className="flex flex-col w-full max-w-md">
          <div className="relative w-full">
            <div className="aspect-square w-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover border border-black border-b-0"
              />
            </div>
          </div>
          <div className="w-full bg-white text-center py-2 px-2 border border-black">
            <p className="text-sm uppercase text-black font-medium">
              {countdown ? `Pic in ${countdown}...` : "📸"}
            </p>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col w-full max-w-md">
          <div className="relative w-full">
            <div className="aspect-square w-full">
              {screenshot ? (
                <img
                  src={screenshot}
                  alt="Your screenshot"
                  className="w-full h-full object-cover border border-black border-b-0"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 border border-black border-b-0 flex items-center justify-center">
                  <div className="text-gray-500">Processing...</div>
                </div>
              )}
            </div>
          </div>
          <div className="w-full bg-white text-center py-2 px-2 border border-black">
            <SquareLoader color="black" size={10} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col w-full max-w-md">
          <div className="relative w-full">
            <div className="aspect-square w-full">
              {screenshot && (
                <img
                  src={screenshot}
                  alt="Your screenshot"
                  className="w-full h-full object-cover border border-black border-b-0"
                />
              )}
            </div>
          </div>
          <div className="w-full bg-white text-center py-2 px-2 border border-black">
            <SquareLoader color="black" size={10} />
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 p-2 bg-red-100 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
