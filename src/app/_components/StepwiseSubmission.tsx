"use client";

import { useState, useRef, useEffect } from "react";
import { CameraIcon } from "lucide-react";
import {
  batchInsertSimilarityScores,
  createSubmission,
  createSubmissionScore,
  createSubmissionWithEmbedding,
  fetchSimilarityScore,
  getAllBaseComparisons,
  uploadImageToSubmissions,
} from "../_api/submit";
import { base64ToBlob } from "@/lib/utils";
import { v4 as uuidv4 } from "uuid";
import { CHALAMET_BANNER } from "../constants";
import { GridLoader, PuffLoader } from "react-spinners";
import { createVectorEmbOfImage } from "../_api/api";
import similarity from "compute-cosine-similarity";
import { SubmitScore } from "../types";

interface Props {
  newSubId: string | null;
  setNewSubId: (val: string | null) => void;
  setModalOpen: (val: boolean) => void;
}

export const SubmitProcess2 = ({
  newSubId,
  setNewSubId,
  setModalOpen,
}: Props) => {
  // STATE.
  const [step, setStep] = useState(0);
  const [screenshot, setScreenshot] = useState<string | null>(null);
  const [gettingScores, setGettingScores] = useState<boolean>(false);
  const [creatingSubmission, setCreatingSubmission] = useState<boolean>(false);
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
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
      console.log("screenshot taken");
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

  // the new routes- -
  // 1. uploadImageToSubmissions: get back supabaseImageUrl. DONE.
  // 2. getImageEmbedding: send supabaseImageUrl to roboflow workflow, get back a CLIP embedding. DONE.
  // 3. take embeddings and imageUrl, create a new value in "submissions" table. DONE.
  // -- ALL SET.
  // 4. get all active base_comparisons, loop through each and create similarityScores for each.

  async function createNewSubmission() {
    if (screenshot) {
      try {
        setGettingScores(true);
        // create image.
        const blob = await base64ToBlob(screenshot);
        const fileName = `${uuidv4()}.jpg`;
        const uploadedImageUrl = await uploadImageToSubmissions(blob, fileName);

        if (uploadedImageUrl) {
          // compute vector embedding.
          console.log("image url set: ", uploadedImageUrl);
          const emb = await createVectorEmbOfImage(uploadedImageUrl);
          if (emb) {
            // create new submission.
            console.log("embedding set: ", emb);
            setEmbedding(emb);
            const newsubID = await createSubmissionWithEmbedding(
              uploadedImageUrl,
              emb
            );
            if (newsubID) {
              setNewSubId(newsubID);
              setStep(3);
              console.log("new submission id: ", newsubID);
            }
          }
        }
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setGettingScores(false);
      }
    }
  }

  useEffect(() => {
    if (newSubId && (step === 3 || step === 4)) {
      nextStep();
    }
  }, [newSubId, step]);

  async function computeSimiarityScores() {
    if (embedding && newSubId) {
      try {
        setGettingScores(true);
        const baseComparisons = await getAllBaseComparisons();
        const scores: SubmitScore[] = [];
        baseComparisons.forEach((item) => {
          const cosine_similarity = similarity(
            embedding,
            item.embedding_vector
          );
          scores.push({
            similarity_score: cosine_similarity ? cosine_similarity : 0,
            submission_id: newSubId,
            base_comparison_id: item.id,
          });
        });
        const scoreCreationResult = await batchInsertSimilarityScores(scores);
        console.log("score create result: ", scoreCreationResult);
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setGettingScores(false);
        setStep(4);
      }
    }
  }

  // async function getScore() {
  //   if (screenshot) {
  //     try {
  //       setGettingScores(true);
  //       const score = await fetchSimilarityScore(screenshot);
  //       setSimilarityScore(score);
  //     } catch (error) {
  //       console.log("error: ", error);
  //     } finally {
  //       setGettingScores(false);
  //       setStep(3);
  //     }
  //   }
  // }

  // const submitToSupabase = async (): Promise<void> => {
  //   if (!screenshot || similarityScore === null) {
  //     setError("Missing screenshot or similarity score");
  //     return;
  //   }
  //   setCreatingSubmission(true);
  //   setError(null);

  //   try {
  //     const blob = await base64ToBlob(screenshot);
  //     const fileName = `${uuidv4()}.jpg`;
  //     const uploadedImageUrl = await uploadImageToSubmissions(blob, fileName);
  //     const newSubmissionId = await createSubmission(uploadedImageUrl);

  //     await createSubmissionScore(newSubmissionId, similarityScore);
  //     setNewSubId(newSubmissionId);
  //   } catch (err: any) {
  //     console.error("Error submitting to Supabase:", err);
  //     setError(err.message || "Failed to submit to database");
  //   } finally {
  //     setCreatingSubmission(false);
  //     setStep(4);
  //   }
  // };

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
            {/* default to test */}
            {/* {step === 0 && (
                <img
                  src={CHALAMET_BANNER}
                  alt="Screenshot"
                  className="w-full h-full object-cover rounded-2xl border-2 border-cyan-500"
                />
              )} */}
            {step > 1 && screenshot && (
              <img
                src={screenshot}
                alt="Screenshot"
                className="w-full h-full object-cover rounded-2xl border-2 border-cyan-500"
              />
            )}
            <p className="bg-black text-white">
              {gettingScores ? "Getting score" : ""}
            </p>
            <Overlay step={step} nextStep={nextStep} countdown={countdown} />
            <canvas ref={canvasRef} className="hidden" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface OverlayProps {
  step: number;
  countdown: number | null;
  nextStep: () => void;
}

const Overlay = ({ step, nextStep }: OverlayProps) => {
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
      <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none">
        <div className="flex justify-between w-full items-center pointer-events-auto">
          <button
            onClick={() => alert("Blur background feature coming soon!")}
            className="backdrop-blur bg-white/10 text-white border border-white/10 rounded-full px-4 py-2 text-sm font-medium shadow-md"
          >
            {step < 2 ? (
              <>🔍  Detecting...</>
            ) : step === 4 ? (
              <>✅  Success</>
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
            Look straight
            <br /> into the camera
          </div>
        ) : step === 4 ? (
          <div className="text-white text-4xl font-bold drop-shadow-md">
            Looking good.
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
