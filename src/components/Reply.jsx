'use client';

import React, { useState } from 'react';

const handleSubmit = async (e, reply, setReply, setMessage, threadId, setSuccess, setError, file, setSubmitting, parentReplyId) => {
    // e.preventDefault();
    

    if (reply.length === 0) {
        setError("Empty Reply");
        setSubmitting(false);
        return;
    }

    if (reply.length > 500) {
        setError(`Reply is too long. Maximum length is 500 characters. The current reply length is ${reply.length} characters.`);
        setSubmitting(false);
        return;
    }

    let replyFileUrl = '';
    let replyThumbnailFileUrl = '';

    if (file && file instanceof Blob) {
        try {
            const uniqueFileName = `${Date.now()}`;
            const fileBase64 = await fileToBase64(file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName: uniqueFileName, contentType: file.type, imageBase64: fileBase64 }),
            });

            if (!uploadResponse.ok) {
                console.error('Failed to get upload URL:', uploadResponse.statusText);
                setError('File upload failed');
                setSubmitting(false);
                return;
            }

            const uploadData = await uploadResponse.json();
            replyFileUrl = uploadData.uploadUrl.split('?')[0];
            replyThumbnailFileUrl = uploadData.thumbnailUrl;

            const uploadRes = await fetch(uploadData.uploadUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            });

            if (!uploadRes.ok) {
                console.error('Failed to upload file to S3:', uploadRes.statusText);
                setError('Failed to upload file to S3');
                setSubmitting(false);
                return;
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            setError('An error occurred while uploading the file.');
            setSubmitting(false);
            return;
        }
    } else if (file) {
        setError('Invalid file type.');
        setSubmitting(false);
        return;
    }

    try {
        const response = await fetch('/api/createReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ replyContent: reply, threadId, replyFileUrl, replyThumbnailFileUrl, parentReplyId }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            setError(errorData.message || 'Error creating reply');
            setSubmitting(false);
            return;
        }

        const data = await response.json();
        console.log("Reply Component Response: ", data)
        setReply('');
        setMessage('');
        setSuccess(true);
        setError('');

    } catch (error) {
        console.error('Error submitting reply:', error);
        setMessage('An error occurred while submitting the reply.');
        setSuccess(false);
    } finally {
        setSubmitting(false);
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

function Reply({ threadId, parentReplyId }) {
    const [reply, setReply] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false); 
    const [error, setError] = useState(''); 
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // console.log("Reply Component Here!");
    // console.log("Replying to thread:", threadId);
    // console.log("Replying to parent reply ID:", parentReplyId);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="sticky bottom-0 left-0 w-full p-4 bg-white pb-16">
            <form onSubmit={(e) => {
                // e.preventDefault();
                setSubmitting(true); 
                handleSubmit(e, reply, setReply, setMessage, threadId, setSuccess, setError, file, setSubmitting, parentReplyId);
            }}>
                <div className="flex flex-col">
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                        type="file"
                        onChange={handleFileChange}
                        className="w-full bg-gray-200 border py-2 px-3 rounded text-lg mb-2"
                    />
                    <input
                        type="text"
                        className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                        placeholder='Enter your reply'
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 px-4 rounded mb-4 ${success ? 'bg-green-500' : submitting ? 'bg-green-500' : 'hover:bg-blue-600'}`}
                        disabled={submitting || success} // Disable button if submitting or success
                    >
                        {success ? 'Submitting reply...' : 'Submit'}
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default Reply;
