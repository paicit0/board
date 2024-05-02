import React, { useState } from 'react';
import Link from 'next/link';

const LoginPage = () => {
  return (
    <div className= 'bg-red-300'>
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
    </div>  
    )}

export default LoginPage
