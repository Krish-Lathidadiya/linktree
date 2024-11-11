"use client";

import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import React, { FormEvent, useEffect, useState } from "react";

function HeroForm() {
  const [username, setUserName] = useState("");

  useEffect(() => {
    const storedUsername: string | null =
      window.localStorage.getItem("desiredUserName");
    if (storedUsername !== null) {
      window.localStorage.removeItem("desiredUserName");
      redirect("/account?desiredUsername=" + storedUsername);
    }
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log(username);

    if (username.length > 0) {
      window.localStorage.setItem("desiredUserName", username);
      signIn("google")
        .then(() => {
          console.log("Sign-in successful");
        })
        .catch((error) => {
          console.error("Sign-in failed:", error);
        });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="inline-flex shadow-lg shadow-gray-700/20 items-center"
    >
      <span className="bg-white py-4 pl-4">lnklist.to/</span>
      <input
        value={username}
        onChange={(e) => setUserName(e.target.value)}
        type="text"
        className="py-4 focus:outline-none"
        placeholder="username"
        style={{ backgroundColor: "white", marginBottom: 0, paddingLeft: 0 }}
      />
      <button
        type="submit"
        className="bg-blue-500 py-4 px-6 text-white whitespace-nowrap"
      >
        Join for Free
      </button>
    </form>
  );
}

export default HeroForm;
