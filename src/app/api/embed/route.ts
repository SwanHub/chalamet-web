import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { imageUrl } = await request.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      "https://serverless.roboflow.com/infer/workflows/jp-roboflow-tests/single-clip-embedding",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          api_key: process.env.ROBOFLOW_API_KEY,
          inputs: {
            image: { type: "url", value: imageUrl },
          },
          version: "ViT-B-32",
        }),
      }
    );

    const result = await response.json();

    if (!result || !result.outputs?.[0]?.image_embedding) {
      return NextResponse.json(
        { error: "Failed to generate embedding" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      embedding: result.outputs[0].image_embedding,
    });
  } catch (error) {
    console.error("Error generating embedding:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
