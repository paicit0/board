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
  const [replyTo, setReplyTo] = useState(null);

  const handleReply = (replyId) => {
    setReplyTo(replyTo === replyId ? null : replyId); // Toggle reply form visibility
  };

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

  const toggleImageSize = (imageId) => {
    setEnlargedImages((prev) => ({
      ...prev,
      [imageId]: !prev[imageId],
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.toLocaleDateString('en-US', { weekday: 'short' });
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayOfMonth = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const timePart = date.toLocaleTimeString('en-US', { hour12: false });
    return `${month}/${dayOfMonth}/${year}(${day}) ${timePart}`;
  };

  const getRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };

  const RenderReply = ({
    reply,
    allReplies,
    enlargedImages,
    toggleImageSize,
    handleReply,
    replyTo,
    threadId,
  }) => {
    const childReplies = allReplies.filter(r => r.parentReplyId === reply.replyId);

    return (
      <li key={reply._id} className="p-4 bg-gray-200 rounded-md break-words whitespace-pre-wrap mb-4">
        <div className="flex space-x-1">
          <p id={`reply-date-${reply._id}`} className="text-black text-left" data-tooltip-id={`tooltip-reply-date-${reply._id}`} style={{ display: 'inline-block' }}>
            {formatDate(reply.createdAt)}
          </p>
          <Tooltip id={`tooltip-reply-date-${reply._id}`} clickable place="top">
            {getRelativeTime(reply.createdAt)}
          </Tooltip>
          <p className="text-red-500">No. {reply.replyId}</p>
          {reply.parentReplyId && <p className="text-blue-500">@{reply.parentReplyId}</p>}
        </div>
        <div className="flex items-start mb-4">
          {reply.replyFileUrl && (
            <img
              src={enlargedImages[reply.replyFileUrl] ? reply.replyFileUrl : reply.replyThumbnailFileUrl}
              alt="Reply Image"
              className={`max-w-full h-auto mb-4 mr-10 rounded-lg shadow-lg cursor-pointer ${enlargedImages[reply.replyFileUrl] ? 'w-1/2 h-full' : 'w-1/3 h-auto'}`}
              onClick={() => toggleImageSize(reply.replyFileUrl)}
            />
          )}
          <p className="text-black mb-4 break-words w-1/2 mt-2">{reply.replyContent}</p>
        </div>
        <button className="mb-2 text-right" onClick={() => handleReply(reply.replyId)}>REPLY</button>
        {replyTo === reply.replyId && <Reply threadId={threadId} parentReplyId={reply.replyId} />}
        
        {childReplies.length > 0 && (
          <ul className="pl-4 mt-4 border-l-2 border-gray-300">
            {childReplies.map(childReply => (
              <RenderReply
                key={childReply._id}
                reply={childReply}
                allReplies={allReplies}
                enlargedImages={enlargedImages}
                toggleImageSize={toggleImageSize}
                handleReply={handleReply}
                replyTo={replyTo}
                threadId={threadId}
              />
            ))}
          </ul>
        )}
      </li>
    );
  };

  if (error) {
    return <p>Error: {error}</p>;
  };

  if (!thread) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
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
        <div className="flex items-start mb-4">
          {thread.threadFileUrl && (
            <img 
              src={enlargedImages[thread.threadFileUrl] ? thread.threadFileUrl : thread.threadThumbnailFileUrl}
              alt="Thread Image"
              className={`max-w-full h-auto mb-4 mr-10 rounded-lg shadow-lg cursor-pointer ${enlargedImages[thread.threadFileUrl] ? 'w-1/2 h-full' : 'w-1/3 h-auto'}`}
              onClick={() => toggleImageSize(thread.threadFileUrl)}
            />
          )}
          <p className="text-black break-words w-1/2">{thread.threadContent}</p>
        </div>
        <p className="mb-2 text-right">Reply: {thread.replyCount}</p>
        <button className="mb-2 text-right" onClick={() => handleReply(thread.threadId)}>REPLY</button>
        {replyTo === thread.threadId && <Reply threadId={thread.threadId} parentReplyId={null} />}
      </div>
      {thread.replies.length > 0 ? (
        <ul className="space-y-4 p-6">
          {thread.replies
            .filter(reply => reply.parentReplyId === null)
            .map(reply => (
              <RenderReply
                key={reply._id}
                reply={reply}
                allReplies={thread.replies}
                enlargedImages={enlargedImages}
                toggleImageSize={toggleImageSize}
                handleReply={handleReply}
                replyTo={replyTo}
                threadId={thread.threadId}
              />
            ))}
        </ul>
      ) : (
        <p className="w-full p-6 pt-2 h-28">No replies yet...</p>
      )}
    </div>
  );
};
