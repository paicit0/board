'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ThreadPage = () => {
  const { id } = useParams();
  const [thread, setThread] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/threads/${id}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error('Failed to fetch thread');
          }
          return res.json();
        })
        .then((data) => {
          setThread(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>{thread.title}</h1>
      <p>{thread.threadContent}</p>
      <p>Created at: {new Date(thread.createdAt).toLocaleString()}</p>
      <p>Reply count: {thread.replyCount}</p>
      <p>Upvotes: {thread.threadUpvotes}</p>
      <p>Downvotes: {thread.threadDownvotes}</p>
      <p>Net votes: {thread.threadUpvotes - thread.threadDownvotes}</p>
      <h2>Replies:</h2>
      {thread.replies.length > 0 ? (
        <ul>
          {thread.replies.map((reply, index) => (
            <li key={index}>{reply}</li>
          ))}
        </ul>
      ) : (
        <p>No replies yet.</p>
      )}
    </div>
  );
};

export default ThreadPage;
