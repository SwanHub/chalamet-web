"use client";

import { useState, useRef, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { CaptureStatus } from "../types";
import { Button_GenericWithIcon } from "@/components/shared/Button_GenericWithIcon";
import { CameraIcon } from "lucide-react";
import { CaptureCountdown } from "./CaptureStatus";
import { base64ToBlob, formatSimilarityScore } from "@/lib/utils";
import {
  createSubmission,
  createSubmissionScore,
  fetchSimilarityScore,
  uploadImage,
} from "../_api/submit";

export const SubmitProcess = () => {
  // Camera and screenshot states

  const [error, setError] = useState<string | null>(null);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [step, setStep] = useState<number>(0);

  // Refs for camera
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Camera functions
  const startCamera = async (): Promise<void> => {
    setError(null);
    setSuccess(false);
    setSimilarityScore(null);
    setSubmissionId(null);
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
              setCameraActive(true);
              setStep(1);
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
      setStep(0);
    }
  };

  const takeScreenshot = async (): Promise<void> => {
    if (videoRef.current && canvasRef.current && step === 1) {
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
          setStep(2);
          setCameraActive(false);
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
      const blob = await base64ToBlob(screenshot);
      const fileName = `${uuidv4()}.jpg`;
      const uploadedImageUrl = await uploadImage(blob, fileName);
      const newSubmissionId = await createSubmission(uploadedImageUrl);
      setSubmissionId(newSubmissionId);
      await createSubmissionScore(newSubmissionId, similarityScore);
      setSuccess(true);
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
      if (cameraActive) {
        stopCamera();
      }
    };
  }, [cameraActive]);

  const showScreenshot = step === 2;

  return (
    <div className="flex flex-col items-center w-full mx-auto gap-4">
      <div className="w-full relative rounded-lg overflow-hidden bg-gray-100 aspect-square border-2 border-cyan-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ display: cameraActive ? "block" : "none" }}
        />
        {showScreenshot && (
          <>
            {screenshot ? (
              <img
                src={screenshot}
                alt="Screenshot"
                className="w-full h-full object-cover"
              />
            ) : (
              <p>No screenshot found.</p>
            )}
          </>
        )}
        <MediaOverlay
          step={step}
          takeScreenshot={takeScreenshot}
          startCamera={startCamera}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
    </div>
  );
};

interface OverlayProps {
  step: number;
  takeScreenshot: () => void;
  startCamera: () => void;
}

const MediaOverlay = ({ step, takeScreenshot, startCamera }: OverlayProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <CaptureCountdown step={step} onCountdownComplete={takeScreenshot} />
      {step === 0 && (
        <div className="relative flex flex-col gap-6 w-full h-full items-center justify-center">
          <p className="text-gray-500">Camera preview will appear here</p>
          <Button_GenericWithIcon
            onClick={startCamera}
            label="Start camera"
            icon={<CameraIcon />}
          />
        </div>
      )}
    </div>
  );
};

// {/* Camera buttons */}
//       {/* <div className="w-full flex justify-center gap-4 my-4">
//         {!isActive && !screenshot ? (
//           <Button_GenericWithIcon
//             onClick={startCamera}
//             label="Start Camera"
//             icon={<CameraIcon />}
//           />
//         ) : isActive ? (
//           <>
//             <Button_Generic onClick={takeScreenshot} label="Take Screenshot" />
//             <Button_Generic onClick={stopCamera} label="Cancel" />
//           </>
//         ) : screenshot ? (
//           <>
//             <Button_Generic
//               onClick={submitToSupabase}
//               label={isSubmitting ? "Submitting..." : "Submit to Database"}
//             />
//             <Button_Generic onClick={clearScreenshot} label="Try Again" />
//           </>
//         ) : null}
//       </div> */}

// {/* Similarity score display */}
// {similarityScore !== null && (
//     <div className="mt-3 p-4 bg-white border border-cyan-200 rounded-lg w-full">
//       <h4 className="text-md font-medium mb-1">
//         Similarity to Timothée Chalamet
//       </h4>
//       <div className="flex items-center">
//         <div className="w-full bg-gray-200 rounded-full h-6">
//           <div
//             className="bg-cyan-600 h-6 rounded-full flex items-center justify-center text-white font-medium text-sm"
//             style={{ width: `${similarityScore * 100}%` }}
//           >
//             {formatSimilarityScore(similarityScore)}
//           </div>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Status messages */}
//   {error && (
//     <div className="w-full mt-2 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg">
//       {error}
//     </div>
//   )}

//   {success && (
//     <div className="w-full mt-2 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg">
//       <p>
//         Submission successful! Your Chalamet similarity score has been
//         recorded.
//       </p>
//       {submissionId && (
//         <p className="text-sm mt-1">Submission ID: {submissionId}</p>
//       )}
//     </div>
//   )}
