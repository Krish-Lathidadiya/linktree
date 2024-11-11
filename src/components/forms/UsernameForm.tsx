"use client";

import handleFormSubmit from "@/actions/grabUsername";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { RightIcon } from "../../../public/icons";

function UsernameForm({
  desiredUsername,
}: {
  desiredUsername: string | undefined;
}) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const username = formData.get("username") as string | null;

    if (!username) {
      setErrorMessage("Please enter a username.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await handleFormSubmit(formData);
      if (result?.status === "success") {
        router.push(result.redirectUrl || "/");
      } else if (result.status === "error") {
        setErrorMessage(result.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Unexpected error", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} method="POST">
      <h1 className="text-4xl font-bold text-center mb-2">
        Grab Your Username
      </h1>
      <p className="text-center mb-6 text-gray-500">Choose Your username</p>
      <div className="max-w-xs mx-auto">
        <input
          type="text"
          name="username"
          placeholder="username"
          defaultValue={desiredUsername}
          className="block p-2 mx-auto border w-full mb-2 text-center"
        />
        {errorMessage && (
          <div className="bg-red-200 border border-red-500 p-2 mb-2 text-center">
            {errorMessage}
          </div>
        )}
        <button
          type="submit"
          disabled={isLoading}
          className={`bg-blue-500 text-white py-2 px-4 mx-auto w-full flex items-center justify-center 
            ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-105 transition-transform duration-150 hover:gap-1"
            }`}
        >
          <span>{isLoading ? "Processing..." : "Claim username"}</span>
          {!isLoading && <RightIcon className="w-5 h-5 ml-2" />}
        </button>
      </div>
    </form>
  );
}

export default UsernameForm;
