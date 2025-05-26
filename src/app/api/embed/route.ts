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

// export async function POST(request: Request) {
//   try {
//     const { imageUrl } = await request.json();

//     console.log("imageUrl fed into endpoint (server-side): ", imageUrl);

//     if (!imageUrl) {
//       console.log("Image URL is note present. returning early.");
//       return NextResponse.json(
//         { error: "Image URL is required" },
//         { status: 400 }
//       );
//     }

//     const result = await response.json();
//     console.log("parsed json from roboflow: ", result);

//     // if (!result || !result.outputs?.[0]?.image_embedding) {
//     //   return NextResponse.json(
//     //     { error: "Failed to generate embedding" },
//     //     { status: 500 }
//     //   );
//     // }

//     return NextResponse.json({
//       embedding: [1, 2, 3],
//     });
//     // return NextResponse.json({
//     //   embedding: result.outputs[0].image_embedding,
//     // });
//   } catch (error) {
//     console.error("Error generating embedding:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }
