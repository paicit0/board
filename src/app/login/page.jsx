"use client";

import React, { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // Prevent multiple submissions

    setSubmitting(true); // Disable further submissions

    if (!email || !password) {
      setError("Please complete all inputs.");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Wrong Email or Password.");
        setSuccess("");
        return;
      }

      setError("");
      setSuccess("Login successful. Redirecting...");

      setTimeout(() => {
        router.replace("/");
      }, 2000);
    } catch (error) {
      console.log(error);
      setError("An error occurred. Please try again.");
      setSuccess("");
    }
  };

  return (
    <div className="flex-grow">
      <div className="flex justify-center items-center">
        <div className="w-[400px] shadow-xl p-10 mt-5 rounded-xl">
          {error && (
            <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          <h3 className="text-3xl text-center">Login</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Enter your email"
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2"
              placeholder="Enter your password"
            />

            <button
              type="submit"
              className={`w-full py-2 px-3 rounded text-lg my-2 ${success ? "bg-green-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              disabled={success}
            >
              {success || "Sign In"}
            </button>
          </form>
          {!success && <Link href="/register" className="hover:underline text-right font-semibold">Register</Link>}
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
