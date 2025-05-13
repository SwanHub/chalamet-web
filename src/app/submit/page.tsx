"use client";

import { useState, useRef, useEffect } from "react";
import { Button_Generic } from "@/components/shared/Button_Generic";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { ClipResponse } from "../types";
import { ID_CHALAMET_BASE_COMPARISON_TEXT_EMB } from "../constants";

export default function Submit() {
  // Camera and screenshot states
  const [isActive, setIsActive] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Refs for camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera functions
  const startCamera = async (): Promise<void> => {
    setError(null);
    setSuccess(false);
    try {
      const constraints: MediaStreamConstraints = {
        video: true,
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const playPromise = videoRef.current.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Camera started successfully");
              setIsActive(true);
            })
            .catch((err) => {
              console.error("Error playing video:", err);
              setError("Failed to play video stream");
            });
        }
      }
    } catch (err: any) {
      console.error("Error accessing camera:", err);
      setError(err.message || "Failed to access camera");
    }
  };

  const stopCamera = (): void => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
      setIsActive(false);
    }
  };

  const takeScreenshot = async (): Promise<void> => {
    if (videoRef.current && canvasRef.current && isActive) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Draw current video frame to canvas
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert canvas to data URL and store it
        try {
          const imageData = canvas.toDataURL("image/jpeg");
          setScreenshot(imageData);
          setSuccess(false);
          setSimilarityScore(null);
          setSubmissionId(null);

          // Automatically get similarity score when screenshot is taken
          setIsProcessing(true);
          try {
            const score = await fetchSimilarityScore(imageData);
            setSimilarityScore(score);
          } catch (err: any) {
            setError("Failed to get similarity score: " + err.message);
          } finally {
            setIsProcessing(false);
          }
        } catch (err: any) {
          console.error("Error capturing screenshot:", err);
          setError("Failed to capture screenshot");
        }
      }
    }
  };

  const clearScreenshot = (): void => {
    setScreenshot(null);
    setSimilarityScore(null);
    setSuccess(false);
    setSubmissionId(null);
  };

  // Function to fetch similarity score using base64 image
  const fetchSimilarityScore = async (base64Image: string): Promise<number> => {
    try {
      // Make sure the base64 string is properly formatted
      const base64Data = base64Image.includes("base64,")
        ? base64Image.split("base64,")[1]
        : base64Image;

      const response = await fetch(
        "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/detect-and-classify",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            api_key: process.env.NEXT_PUBLIC_API_KEY,
            inputs: {
              image: {
                type: "base64",
                value: base64Data,
              },
              text_classes: ["timothée chalamet"],
              version: "ViT-B-16",
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const result: ClipResponse = await response.json();

      // Extract the similarity score
      if (result.outputs) {
        return result.outputs[0].clip_comparison.similarities[0];
      } else {
        throw new Error("No similarity score returned");
      }
    } catch (err: any) {
      console.error("Error fetching similarity score:", err);
      throw err;
    }
  };

  // Convert base64 to blob for storage upload
  const base64ToBlob = async (base64Data: string): Promise<Blob> => {
    // Remove the data URL prefix if it exists
    const base64 = base64Data.includes("base64,")
      ? base64Data.split("base64,")[1]
      : base64Data;

    // Decode base64 to binary
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return Blob
    return new Blob([bytes], { type: "image/jpeg" });
  };

  // Function to submit to Supabase with image upload
  const submitToSupabase = async (): Promise<void> => {
    if (!screenshot || similarityScore === null) {
      setError("Missing screenshot or similarity score");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Step 1: Upload image to Supabase Storage
      console.log("Converting image to blob...");
      const blob = await base64ToBlob(screenshot);

      // Generate unique filename
      const fileName = `${uuidv4()}.jpg`;
      console.log("Uploading image to storage...");

      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("submissions") // Make sure this bucket exists in your Supabase
        .upload(fileName, blob, {
          contentType: "image/jpeg",
          cacheControl: "3600",
        });

      if (storageError) throw storageError;

      // Get the public URL for the uploaded image
      // COULD FOREGO THIS STEP AND JUST GET THE ASSUMED ENDPOINT.
      const {
        data: { publicUrl },
      } = supabase.storage.from("submissions").getPublicUrl(fileName);

      console.log("Image uploaded, public URL:", publicUrl);

      // Step 2: Create a submission entry with the image URL
      console.log("Creating submission record...");
      const { data: submissionData, error: submissionError } = await supabase
        .from("submissions")
        .insert([
          {
            image_url: publicUrl,
          },
        ])
        .select();

      if (submissionError) throw submissionError;

      const newSubmissionId = submissionData[0].id;
      setSubmissionId(newSubmissionId);
      console.log("Submission created with ID:", newSubmissionId);

      // Step 3: Create a submission_score entry
      console.log("Creating score record...");
      const { error: scoreError } = await supabase
        .from("submission_scores")
        .insert([
          {
            submission_id: newSubmissionId,
            base_comparison_id: ID_CHALAMET_BASE_COMPARISON_TEXT_EMB,
            similarity_score: similarityScore,
          },
        ]);

      if (scoreError) throw scoreError;

      // Success!
      setSuccess(true);
      console.log("Submission process completed successfully!");
    } catch (err: any) {
      console.error("Error submitting to Supabase:", err);
      setError(err.message || "Failed to submit to database");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (isActive) {
        stopCamera();
      }
    };
  }, [isActive]);

  // Helper function to format the similarity score as a percentage
  const formatScore = (score: number): string => {
    return `${(score * 100).toFixed(2)}%`;
  };

  const canSubmit =
    screenshot !== null &&
    similarityScore !== null &&
    !isSubmitting &&
    !success;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto p-4 bg-violet-50">
      <h1 className="text-xl font-bold text-center mb-6 text-gray-800">
        Chalamet Similarity Test
      </h1>

      {/* Video display area */}
      <div className="w-full relative rounded-lg overflow-hidden bg-gray-100 aspect-square mb-4 border-2 border-violet-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ display: isActive ? "block" : "none" }}
        />

        {!isActive && !screenshot && (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-gray-500">Camera preview will appear here</p>
          </div>
        )}

        {screenshot && (
          <img
            src={screenshot}
            alt="Screenshot"
            className="w-full h-full object-cover"
          />
        )}

        {isProcessing && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-white">Processing...</div>
          </div>
        )}

        {/* Hidden canvas for capturing screenshots */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Camera buttons */}
      <div className="w-full flex justify-center gap-4 my-4">
        {!isActive && !screenshot ? (
          <Button_Generic onClick={startCamera} label="Start Camera" />
        ) : isActive ? (
          <>
            <Button_Generic onClick={takeScreenshot} label="Take Screenshot" />
            <Button_Generic onClick={stopCamera} label="Cancel" />
          </>
        ) : screenshot ? (
          <>
            <Button_Generic
              onClick={submitToSupabase}
              label={isSubmitting ? "Submitting..." : "Submit to Database"}
            />
            <Button_Generic onClick={clearScreenshot} label="Try Again" />
          </>
        ) : null}
      </div>

      {/* Similarity score display */}
      {similarityScore !== null && (
        <div className="mt-3 p-4 bg-white border border-violet-200 rounded-lg w-full">
          <h4 className="text-md font-medium mb-1">
            Similarity to Timothée Chalamet
          </h4>
          <div className="flex items-center">
            <div className="w-full bg-gray-200 rounded-full h-6">
              <div
                className="bg-violet-600 h-6 rounded-full flex items-center justify-center text-white font-medium text-sm"
                style={{ width: `${similarityScore * 100}%` }}
              >
                {formatScore(similarityScore)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Status messages */}
      {error && (
        <div className="w-full mt-2 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="w-full mt-2 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
          <p>
            Submission successful! Your Chalamet similarity score has been
            recorded.
          </p>
          {submissionId && (
            <p className="text-sm mt-1">Submission ID: {submissionId}</p>
          )}
        </div>
      )}
    </div>
  );
}
