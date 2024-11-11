"use client";

import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa";

export default function LoginWithGoogle() {

  return (
    <button
      onClick={() => signIn('google')}
      className="flex items-center justify-center  w-full py-4 rounded shadow font-medium shadow-black/20"
      aria-label="Sign in with Google"
    >
      <FaGoogle className="w-6 h-6 mr-2" />
      <span>Sign In with Google</span>
    </button>
  );
}
