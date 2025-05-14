"use client";

import { useState, useRef, useEffect } from "react";
import { Button_GenericWithIcon } from "@/components/shared/Button_GenericWithIcon";
import { CameraIcon } from "lucide-react";
import {
  createSubmission,
  createSubmissionScore,
  fetchSimilarityScore,
  uploadImage,
} from "../_api/submit";
import { base64ToBlob } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { ChalametScoreCard } from "./ChalametCard";

export const SubmitProcess2 = () => {
  // STATE.
  const [step, setStep] = useState(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [gettingScore, setGettingScore] = useState<boolean>(false);
  const [creatingSubmission, setCreatingSubmission] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [newSubId, setNewSubId] = useState<string | null>(null);
  const [btnSubText, setBtnSubText] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // SEQUENTIAL FUNCTIONS.
  // automatic kickoff.
  useEffect(() => {
    nextStep();
  }, []);
  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);
        setStep(1);
      }
    } catch (err) {
      setError("Unable to start camera");
      console.error(err);
    }
  };

  useEffect(() => {
    if (cameraActive) {
      startScreenshotTimer();
    }
  }, [cameraActive]);

  const startScreenshotTimer = () => {
    setTimeout(() => {
      nextStep();
    }, 4000);
  };

  const takeScreenshot = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = canvas.toDataURL("image/jpeg");
      setScreenshot(imageData);
      setStep(2);
    }
  };

  useEffect(() => {
    if (screenshot && step === 2) {
      stopCamera();
      nextStep();
    }
  }, [screenshot, step]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  async function getScore() {
    if (screenshot) {
      try {
        setGettingScore(true);
        const score = await fetchSimilarityScore(screenshot);
        setSimilarityScore(score);
        setBtnSubText(score.toString());
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setGettingScore(false);
        setStep(3);
      }
    }
  }

  useEffect(() => {
    if (similarityScore && step === 3) {
      nextStep();
    }
  }, [similarityScore, step]);

  const submitToSupabase = async (): Promise<void> => {
    if (!screenshot || similarityScore === null) {
      setError("Missing screenshot or similarity score");
      return;
    }
    setCreatingSubmission(true);
    setBtnSubText("Submitting...");
    setError(null);

    try {
      const blob = await base64ToBlob(screenshot);
      const fileName = `${uuidv4()}.jpg`;
      const uploadedImageUrl = await uploadImage(blob, fileName);
      const newSubmissionId = await createSubmission(uploadedImageUrl);
      await createSubmissionScore(newSubmissionId, similarityScore);
      setNewSubId(newSubmissionId);
      if (newSubmissionId) {
        setBtnSubText(`New submission ID: ${newSubmissionId}`);
      }
    } catch (err: any) {
      console.error("Error submitting to Supabase:", err);
      setError(err.message || "Failed to submit to database");
    } finally {
      setCreatingSubmission(false);
      setStep(4);
    }
  };

  useEffect(() => {
    if (newSubId && step === 4) {
      nextStep();
    }
  }, [newSubId, step]);

  const showResultsView = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowResults(true);
      setFadeOut(false);
    }, 1000);
  };

  function nextStep() {
    switch (step) {
      case 0:
        return startCamera();
      case 1:
        return takeScreenshot();
      case 2:
        return getScore();
      case 3:
        return submitToSupabase();
      case 4:
        return showResultsView();
    }
  }

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="bg-white text-black rounded-2xl p-8 max-w-lg w-full relative animate-fade-in h-[90vh] overflow-y-scroll">
      {step === 0 && (
        <>
          <h2 className="text-2xl font-bold mb-4">Ready?</h2>
          <p className="mb-6">
            {
              "Start the camera and we'll auto-capture a screenshot after a few seconds. Good luck 🤝"
            }
          </p>
        </>
      )}

      <div className="flex flex-col items-center w-full mx-auto gap-4">
        {!showResults ? (
          <div
            className={`transition-opacity duration-300 ${
              fadeOut ? "opacity-0" : "opacity-100"
            } w-full`}
          >
            <div className="w-full relative rounded-lg overflow-hidden bg-gray-100 aspect-square border-2 border-cyan-300">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
                style={{
                  display: step === 1 && cameraActive ? "block" : "none",
                }}
              />
              {step > 1 && screenshot && (
                <img
                  src={screenshot}
                  alt="Screenshot"
                  className="w-full h-full object-cover"
                />
              )}
              <p className="bg-black text-white">
                {gettingScore ? "Getting score" : ""}
              </p>
              <Overlay step={step} nextStep={nextStep} countdown={countdown} />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          </div>
        ) : (
          <>
            {screenshot && similarityScore && newSubId && (
              <ChalametScoreCard
                imageSrc={screenshot}
                similarityScore={similarityScore}
                submissionId={newSubId}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface OverlayProps {
  step: number;
  countdown: number | null;
  nextStep: () => void;
}

const Overlay = ({ step, nextStep, countdown }: OverlayProps) => {
  if (step === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80">
        <p className="text-gray-500">Camera preview will appear here</p>
        <Button_GenericWithIcon
          onClick={nextStep}
          label="Start camera"
          icon={<CameraIcon />}
        />
      </div>
    );
  }

  return (
    <div className="absolute top-2 left-2">
      {step === 1 && countdown !== null && <p>{countdown}</p>}
    </div>
  );
};
