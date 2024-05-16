"use client";
import React, { useState } from 'react';
import Link from "next/link";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { data: session } = useSession();
  const router = useRouter();
  
  if (session) router.replace('/welcome');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    if (!email || !password || !confirmPassword) {
      setError("Please complete all inputs.");
      return;
    }

    const resCheckUser = await fetch("http://localhost:3000/api/checkUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email })
    });

    const { user } = await resCheckUser.json();

    if (user) { 
      setError("User already exists.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      if (res.ok) {
        setError("");
        setSuccess("User registration successful! Redirecting...");
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
          <h3 className='text-3xl'>Register Page</h3>
          <hr className='my-3' />
          <form onSubmit={handleSubmit}>
            {error && (
              <div className='bg-red-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {error}
              </div>
            )}
            {success && (
              <div className='bg-green-500 w-fit text-sm text-white py-1 px-3 rounded-md mt-2'>
                {success}
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
            <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Sign Up</button>
          </form>
          <hr className='my-3' />
          <p>Go to <Link href="/login" className='text-blue-500 hover:underline'>Login</Link> Page</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
