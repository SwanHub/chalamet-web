"use client";

import { useState } from "react";
import { Button_Generic } from "@/components/shared/Button_Generic";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid"; // npm install uuid

export default function TestImageUpload() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Sample base64 image (a small red dot, for testing purposes)
  const SAMPLE_BASE64 =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

  // Convert base64 to blob for storage upload
  const base64ToBlob = async (base64Data: string): Promise<Blob> => {
    // Remove the data URL prefix if it exists
    const base64 = base64Data.includes("base64,")
      ? base64Data.split("base64,")[1]
      : base64Data;

    // Decode base64 to binary
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);

    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Create and return Blob
    return new Blob([bytes], { type: "image/png" });
  };

  const uploadImage = async (): Promise<void> => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    setUploadedUrl(null);

    try {
      // Step 1: Convert base64 to blob
      console.log("Converting image to blob...");
      const blob = await base64ToBlob(SAMPLE_BASE64);

      // Step 2: Generate unique filename
      const fileName = `test-${uuidv4()}.png`;
      console.log("Generated filename:", fileName);

      // Step 3: Upload to Supabase Storage
      console.log("Uploading to Supabase Storage...");
      const { data: storageData, error: storageError } = await supabase.storage
        .from("images") // Your bucket name
        .upload(fileName, blob, {
          contentType: "image/png",
          cacheControl: "3600",
        });

      console.log("Upload response:", storageData);

      if (storageError) {
        console.error("Storage error:", storageError);
        throw storageError;
      }

      // Step 4: Get the public URL
      console.log("Getting public URL...");
      const {
        data: { publicUrl },
      } = supabase.storage.from("images").getPublicUrl(fileName);

      console.log("Public URL:", publicUrl);
      setUploadedUrl(publicUrl);

      // Success
      setSuccess(true);
    } catch (err: any) {
      console.error("Error in upload process:", err);
      setError(err.message || "Failed to upload image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-violet-50 w-full">
      <h1 className="text-xl font-bold text-center mb-8 text-gray-800">
        Test Image Upload to Supabase Storage
      </h1>

      <div className="w-full mb-6">
        <p className="text-sm text-gray-600 mb-2">
          This will upload a sample image to your Supabase Storage bucket.
        </p>
        {SAMPLE_BASE64 && (
          <div className="w-full flex justify-center mb-4">
            <img
              src={SAMPLE_BASE64}
              alt="Sample"
              className="border-2 border-gray-300"
              style={{ width: "100px", height: "100px" }}
            />
          </div>
        )}
      </div>

      <Button_Generic
        onClick={uploadImage}
        label={loading ? "Uploading..." : "Upload Test Image"}
      />

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg w-full">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      )}

      {/* Success message */}
      {success && uploadedUrl && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg w-full">
          <p className="font-bold">Success!</p>
          <p className="break-all">Image uploaded to: {uploadedUrl}</p>
          <div className="mt-2">
            <a
              href={uploadedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              View uploaded image
            </a>
          </div>
        </div>
      )}

      {/* Debug Info */}
      <div className="mt-6 p-3 bg-gray-100 border border-gray-300 rounded-lg w-full text-xs">
        <p className="font-bold">Debug Info:</p>
        <p>Check your browser console for detailed logging.</p>
        <p className="mt-1">
          Make sure you have a bucket named 'images' in your Supabase Storage.
        </p>
        <p className="mt-1">
          Make sure the bucket has the right permissions (RLS policies).
        </p>
      </div>
    </div>
  );
}
