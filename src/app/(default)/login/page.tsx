import LoginWithGoogle from "@/components/buttons/LoginWithGoogle";
import React from "react";


function Login() {
  return (
    <div className="items-center">
      <div className=" p-4 max-w-sm mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4">Sign In</h1>
        <p className="text-center mb-3 text-gray-600 ">
          Sign in your account using one of the methods below{" "}
        </p>
       <LoginWithGoogle/>
      </div>
    </div>
  );
}

export default Login;
