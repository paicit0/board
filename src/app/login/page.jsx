import React from 'react';
import Link from "next/link";

const LoginPage = () => {
  return (
<div className='flex-grow'>
      <div className="flex justify-center items-center">
        <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
          <h3 className='text-3xl'>Login Page</h3>
          <hr className='my-3' />
          <form>
            <input type="text" className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your email' />
            <input type="password" className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2' placeholder='Enter your password' />
            <button type='submit' className='bg-green-500 text-white border py-2 px-3 rounded text-lg my-2'>Sign in</button>
          </form>
          <hr className='my-3' />
          <p><Link href="/register" className='text-blue-500 hover:underline text-right'>Register</Link> Page</p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
