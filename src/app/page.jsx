"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();

  const handleSubmit = async (e) => {

    

}


  return (
    <main>
      
      <div className="flex-grow text-center p-10">
        <Link onSubmit= {handleSubmit} className='bg-green-500 w-fit text-sm text-white py-5 px-5 rounded-md mt-2' href="/createThread">+</Link>
        <div className="flex justify-center my-10">
        </div>

      </div>
    </main>
  );
}
