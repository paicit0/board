"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next"


export default function Home() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/createThread'); 
        const data = await response.json();
        setThreads(data);
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    };

    fetchThreads();
  }, []);

  return (
    <main>
      <div className="flex-grow text-center p-10">
        <Link className='bg-green-500 w-fit text-sm text-white py-3 px-5 rounded-md mt-2' href="/createThread">Submit Thread</Link>
        <div className="flex justify-center my-10">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
            {threads.map((thread) => (
              <div key={thread._id} className="p-5 border-b flex flex-col">
                <h2 className="text-2xl font-bold break-words line-clamp-4">{thread.title}</h2>
                <p className="text-gray-600 break-words line-clamp-6">{thread.threadContent}</p>
                <p className="text-sm text-gray-400 mt-auto">Date: {new Date(thread.createdAt).toLocaleString()}</p>
                <div className="flex items-center justify-center">
                  <span className="text-green-500">{thread.threadUpvotes}</span>
                  <span className="text-red-500 ml-4">{thread.threadDownvotes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}