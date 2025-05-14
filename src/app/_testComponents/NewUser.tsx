"use client";

import { Button_Generic } from "@/components/shared/Button_Generic";
import { useState } from "react";
import { Input_Text } from "@/components/shared/Input_Text";
import { supabase } from "@/lib/supabase";

export default function NewUser() {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const createNewUser = async () => {
    // Reset states
    setError(null);
    setSuccess(false);

    // Validate input
    if (!text.trim()) {
      setError("Please enter a name");
      return;
    }

    try {
      setLoading(true);

      // Insert new user into the users table using supabase client
      const { data, error: insertError } = await supabase
        .from("users")
        .insert([{ name: text.trim() }]);

      if (insertError) {
        throw insertError;
      }
      console.log("response: ", data);

      // Success message
      setSuccess(true);
      setText(""); // Clear input
      console.log("User created successfully");
    } catch (err: any) {
      console.error("Error creating user:", err);
      setError(err.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-cyan-50 w-full">
      <h1 className="text-xl font-bold text-center mb-8 text-gray-800">
        {"Test - Create New User"}
      </h1>

      <div className="flex w-full pb-6">
        <Input_Text
          label="Enter name"
          value={text}
          setValue={setText}
          placeholder="Name"
          disabled={loading}
        />
      </div>

      <Button_Generic
        onClick={createNewUser}
        label={loading ? "Loading..." : "Submit"}
      />

      {/* Error message */}
      {error && (
        <div className="mt-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg w-full">
          {error}
        </div>
      )}

      {/* Success message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg w-full">
          User created successfully!
        </div>
      )}
    </div>
  );
}
