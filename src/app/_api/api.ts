import { ClipResponse } from "../types";

export const fetchCLIPConfidence = async (
  imageUrl: string
): Promise<ClipResponse> => {
  const response = await fetch(
    "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/detect-and-classify",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY,
        inputs: {
          image: {
            type: "url",
            value: imageUrl,
          },
          text_classes: ["timothée chalamet"],
          version: "ViT-B-16",
        },
      }),
    }
  );

  const result = await response.json();
  return result;
};

export const fetchCLIPImage2Image = async (
  image1Url: string,
  image2Url: string
): Promise<any> => {
  const response = await fetch("http://127.0.0.1:8000/cosine_similarity", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      image_1: image1Url,
      image_2: image2Url,
    }),
  });

  const result = await response.json();
  return result;
};

export const fetchEmbedToAvg = async (imageUrl: string): Promise<any> => {
  const response = await fetch(
    "http://127.0.0.1:8000/general_chalamet_similarity",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ image: imageUrl }),
    }
  );

  const result = await response.json();
  return result;
};

export const createVectorEmbOfImage = async (
  imageUrl: string
): Promise<any> => {
  const response = await fetch(
    "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/single-clip-embedding",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: process.env.NEXT_PUBLIC_ROBOFLOW_API_KEY,
        inputs: {
          image: { type: "url", value: imageUrl },
        },
        version: "ViT-B-32",
      }),
    }
  );

  const result = await response.json();
  if (result) {
    return result.outputs[0].image_embedding;
  } else {
    return null;
  }
};

export const testFastAPI = async (): Promise<any> => {
  const response = await fetch("http://127.0.0.1:8000/", { method: "GET" });
  const result = await response.json();
  return result;
};

// ---- STARTING A NEW PROJECT
// -- mkdir project_name
// -- cd project_name
// -- python3 -m venv venv
// -- source venv/bin/activate
// -- pip install "fastapi[standard]"
// -- add main.py to the root folder (above venv)
// -- fastapi dev main.py
// ---- END.

// ---- HIGH-LEVEL IMPORTANT:
// -- anytime you add a new pkg, restart the server.
