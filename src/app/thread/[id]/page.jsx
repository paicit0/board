import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

const ThreadPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [title, setTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [replies, setReplies] = useState([]);
  const [replyCount, setReplyCount] = useState(0);
  const [threadUpvotes, setThreadUpvotes] = useState(0);
  const [threadDownvotes, setThreadDownvotes] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (id) {
      const fetchThread = async () => {
        try {
          const response = await axios.get(`/api/threads/${id}`);
          const data = response.data;
          setTitle(data.title);
          setThreadContent(data.content);
          setCreatedAt(data.createdAt);
          setReplies(data.replies);
          setReplyCount(data.replies.length);
          setThreadUpvotes(data.upvotes);
          setThreadDownvotes(data.downvotes);
        } catch (error) {
          setError("Error fetching thread data");
        }
      };

      fetchThread();
    }
  }, [id]);

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    const newReply = e.target.reply.value;
    try {
      const response = await axios.post(`/api/threads/${id}/replies`, { reply: newReply });
      setReplies([...replies, response.data]);
      setReplyCount(replyCount + 1);
      setSuccess("Reply added successfully");
    } catch (error) {
      setError("Error adding reply");
    }
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
      <h1>{title}</h1>
      <p>{threadContent}</p>
      <p>Created at: {createdAt}</p>
      <p>Upvotes: {threadUpvotes}</p>
      <p>Downvotes: {threadDownvotes}</p>
      <h2>Replies ({replyCount}):</h2>
      <ul>
        {replies.map((reply, index) => (
          <li key={index}>{reply.text}</li>
        ))}
      </ul>
      <form onSubmit={handleReplySubmit}>
        <textarea name="reply" placeholder="Write your reply" required></textarea>
        <button type="submit">Submit Reply</button>
      </form>
    </div>
  );
};

export default ThreadPage;
