"use client";

import { Button_Generic } from "@/components/shared/Button_Generic";
import { createVectorEmbOfImage, testEdgeFunction } from "../_api/api";
import { Input_Text } from "@/components/shared/Input_Text";
import { useState } from "react";
import {
  createBaseComparison,
  uploadImageToBaseComparisons,
} from "../_api/baseComparison";
import { v4 as uuidv4 } from "uuid";
import { imageUrlToBlob } from "@/lib/utils";

export default function Leaderboard() {
  // part 1
  const [inputImageUrl, setInputImageUrl] = useState<string>("");
  const [supabaseImageUrl, setSupabaseImageUrl] = useState<string | null>(null);
  // part 2
  const [embedding, setEmbedding] = useState<number[] | null>(null);
  // part 3
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  async function createNewImage() {
    try {
      const blob = await imageUrlToBlob(inputImageUrl);
      const fileName = `${uuidv4()}.jpg`;
      const newImageUrl = await uploadImageToBaseComparisons(blob, fileName);
      if (newImageUrl) {
        setSupabaseImageUrl(newImageUrl);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function setImageEmbedding() {
    if (supabaseImageUrl) {
      const embedding = await createVectorEmbOfImage(supabaseImageUrl);
      if (embedding) {
        setEmbedding(embedding);
      }
    }
  }
  async function saveBaseComparison() {
    if (embedding && supabaseImageUrl) {
      const res = await createBaseComparison(
        name,
        description,
        embedding,
        supabaseImageUrl
      );
      console.log(res);
    }
  }

  return (
    <div className="flex flex-col max-w-screen-lg justify-center gap-12">
      <div className="flex flex-col">
        <Button_Generic
          label="Test edge function access"
          onClick={testEdgeFunction}
        />
      </div>

      {/* part 1: create new image */}
      {/* <div className="flex flex-col">
        <div className="flex w-full pb-6">
          <Input_Text
            label="Initial image url"
            value={inputImageUrl}
            setValue={setInputImageUrl}
            placeholder="img url"
          />
        </div>
        <img src={inputImageUrl} className="aspect-video w-128 object-cover" />
        <Button_Generic
          label="Save image to our bucket"
          onClick={createNewImage}
        />
      </div> */}

      {/* part 2: create vector embedding of said image */}
      {/* {supabaseImageUrl && (
        <div>
          <Button_Generic
            label="Get and save image embedding"
            onClick={setImageEmbedding}
          />
          <p>Embedding, printed (to check): {JSON.stringify(embedding)}</p>
        </div>
      )} */}

      {/* part 3: given a vector embedding and imageUrl, insert value to our "base_comparisons" table */}
      {/* {embedding && (
        <div>
          <div className="flex w-full pb-6">
            <Input_Text
              label="Name"
              value={name}
              setValue={setName}
              placeholder="img url"
            />
          </div>
          <div className="flex w-full pb-6">
            <Input_Text
              label="Description"
              value={description}
              setValue={setDescription}
              placeholder="img url"
            />
          </div>
          <Button_Generic
            label="Create base comparison"
            onClick={saveBaseComparison}
          />
        </div>
      )} */}
    </div>
  );
}
