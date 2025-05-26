import { EmbedItem, EmbedResponse, EmbedResponseRaw } from "@/app/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const item: EmbedItem = await request.json();

    const response = await fetch(
      "https://detect.roboflow.com/infer/workflows/jp-roboflow-tests/single-clip-embedding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.ROBOFLOW_API_KEY,
          inputs: {
            image: { type: "url", value: item.imageUrl },
          },
        }),
      }
    );

    const result: EmbedResponseRaw = await response.json();

    if (result.outputs[0].image_embedding) {
      const res: EmbedResponse = {
        image_embedding: result.outputs[0].image_embedding,
      };
      return new NextResponse(JSON.stringify(res), {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
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
