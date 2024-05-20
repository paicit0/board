"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";


export default function Home() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);

  useEffect(() => {
    const fetchThreads = async () => {
      try {
        const response = await fetch('/api/createThread'); // Adjust the path if necessary
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
        <Link className='bg-green-500 w-fit text-sm text-white py-5 px-5 rounded-md mt-2' href="/createThread">+</Link>
        <div className="flex justify-center my-10">
          <div className="w-full max-w-2xl">
            {threads.map((thread) => (
              <div key={thread._id} className="p-5 border-b">
                <h2 className="text-2xl font-bold">{thread.title}</h2>
                <p className="text-gray-600">{thread.threadContent}</p>
                <p className="text-sm text-gray-400">Created at: {new Date(thread.createdAt).toLocaleString()}</p>
                <div className="flex items-center">
                  <span className="text-green-500">Upvotes: {thread.threadUpvotes}</span>
                  <span className="text-red-500 ml-4">Downvotes: {thread.threadDownvotes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}