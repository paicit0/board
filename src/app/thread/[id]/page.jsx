"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Reply from "@/components/Reply";

export default function ThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);
  const [enlargedImages, setEnlargedImages] = useState({});

  useEffect(() => {
    const fetchThread = async () => {
      try {
        const response = await fetch(`/api/threads/${id}`);
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        const data = await response.json();

        console.log(data); // Log the fetched data

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

  const toggleImageSize = (imageId) => {
    setEnlargedImages((prev) => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = date.toLocaleDateString('en-US', options);
    const formattedTime = date.toLocaleTimeString('en-US');
    return `${formattedDate} ${formattedTime}`;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex flex-col items-center justify-start flex-grow p-10 bg-gray-100 pb-20">
        <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
          <div className="p-8 border-b flex flex-col">
            <div className="flex items-center justify-between">
              <p className="text-red-500">No. {thread.threadId}</p>
              <p className="text-black text-right">{formatDate(thread.createdAt)}</p>
            </div>
            <h2 className="text-3xl break-words">{thread.title}</h2>
            <p className="text-black break-words mb-4">{thread.threadContent}</p>
            {thread.file && (
              <img
                src={thread.file}
                alt="Thread file"
                className={`mb-4 image-container ${enlargedImages[thread.threadId] ? 'w-full h-full' : 'w-32 h-32'}`}
                onClick={() => toggleImageSize(thread.threadId)}
              />
            )}
            <p className="mb-2 text-right">Reply: {thread.replyCount}</p>
          </div>
          {thread.threadFileUrl && (
            <div className="image-container my-2">
              <img
                src={thread.threadFileUrl}
                alt="Thread Image"
                className={`max-w-full h-auto rounded-lg shadow-lg ${enlargedImages[thread.threadFileUrl] ? 'w-full h-full' : 'w-32 h-32'}`}
                onClick={() => toggleImageSize(thread.threadFileUrl)}
              />
            </div>
          )}
          <div className="w-full p-6 pt-2">
            <h3 className="text-2xl mb-4">Reply</h3>
            {thread.replies ? (
              <ul className="space-y-4">
                {thread.replies.map((reply) => (
                  <li key={reply._id} className="p-4 bg-gray-200 rounded-md break-words whitespace-pre-wrap">
                    <p className="text-red-500">No. {reply.replyId}</p>
                    {reply.replyFileUrl && (
                      <div className="image-container my-2">
                        <img
                          src={reply.replyFileUrl}
                          alt="Reply Image"
                          className={`max-w-full h-auto rounded-lg shadow-lg ${enlargedImages[reply.replyFileUrl] ? 'w-full h-full' : 'w-32 h-32'}`}
                          onClick={() => toggleImageSize(reply.replyFileUrl)}
                        />
                      </div>
                    )}
                    <p className="text-black">{reply.replyContent}</p>
                    <p className="text-black text-right">{formatDate(reply.createdAt)}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No replies yet.</p>
            )}
          </div>
          <Reply threadId={thread.threadId} />
        </div>
      </main>
    </div>
  );
}
