"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next"
import Link from "next/link";



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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon"
    const datePart = date.toLocaleDateString('en-US'); // "5/27/2024"
    const timePart = date.toLocaleTimeString('en-US'); // "5:33:06 PM"
    return `${day}, ${datePart} ${timePart}`; // "Mon, 5/27/2024 5:33:06 PM"
  };
  

  return (
    <main>
      <div className="flex-grow text-center p-10">
        
        <Link className='bg-green-500 w-fit text-sm text-white py-3 px-5 rounded-md mt-2' href="/createThread">Submit Thread</Link>
        <div className="flex justify-center my-10">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
            {threads.map((thread) => (
              <div key={thread.threadId} className="p-5 border flex flex-col"> 
                <p>Reply: {thread.replyCount}</p>
                <Link href={`/thread/${thread.threadId}`}>
                  <h2 className="text-2xl font-bold break-words line-clamp-4">{thread.title}</h2>
                </Link>
                <p className="text-black break-words line-clamp-6">{thread.threadContent}</p>
                <p className="text-sm text-black text-center mt-auto pt-4 ">{formatDate(thread.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}