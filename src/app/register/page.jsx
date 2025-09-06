"use client";
import React, { useState, useEffect } from 'react';
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();
  
  useEffect(() => {
    if (session) {
      router.replace('/welcome');
    }
  }, [session, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // Prevent multiple submissions

    setSubmitting(true); // Disable further submissions

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError("Please complete all inputs.");
      return;
    }

    if (password.length < 8) {
      setError("Password needs to be longer than 8 characters")
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const { message } = await res.json();

      if (message === "User already exists.") {
        setError("User already exists.");
        return;
      }

      if (res.ok) {
        setError("");
        setSuccess("Registration completed, Redirecting...");
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
      } else {
        setError("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className='flex-grow'>
      <div className="flex justify-center items-center">
        <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
          <h3 className='text-3xl text-center'>Register</h3>
          <form onSubmit={handleSubmit}>
            {error && (
              <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {error}
              </div>
            )}
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
              placeholder='Enter your email'
            />
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
              placeholder='Enter your password'
            />
            <input
              type="password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
              placeholder='Confirm your password'
            />
            <button
              type="submit"
              className={`w-full py-2 px-3 rounded text-lg my-2 ${success ? "bg-green-500 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
              disabled={success}
            >
              {success || "Register"}
            </button>          
          </form>
          {!success && <Link href="/login" className='hover:underline font-semibold'>Login</Link>}
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
