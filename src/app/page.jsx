"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [hoveredImageSrc, setHoveredImageSrc] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

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
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const datePart = date.toLocaleDateString('en-US');
    const timePart = date.toLocaleTimeString('en-US');
    return `${day}, ${datePart} ${timePart}`;
  };

  const handleMouseEnter = (src) => {
    setHoveredImageSrc(src);
  };

  const handleMouseLeave = () => {
    setHoveredImageSrc(null);
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
  };

  return (
    <main onMouseMove={handleMouseMove}>
      <div className="flex-grow text-center p-10">
        <Link className='bg-green-500 hover:bg-green-600 w-fit text-sm text-white py-3 px-5 rounded-md mt-2' href="/createThread">Submit a Thread</Link>
        <div className="flex justify-center my-10">
          <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-8 gap-4">
            {threads.map((thread) => (
              <div key={thread.threadId} className="p-5 border flex flex-col relative">
                {thread.threadThumbnailFileUrl && thread.threadFileUrl && (
                  <div 
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(thread.threadFileUrl)}
                    onMouseLeave={handleMouseLeave}
                  >
                  <Link href={`/thread/${thread.threadId}`}>
                    <img 
                      src={thread.threadThumbnailFileUrl} 
                      alt="Thread Thumbnail" 
                      className="my-2 max-w-full h-auto rounded-lg shadow-lg"
                    />
                  </Link>
                  </div>
                )}
                <p>Reply: {thread.replyCount}</p>
                <h2 className="text-2xl font-bold break-words line-clamp-4">{thread.title}</h2>
                <p className="text-black break-words line-clamp-6">{thread.threadContent}</p>
                <p className="text-sm text-black text-center mt-auto pt-4">{formatDate(thread.createdAt)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      {hoveredImageSrc && (
        <div
          className="fixed z-50"
          style={{
            left: `${cursorPosition.x + 20}px`,
            top: `50%`,
            transform: `translateY(-50%)`
          }}
        >
          <img 
            src={hoveredImageSrc} 
            alt="Hovered Image" 
            className="object-contain"
            style={{
              maxHeight: '100vh', // Ensure it fills the screen height-wise
              maxWidth: 'calc(100vw - 40px)', // Ensure it doesn't overflow the width of the viewport
            }}
          />
        </div>
      )}
    </main>
  );
}
