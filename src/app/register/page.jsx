"use client"
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Link from "next/link";


const RegisterPage = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if ((password !== confirmPassword) && (!name || !password || !confirmPassword)) {
      setError("Passwords do not match! Please enter all information.");
      return;
    }

    if (password != confirmPassword) {
      setError("Passwords do not match!")
      return;
    }

    if (!name || !password || !confirmPassword) {
      setError("Please enter all information")
      return;
    }

  }

  return (
    <div className= 'bg-red-300 container mx-auto columns-1'>
      <p className='text-center'>Register</p>
      <form onSubmit={handleSubmit} className='flex flex-col'>
        {error && (
          <div className="bg-red-500"> 
            {error}
          </div>
        )}
        <label className='text-center'>
          Username:
          <input onChange={(e) => setName(e.target.value)} type="text" username="Username" placeholder='Enter your username' />
        </label>
        <label className='text-center'>
          Password:
          <input onChange={(e) => setPassword(e.target.value)} type="password" password="Password" placeholder='Enter your password' />
        </label>
        <label className='text-center'>
        Confirm your password:
          <input onChange={(e) => setConfirmPassword(e.target.value)} type="password" password="Password" placeholder='Confirm your password' />
        </label>
        <input type="submit" value="Register" className='bg-blue-300'/>
      </form>
    </div>  
    )}

export default RegisterPage
