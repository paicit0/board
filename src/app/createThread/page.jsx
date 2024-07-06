'use client';

import React, { useState } from "react";
import Link from 'next/link';
import { useRouter } from "next/navigation";

function CreateThreadPage() {
  const [title, setTitle] = useState("");
  const [threadContent, setThreadContent] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  const router = useRouter();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return null;
    }

    try {
      // Step 1: Get the pre-signed URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: selectedFile.name }),
      });

      if (!res.ok) {
        console.error('Failed to get upload URL:', res.statusText);
        return null;
      }

      const { uploadUrl } = await res.json();

      // Step 2: Upload the file to S3 using the pre-signed URL
      const uploadRes = await fetch(uploadUrl, {
        method: 'PUT',
        body: selectedFile,
        headers: {
          'Content-Type': selectedFile.type,
        },
      });

      if (!uploadRes.ok) {
        console.error('Failed to upload file to S3:', uploadRes.statusText);
        return null;
      }

      return uploadUrl.split('?')[0]; // Return the S3 file URL without query params
    } catch (error) {
      console.error('Error during file upload:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.length === 0) {
      setError("Empty Title");
      return;
    }

    if (title.length > 200) {
      setError(`Title is too long. Maximum length is 200 characters. The current title length is ${title.length} characters.`);
      return;
    }

    if (threadContent.length === 0) {
      setError("Empty Content");
      return;
    }

    if (threadContent.length > 1000) {
      setError(`Content is too long. Maximum length is 1000 characters. The current content length is ${threadContent.length} characters.`);
      return;
    }

    setError("");

    const fileUrl = await handleFileUpload();

    if (!fileUrl && selectedFile) {
      setError("Failed to upload file.");
      return;
    }

    const data = {
      title,
      threadContent,
      threadFileUrl: fileUrl,
    };

    try {
      const response = await fetch('/api/createThread', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
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
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full bg-gray-200 border py-2 px-3 rounded text-lg mb-2"
            />
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
