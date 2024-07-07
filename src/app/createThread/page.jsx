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
  const [submitting, setSubmitting] = useState(false); // Add submitting state

  const router = useRouter();

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      alert('Please select a file to upload.');
      return { fileUrl: null, thumbnailUrl: null };
    }

    try {
      const uniqueFileName = `${Date.now()}`;
      console.log('Unique File Name:', uniqueFileName); // Log the unique file name

      const fileBase64 = await fileToBase64(selectedFile);
      console.log('File Base64 Length:', fileBase64.length); // Log the length of the base64 string

      // Step 1: Get the pre-signed URL
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileName: uniqueFileName, contentType: selectedFile.type, imageBase64: fileBase64 }),
      });

      if (!res.ok) {
        console.error('Failed to get upload URL:', res.statusText);
        const errorText = await res.text();
        console.error('Error Text:', errorText); // Log the response text
        return { fileUrl: null, thumbnailUrl: null };
      }

      const { uploadUrl, thumbnailUrl } = await res.json();
      console.log('Upload URL:', uploadUrl); // Log the upload URL
      console.log('Thumbnail URL:', thumbnailUrl); // Log the thumbnail URL

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
        const errorText = await uploadRes.text();
        console.error('Error Text:', errorText); // Log the response text
        return { fileUrl: null, thumbnailUrl: null };
      }

      return { fileUrl: uploadUrl.split('?')[0], thumbnailUrl };
    } catch (error) {
      console.error('Error during file upload:', error);
      return { fileUrl: null, thumbnailUrl: null };
    }
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (submitting) return; // Prevent multiple submissions
    setSubmitting(true); // Disable further submissions

    if (title.length === 0) {
      setError("Empty Title");
      setSubmitting(false);
      return;
    }

    if (title.length > 200) {
      setError(`Title is too long. Maximum length is 200 characters. The current title length is ${title.length} characters.`);
      setSubmitting(false);
      return;
    }

    if (threadContent.length === 0) {
      setError("Empty Content");
      setSubmitting(false);
      return;
    }

    if (threadContent.length > 1000) {
      setError(`Content is too long. Maximum length is 1000 characters. The current content length is ${threadContent.length} characters.`);
      setSubmitting(false);
      return;
    }

    setError("");

    const { fileUrl, thumbnailUrl } = await handleFileUpload();

    if (!fileUrl && selectedFile) {
      setError("Failed to upload file.");
      setSubmitting(false);
      return;
    }

    const data = {
      title,
      threadContent,
      threadFileUrl: fileUrl,
      threadThumbnailFileUrl: thumbnailUrl
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
        setSubmitting(false);
      }
    } catch (error) {
      setError("Error creating thread");
      setSubmitting(false);
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
              className={`bg-blue-500 text-white py-2 px-4 rounded mb-4 w-full ${success ? 'bg-green-500' : submitting ? 'bg-green-500' : 'hover:bg-blue-600'}`}
              disabled={submitting || success} // Disable button if submitting or success
            >
              {success ? "Submitting thread..." : "Submit"}
            </button>
          </form>
          {!success && <Link href="/" className='hover:underline font-semibold'>Back</Link>}
        </div>
      </div>
    </div>
  );
}

export default CreateThreadPage;
