import { ClipResponse, EmbedItem } from "@/app/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const item: EmbedItem = await request.json();

    const response = await fetchSimilarityScore(item.imageUrl);

    console.log("response from text clip comparison: ", response);

    return new NextResponse(JSON.stringify(response), {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Server-side errorr:", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to process request" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}

export const fetchSimilarityScore = async (
  imageUrl: string
): Promise<number> => {
  try {
    const response = await fetch(
      "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/clip-compare-text-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.ROBOFLOW_API_KEY,
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

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    const result: ClipResponse = await response.json();
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
