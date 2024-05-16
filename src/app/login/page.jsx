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

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid credentials");
        setSuccess("");
        return;
      }

      setError("");
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        router.replace("/welcome");
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
          <h3 className="text-3xl">Login Page</h3>
          <hr className="my-3" />
          {error && (
            <div className="bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2">
              {success}
            </div>
          )}
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
              className="bg-green-500 text-white border py-2 px-3 rounded text-lg my-2"
            >
              Sign In
            </button>
          </form>
          <hr className="my-3" />
          <p>
            Go to{" "}
            <Link href="/register" className="text-blue-500 hover:underline">
              Register
            </Link>{" "}
            Page
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
