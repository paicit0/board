'use client';

import React, { useState } from "react";
import Link from 'next/link';

function CreateThreadPage() {
  const [title, setTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length === 0) {
      setError("Empty Title");
      return;
    }

    if (threadContent.length === 0) {
      setError("Empty Content");
      return;
    }

    setError(""); // Clear any previous error messages

    const data = {
      title,
      threadContent,
    };

    try {
      const response = await fetch('/api/createThread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (response.ok) {
        setSuccess("Thread created successfully");
        // Optionally, redirect or update state to reflect the new thread
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Error creating thread");
      }
    } catch (error) {
      setError("Error creating thread");
    }
  };

  return (
    <div>
      <div className="flex justify-center items-center">
        <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
          <div className='text-3xl text-center'>Submit Thread</div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
              placeholder='Title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <textarea
              className="w-full bg-gray-200 border py-2 px-3 rounded text-lg mb-2 h-40"
              placeholder="Text"
              rows="5"
              value={threadContent}
              onChange={(e) => setThreadContent(e.target.value)}
            ></textarea>
            <button className='bg-green-500 hover:bg-green-600 text-white border py-2 px-3 rounded text-lg my-2 justify-center items-center mr-4' type="submit">
              Submit
            </button>
          </form>
          <Link href="/" className='hover:underline font-semibold'>Back</Link>
        </div>
      </div>
    </div>
  );
}

export default CreateThreadPage;
