import React from "react";
import { SignUpForm } from "./components/signUpForm";


export default function SignUpPage(){
  return (
    <div className="flex flex-col space-y-2 px-4 justify-center items-center min-h-screen w-full">
      <SignUpForm />
      <div className="w-full max-w-md mx-auto mb-4 p-3 text-sm text-blue-800 bg-blue-50 border border-blue-200 rounded-md">
        <strong>Note:</strong> If you sign up using your email, please check
        your inbox for the registration link to complete your account setup.
      </div>
    </div>
  );
}