"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Reply from "@/components/Reply";
import { Tooltip } from 'react-tooltip';
import { formatDistanceToNow } from 'date-fns';

export default function ThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [error, setError] = useState(null);
  const [enlargedImages, setEnlargedImages] = useState({});
  const [hoveredImageSrc, setHoveredImageSrc] = useState(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [replyTo, setReplyTo] = useState(null);

  const handleReply = (replyId) => {
    setReplyTo(replyTo === replyId ? null : replyId); // Toggle reply form visibility
    console.log("Replying to:", replyId, "In the thread:", thread.threadId, replies)
  };

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

  const handleMouseEnter = (src) => {
    setHoveredImageSrc(src);
  };

  const handleMouseLeave = () => {
    setHoveredImageSrc(null);
  };

  const handleMouseMove = (e) => {
    setCursorPosition({ x: e.clientX, y: e.clientY });
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
  
    // Extract date parts
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Last two digits of the year
  
    // Extract time parts
    const timePart = date.toLocaleTimeString('en-US', { hour12: false });
  
    return `${month}/${dayOfMonth}/${year}(${day}) ${timePart}`;
  };

  const getRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };


  return (
    <div className="flex flex-col min-h-screen" onMouseMove={handleMouseMove}>
      <main className="flex flex-col items-center justify-start flex-grow p-10 bg-gray-100 pb-20">
        <div className="w-full max-w-6xl bg-white shadow-lg rounded-lg">
          <div className="p-8 border-b flex flex-col">
            <div className="flex items-center justify-between">
              <div className="flex space-x-1">
                <p id={`thread-date-${thread.threadId}`} className="text-black text-left" data-tooltip-id={`tooltip-thread-date-${thread.threadId}`} style={{ display: 'inline-block' }}>
                  {formatDate(thread.createdAt)}
                </p>
                <Tooltip id={`tooltip-thread-date-${thread.threadId}`} clickable place="top">
                  {getRelativeTime(thread.createdAt)}
                </Tooltip>
                <p className="text-red-500">No. {thread.threadId}</p>
              </div>
            </div>
            <h2 className="text-3xl mb-4 mt-2 break-words">{thread.title}</h2>
            {/* Thread Img*/}
            <div className="flex items-start mb-4">
              {thread.threadFileUrl && (
                <img 
                  src={enlargedImages[thread.threadFileUrl] ? thread.threadFileUrl : thread.threadThumbnailFileUrl}
                  alt="Thread Image"
                  className={`max-w-full h-auto mb-4 mr-10 rounded-lg shadow-lg cursor-pointer ${enlargedImages[thread.threadFileUrl] ? 'w-1/2 h-full' : 'w-1/3 h-auto'}`}
                  onClick={() => toggleImageSize(thread.threadFileUrl)}
                  // onMouseEnter={() => handleMouseEnter(thread.threadFileUrl)} // hover
                  // onMouseLeave={handleMouseLeave}
                />
              )}
              <p className="text-black break-words w-1/2">{thread.threadContent}</p>
            </div>
            <p className="mb-2 text-right">Reply: {thread.replyCount}</p>
            <button className="mb-2 text-right" onClick={() => handleReply(thread.threadId)}>REPLY</button>
            {replyTo === thread.threadId && <Reply threadId={thread.threadId} parentReplyId={replyTo} />}
            
          </div>
          <div className="w-full p-6 pt-2">
            {thread.replies.length > 0 ? (
              <ul className="space-y-4">  
                {thread.replies
                .filter(reply => reply.parentReplyId === null)
                .map((reply) => (
                  <li key={reply._id} className="p-4 bg-gray-200 rounded-md break-words whitespace-pre-wrap">
                    <div className="flex space-x-1">
                      <p id={`reply-date-${reply._id}`} className="text-black text-left" data-tooltip-id={`tooltip-reply-date-${reply._id}`} style={{ display: 'inline-block' }}>
                        {formatDate(reply.createdAt)}
                      </p>
                      <Tooltip id={`tooltip-reply-date-${reply._id}`} clickable place="top">
                        {getRelativeTime(reply.createdAt)}
                      </Tooltip>
                      <p className="text-red-500">No. {reply.replyId}</p>
                    </div>
                    {/* reply photo */}
                    <div className="flex items-start mb-4">
                      {reply.replyFileUrl && (
                        <img
                          src={enlargedImages[reply.replyFileUrl] ? reply.replyFileUrl : reply.replyThumbnailFileUrl}
                          alt="Reply Image"
                          className={`max-w-full h-auto mb-4 mr-10 rounded-lg shadow-lg cursor-pointer ${enlargedImages[reply.replyFileUrl] ? 'w-1/2 h-full' : 'w-1/3 h-auto'}`}
                          onClick={() => toggleImageSize(reply.replyFileUrl)}
                          // onMouseEnter={() => handleMouseEnter(reply.replyFileUrl)}
                          // onMouseLeave={handleMouseLeave}
                        />
                      )}
                      <p className="text-black mb-4 break-words w-1/2 mt-2">{reply.replyContent}</p>
                      {/* reply's reply button */}
                      <button className="mb-2 text-right" onClick={() => handleReply(reply.replyId)}>REPLY</button>
                      {replyTo === reply.replyId && <Reply threadId={thread.threadId} parentReplyId={replyTo} />}
                    </div>

                  </li>
                ))}
              </ul>
            ) : (
              <p className="w-full p-6 pt-2 h-28">No replies yet...</p>
            )}
          </div>
        </div>
      </main>
      {hoveredImageSrc && (
        <div
          className="fixed z-50"
          style={{
            left: cursorPosition.x + 300 > window.innerWidth ? 'auto' : `${cursorPosition.x + 20}px`,
            right: cursorPosition.x + 300 > window.innerWidth ? `${window.innerWidth - cursorPosition.x + 20}px` : 'auto',
            top: `50%`,
            transform: `translateY(-50%)`,
            width: 'auto', // Fixed width
            height: 'auto', // Auto height to maintain aspect ratio
            maxWidth: '100%', // Ensure it doesn't overflow the width of the viewport
            maxHeight: '100vh', // Ensure it doesn't overflow the height of the viewport
          }}
        >
          <img 
            src={hoveredImageSrc} 
            alt="Hovered Image" 
            className="object-contain"
            style={{
              width: '100%', // Ensure it scales within the fixed size container
              height: 'auto', // Maintain aspect ratio
            }}
          />
        </div>
      )}
    </div>
  );
}
