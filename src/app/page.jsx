"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Tooltip } from 'react-tooltip';
import { formatDistanceToNow } from 'date-fns';

export default function Home() {
  const { data: session } = useSession();
  const [threads, setThreads] = useState([]);
  const [hoveredImageSrc, setHoveredImageSrc] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [sortOption, setSortOption] = useState('date-desc');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchThreads = async () => {
    try {
      const response = await fetch('/api/getThread'); 
      const data = await response.json();
      setThreads(data);
    } catch (error) {
      console.error("Error fetching threads:", error);
    }
  }

  const fetchSession = async () => {
    try {
      const response = await fetch('/api/auth/session');
      const session = await response.json();
    }
   catch (error) {
    console.error("Error fetching threads:", error);
    }
  }

  useEffect(() => {
    fetchThreads();
    fetchSession();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = String(date.getMonth() + 1).padStart(2, '0'); 
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); 
    const timePart = date.toLocaleTimeString('en-US', { hour12: false });

    return `${month}/${dayOfMonth}/${year}(${day})\n${timePart}`;
  };

  const getRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
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

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };


  const sortThreads = (threads, option) => {
    switch (option) {
      case 'date-asc':
        return [...threads].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'date-desc':
        return [...threads].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'reply-asc':
        return [...threads].sort((a, b) => a.replyCount - b.replyCount);
      case 'reply-desc':
        return [...threads].sort((a, b) => b.replyCount - a.replyCount);
      case 'bump-order':
        return [...threads].sort((a, b) => new Date(b.latestReplyAt) - new Date(a.latestReplyAt));
      default:
        return threads;
    }
  };
  
  const sortedThreads = sortThreads(threads, sortOption);

  // const handleAuthenticate = () => {
  //   if (session.user.role===admin) {
  //     setAuthenticated(true);
  //   } else {
  //     setAuthenticated(false);
  //   }

  // }

  const handleDelete = async (threadId) => {
    console.log("Trying to delete threadId: ", threadId);

    const data = { threadId };

    try {
      const response = await fetch('/api/deleteThread', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      fetchThreads();

      const result = await response.json();

      if (response.ok) {
        console.log("Delete is working.", result.message);
      } else {
        console.error("Delete Error.", result.error);
      }

  } catch (error) {
    console.error("Network Error:", error);

  }

}

  return (
    <main onMouseMove={handleMouseMove}>
      {/* <button onClick={handleAuthenticate}>HEY</button> */}
      <div className="flex-grow text-center p-10">
        <Link className='bg-green-500 hover:bg-green-600 w-fit text-sm text-white py-3 px-5 rounded-md mt-2' href="/createThread">Submit a Thread</Link>
        <div className="flex justify-between items-center my-10">
          <div className="w-full max-w-8xl">
            <label htmlFor="sort" className="mr-2">Sort by:</label>
            <select id="sort" value={sortOption} onChange={handleSortChange} className="p-2 border rounded">
              <option value="date-desc">Date (Newest)</option>
              <option value="date-asc">Date (Oldest)</option>
              <option value="reply-asc">Replies (Fewest)</option>
              <option value="reply-desc">Replies (Most)</option>
              <option value="bump-order">Bump Order</option>
            </select>
          </div>
        </div>
        <div className="flex justify-center my-10">
          <div className="w-full max-w-8xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-4">
            {sortedThreads.map((thread) => (
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
                <p id={`thread-date-${thread.threadId}`} className="text-sm text-black text-center mt-auto pt-4" data-tooltip-id={`tooltip-thread-date-${thread.threadId}`} style={{ display: 'inline-block' }}>
                  {formatDate(thread.createdAt)}
                </p>
                <Tooltip id={`tooltip-thread-date-${thread.threadId}`} clickable place="top">
                  {getRelativeTime(thread.createdAt)}
                </Tooltip>
                {session?.user?.role==="admin" ? (
                  <div> 
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded">Edit</button>
                    <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" onClick={()=>handleDelete(thread.threadId)}>Delete</button>
                  </div>) 
                  : (null)
                  }
              </div>
            ))}
          </div>
        </div>
      </div>
      {hoveredImageSrc && (
        <div
          className="fixed z-50"
          style={{
            left: cursorPosition.x + 300 > window.innerWidth ? 'auto' : `${cursorPosition.x + 20}px`,
            right: cursorPosition.x + 300 > window.innerWidth ? `${window.innerWidth - cursorPosition.x + 20}px` : 'auto',
            top: `50%`,
            transform: `translateY(-50%)`,
            width: 'auto', // Fixed width
            height: '100vh', // Auto height to maintain aspect ratio
            maxWidth: '100%', // Ensure it doesn't overflow the width of the viewport
            maxHeight: '100vh', // Ensure it doesn't overflow the height of the viewport
          }}
        >
          <img 
            src={hoveredImageSrc} 
            alt="Hovered Image" 
            className="object-contain"
            style={{
              height: '100%', // Maintain aspect ratio
              width: '100%', // Ensure it scales within the fixed size container
            }}
          />
        </div>
      )}
    </main>
  );

}
