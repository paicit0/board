"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

export default function ThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await fetch(`/api/threads/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        if (data.success) {
          setThread(data.data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        setError("Error fetching thread");
      }
    };

    if (id) {
      fetchThread();
    }
  }, [id]);

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="flex items-center justify-center min-h-screen">Loading...</p>
      </div>
    );
  }

  return (
    <main className="flex flex-col items-center justify-start min-h-screen p-10 bg-gray-100">
      <Link className="bg-green-500 w-fit text-sm text-white py-3 px-5 rounded-md mb-10" href="/">Back to Home</Link>
      <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
        <div className="p-10 border-b flex flex-col">
          <h2 className="text-3xl font-bold break-words mb-4">{thread.title}</h2>
          <p className="font-bold text-red-500">{thread.threadId}</p>
          <p className="text-gray-600 break-words mb-4">{thread.threadContent}</p>
          {thread.file && <img src={thread.file} alt="Thread file" className="mb-4 max-w-full h-auto" />}
          <p className="mb-2">Replies: {thread.replyCount}</p>
          <p className="text-sm text-gray-400 mt-auto mb-4">Date: {new Date(thread.createdAt).toLocaleString()}</p>
          <div className="flex items-center justify-center space-x-4">
            <span className="text-green-500">{thread.threadUpvotes}</span>
            <span className="text-red-500">{thread.threadDownvotes}</span>
          </div>
        </div>
      </div>
    </main>

  );
}
