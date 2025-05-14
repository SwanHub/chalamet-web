"use client";

import { useState, useRef, useEffect } from "react";
import { Button_GenericWithIcon } from "@/components/shared/Button_GenericWithIcon";
import { CameraIcon } from "lucide-react";
import { Button_Generic } from "@/components/shared/Button_Generic";
import {
  createSubmission,
  createSubmissionScore,
  fetchSimilarityScore,
  uploadImage,
} from "../_api/submit";
import { base64ToBlob } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";

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
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // SEQUENTIAL FUNCTIONS.
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
      console.log("starting timer");
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
        return () => console.log("see results");
    }
  }

  const btnText =
    step === 0
      ? "Open camera"
      : step === 1
      ? "Take screenshot"
      : step === 2
      ? "Get similarity score"
      : step === 3
      ? "Submit score 🎉"
      : "Next: see results";

  useEffect(() => {
    // unmount.
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full mx-auto gap-4">
      <div className="w-full relative rounded-lg overflow-hidden bg-gray-100 aspect-square border-2 border-cyan-300">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ display: step === 1 && cameraActive ? "block" : "none" }}
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
        <Overlay
          step={step}
          nextStep={nextStep}
          countdown={countdown}
          gettingScore={gettingScore}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      {step > 2 && <Button_Generic onClick={nextStep} label={btnText} />}
      <p>{btnSubText}</p>
    </div>
  );
};

interface OverlayProps {
  step: number;
  gettingScore: boolean;
  countdown: number | null;
  nextStep: () => void;
}

const Overlay = ({ step, gettingScore, nextStep, countdown }: OverlayProps) => {
  if (gettingScore) {
    <div className="absolute top-2 left-2">
      <p className="text-violet-500">GETTING SCORE</p>
    </div>;
  }

  if (step === 0) {
    return (
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-white/80">
        <p className="text-gray-500">Camera preview will appear here</p>
        <Button_GenericWithIcon
          onClick={nextStep}
          label="Start camera"
          icon={<CameraIcon />}
        />
        <div className="absolute top-2 left-2">{step === 0 && <p>🟢</p>}</div>
      </div>
    );
  }

  return (
    <div className="absolute top-2 left-2">
      {step === 1 && countdown !== null && <p>{countdown}</p>}
      {step === 3 && <p>%</p>}
      {step === 4 && <p>✅</p>}
    </div>
  );
};
