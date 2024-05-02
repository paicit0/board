import React from 'react';
import Link from "next/link";

const LoginPage = () => {
  return (
    <div className= 'bg-red-300 container mx-auto columns-1'>
      <p className='text-center'>Login</p>
      <form className='flex flex-col'>
        <label className='text-center'>
          Username:
          <input type="text" username="Username" />
        </label>
        <label className='text-center'>
          Password:
          <input type="text" password="Password" />
        </label>
        <input type="submit" value="Submit" className='bg-blue-300'/>
      </form>
      <div className='text-right'>
        <Link href='/register'>Register</Link>
      </div>
    </div>  
    )}

export default LoginPage
