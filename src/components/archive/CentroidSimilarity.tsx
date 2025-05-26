"use client";

import { useState } from "react";
import { compareToCentroid } from "../../lib/api/centroid";
import { Button_Generic } from "@/components/shared/Button_Generic";
import { Input_Text } from "@/components/shared/Input_Text";

export default function CentroidSimilarity() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const doIt = async () => {
    setLoading(true);
    try {
      const response: any = await compareToCentroid(text);
      setConfidence(response.similarity);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-cyan-50 w-full">
      <h1 className="text-xl font-bold text-center mb-8 text-gray-800">
        {"CLIP Average embedding <> image cosine similarity"}
      </h1>
      <div className="flex w-full pb-6">
        <Input_Text
          label="Image"
          value={text}
          setValue={setText}
          placeholder="img url"
        />
      </div>
      <Button_Generic onClick={doIt} label={loading ? "Loading..." : "Go"} />
      {confidence && (
        <h1 className="text-xl">
          {(confidence * 100).toFixed(1) + "% "}
          similar to the average Chalamet.
        </h1>
      )}
      {text !== "" && confidence && (
        <div className="flex gap-6 items-center py-12">
          <img
            src={text}
            alt="Input image value"
            width={144}
            className="object-cover rounded-md aspect-square"
          />
        </div>
      )}
    </div>
  );
}
