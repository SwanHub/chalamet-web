"use client";

import { useState, useRef, useEffect } from "react";
import { CameraIcon } from "lucide-react";
import {
  batchInsertSimilarityScores,
  createSubmissionWithEmbedding,
  getAllBaseComparisons,
  uploadImageToSubmissions,
} from "../_api/submit";
import { base64ToBlob } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { GridLoader, PuffLoader } from "react-spinners";
import { createVectorEmbOfImage } from "../_api/api";
import similarity from "compute-cosine-similarity";
import { SubmitScore } from "../types";

interface Props {
  activeSubmissionId: string | null;
  setActiveSubmissionId: (val: string | null) => void;
  setModalOpen: (val: boolean) => void;
}

export const SubmitProcess2 = ({
  activeSubmissionId,
  setActiveSubmissionId,
  setModalOpen,
}: Props) => {
  // STATE.
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const [localNewSubId, setLocalNewId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (isResetting) {
      try {
        // local.
        setLocalNewId(null);
        setStep(0);
        setScreenshot(null);
        setEmbedding(null);
        setError(null);
        setCameraActive(false);
        setCountdown(null);
        // props.
        setActiveSubmissionId(null);
        setModalOpen(false);
        // clear vid.
        stopCamera();
      } catch (error) {
        console.error("Error during reset:", error);
      } finally {
        setIsResetting(false);
      }
    }
  }, [isResetting]);

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
      startScreenshotTimer();
    }
  }, [cameraActive]);

  const startScreenshotTimer = () => {
    setCountdown(5);

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    setTimeout(() => {
      nextStep();
    }, 5000);
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

  async function createNewSubmission() {
    if (screenshot) {
      try {
        const blob = await base64ToBlob(screenshot);
        const fileName = `${uuidv4()}.jpg`;
        const uploadedImageUrl = await uploadImageToSubmissions(blob, fileName);

        if (uploadedImageUrl) {
          const emb = await createVectorEmbOfImage(uploadedImageUrl);

          if (emb) {
            setEmbedding(emb);
            const newsubID = await createSubmissionWithEmbedding(
              uploadedImageUrl,
              emb
            );
            if (newsubID) {
              setLocalNewId(newsubID);
              setStep(3);
            }
          }
        }
      } catch (error) {
        console.log("error: ", error);
      }
    }
  }

  useEffect(() => {
    if (localNewSubId && step === 3) {
      nextStep();
    }
  }, [localNewSubId, step]);

  async function computeSimiarityScores() {
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
        await batchInsertSimilarityScores(scores);
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setStep(4);
        setActiveSubmissionId(localNewSubId);
      }
    }
  }

  useEffect(() => {
    if (activeSubmissionId && step === 4) {
      nextStep();
    }
  }, [activeSubmissionId, step]);

  const showResultsView = () => {
    setTimeout(() => {
      setModalOpen(true);
    }, 1000);
  };

  function nextStep() {
    switch (step) {
      case 0:
        return startCamera();
      case 1:
        return takeScreenshot();
      case 2:
        return createNewSubmission();
      case 3:
        return computeSimiarityScores();
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
    <div
      className="flex w-full aspect-square max-w-sm 
      justify-start items-start cursor-pointer"
    >
      <div className="flex flex-col items-center w-full gap-4">
        <div className={`transition-opacity duration-300 w-full`}>
          <div className="w-full relative overflow-hidden aspect-square">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-2xl border-2 border-cyan-500"
              style={{
                display: step === 1 && cameraActive ? "block" : "none",
              }}
            />
            {step > 1 && screenshot && (
              <img
                src={screenshot}
                alt="Screenshot"
                className="w-full h-full object-cover rounded-2xl border-2 border-cyan-500"
              />
            )}
            <p className="bg-black text-white">
              {error ? `Error: ${error}` : ""}
            </p>
            <Overlay
              step={step}
              nextStep={nextStep}
              countdown={countdown}
              localNewSubId={localNewSubId}
              setModalOpen={setModalOpen}
              setActiveSubmissionId={setActiveSubmissionId}
            />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
        {step === 4 && (
          <button
            onClick={() => setIsResetting(true)}
            className="backdrop-blur cursor-pointer bg-white/10 text-white border border-white/10 rounded-full px-4 py-2 text-sm font-medium shadow-md"
          >
            {"🔄 Play again"}
          </button>
        )}
      </div>
    </div>
  );
};

interface OverlayProps {
  step: number;
  countdown: number | null;
  localNewSubId: string | null;
  nextStep: () => void;
  setActiveSubmissionId: (val: string | null) => void;
  setModalOpen: (val: boolean) => void;
}

const Overlay = ({
  step,
  nextStep,
  localNewSubId,
  countdown,
  setActiveSubmissionId,
  setModalOpen,
}: OverlayProps) => {
  function handleClickSeeResults() {
    if (step === 4 && localNewSubId) {
      setActiveSubmissionId(localNewSubId);
      setModalOpen(true);
    }
  }
  if (step === 0) {
    return (
      <div
        className="absolute inset-0 transition-all border-2 border-cyan-500
  bg-gradient-to-br from-cyan-500 via-cyan-700 to-cyan-900 flex flex-col items-center
  justify-between px-4 py-8 text-center rounded-2xl group"
        onClick={nextStep}
      >
        <div className="flex flex-col items-center justify-center gap-6 h-full">
          <h1 className="text-4xl font-extrabold text-white drop-shadow-xl">
            Ready?
          </h1>

          <button
            className="bg-white cursor-pointer text-pink-600 text-2xl font-bold py-5 px-10 rounded-full shadow-xl
              group-hover:scale-110 transition-transform duration-300 ease-in-out flex items-center gap-3"
          >
            <CameraIcon className="w-6 h-6" />
            Take a pic
          </button>

          <p className="text-white text-base font-medium opacity-80">
            Good luck 🤝
          </p>
        </div>
      </div>
    );
  } else {
    return (
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none z-10">
        <div className="flex justify-between w-full items-center pointer-events-auto">
          <button
            onClick={handleClickSeeResults}
            className="backdrop-blur cursor-pointer bg-white/10 text-white border border-white/10 rounded-full px-4 py-2 text-sm font-medium shadow-md"
          >
            {step < 2 ? (
              <>🔍  Detecting...</>
            ) : step === 4 ? (
              <>✅  See results</>
            ) : (
              <>🔬  Analyzing...</>
            )}
          </button>
          {step < 4 && (
            <>
              {step < 2 ? (
                <GridLoader size={8} color="cyan" />
              ) : (
                <PuffLoader size={32} color="cyan" />
              )}
            </>
          )}
        </div>

        {step < 2 ? (
          <div className="text-white text-4xl font-bold drop-shadow-md">
            <div className="text-white text-xs font-medium drop-shadow-md uppercase pb-1">
              screenshot in...{" "}
              <strong className="text-cyan-500 text-2xl font-bold">
                {countdown?.toString()}
              </strong>
            </div>
            Look straight
            <br /> into the camera
          </div>
        ) : step === 4 ? (
          <div className="text-white text-4xl font-bold drop-shadow-md">
            {""}
          </div>
        ) : (
          <div className="text-white text-5xl font-bold drop-shadow-md">
            {"📸"}
          </div>
        )}
      </div>
    );
  }
};
