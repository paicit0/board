'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";


function CreateThreadPage() {
  const [title, setTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length === 0) {
      setError("Empty Title");
      return;
    }
    
    if (title.length > 100) {
      setError(`Title is too long. Maximum length is 100 characters. The current title length is ${title.length} characters.`);
      return;
    }

    if (threadContent.length === 0) {
      setError("Empty Content");
      return;
    }

    if (threadContent.length > 500) {
      setError(`Content is too long. Maximum length is 500 characters. The current content length is ${threadContent.length} characters.`);
      return;
    }

    setError("");

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
        setSuccess("Thread created successfully...");
        setTimeout(() => {
          router.replace("/");
        }, 2000);

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
            <button
              type="submit"
              className={`w-full py-2 px-3 rounded text-lg my-2 ${success ? "bg-green-500 text-white" : "bg-green-500 hover:bg-green-600 text-white"}`}
              disabled={success}
            >
              {success || "Submit"}
            </button>
          </form>
          {!success && <Link href="/" className='hover:underline font-semibold'>Back</Link>}
        </div>
      </div>
    </div>
  );
}

export default CreateThreadPage;
