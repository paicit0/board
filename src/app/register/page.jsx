import React from 'react';
import Link from "next/link";

const RegisterPage = () => {
  return (
    <div className= 'bg-red-300 container mx-auto columns-1'>
      <p className='text-center'>Register</p>
      <form className='flex flex-col'>
        <label className='text-center'>
          Username:
          <input type="text" username="Username" />
        </label>
        <label className='text-center'>
          Password:
          <input type="text" password="Password" />
        </label>
        <input type="submit" value="Register" className='bg-blue-300'/>
      </form>
    </div>  
    )}

export default RegisterPage
