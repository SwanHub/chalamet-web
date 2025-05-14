"use client";

import { Button_Generic } from "@/components/shared/Button_Generic";
import { useState } from "react";
import { fetchCLIPConfidence } from "../_api/api";
import { Input_Text } from "@/components/shared/Input_Text";

export default function TextToImageSimilarity() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const doIt = async () => {
    setLoading(true);
    try {
      const response: any = await fetchCLIPConfidence(text);
      setConfidence(response.outputs[0].clip_comparison.similarities[0]);
    } catch (error) {
      console.log("error: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-cyan-50 w-full">
      <h1 className="text-xl font-bold text-center mb-8 text-gray-800">
        {"CLIP text <> image cosine similarity"}
      </h1>
      <div className="flex w-full pb-6">
        <Input_Text
          label="Input image url"
          value={text}
          setValue={setText}
          placeholder="Enter image url"
        />
      </div>
      <Button_Generic
        onClick={doIt}
        label={loading ? "Loading..." : "Click to infer"}
      />
      <div className="flex gap-6 items-center py-12">
        {text !== "" && confidence && (
          <img
            src={text}
            alt="Input image value"
            width={72}
            className="object-contain rounded-md"
          />
        )}
        {confidence && (
          <h1 className="text-xl">
            {(confidence * 100).toFixed(1) + "% "}
            similar to Timothée Chalamet.
          </h1>
        )}
      </div>
    </div>
  );
}
