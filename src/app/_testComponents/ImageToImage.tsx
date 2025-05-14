"use client";

import { useState } from "react";
import { fetchCLIPImage2Image } from "../_api/api";
import { Button_Generic } from "@/components/shared/Button_Generic";
import { Input_Text } from "@/components/shared/Input_Text";

export default function ImageToImageSimilarity() {
  const [loading, setLoading] = useState(false);
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [confidence, setConfidence] = useState<number | null>(null);
  const doIt = async () => {
    setLoading(true);
    try {
      const response: any = await fetchCLIPImage2Image(text1, text2);
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
        {"CLIP image <> image cosine similarity"}
      </h1>
      <div className="flex w-full pb-6">
        <Input_Text
          label="Image 1"
          value={text1}
          setValue={setText1}
          placeholder="img url"
        />
      </div>
      <div className="flex w-full pb-6">
        <Input_Text
          label="Image 2"
          value={text2}
          setValue={setText2}
          placeholder="img url"
        />
      </div>
      <Button_Generic onClick={doIt} label={loading ? "Loading..." : "Go"} />
      {confidence && (
        <h1 className="text-xl">
          {(confidence * 100).toFixed(1) + "% "}
          similar to each other.
        </h1>
      )}
      {text1 !== "" && text2 !== "" && confidence && (
        <div className="flex gap-6 items-center py-12">
          <img
            src={text1}
            alt="Input image value"
            width={144}
            className="object-cover rounded-md aspect-square"
          />
          <img
            src={text2}
            alt="Input image value"
            width={144}
            className="object-cover rounded-md aspect-square"
          />
        </div>
      )}
    </div>
  );
}
