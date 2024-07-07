'use client';

import React, { useState } from 'react';

const handleSubmit = async (e, reply, setReply, setMessage, threadId, setSuccess, setError, file, setSubmitting) => {
    e.preventDefault();
    console.log('Reply submitted:', reply);
    console.log('Thread ID:', threadId);

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

    if (file) {
        try {
            const fileBase64 = await fileToBase64(file);

            const uploadResponse = await fetch('/api/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ fileName: file.name, contentType: file.type, imageBase64: fileBase64 }),
            });

            if (!uploadResponse.ok) {
                throw new Error('File upload failed');
            }

            const uploadData = await uploadResponse.json();
            replyFileUrl = uploadData.uploadUrl.split('?')[0];
            replyThumbnailFileUrl = uploadData.thumbnailUrl;

        } catch (error) {
            console.error('Error uploading file:', error);
            setError('An error occurred while uploading the file.');
            setSubmitting(false);
            return;
        }
    }

    try {
        const response = await fetch('/api/createReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ replyContent: reply, threadId: threadId, replyFileUrl, replyThumbnailFileUrl })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReply('');
        setMessage('Reply submitted successfully.');
        setSuccess(true);
        setError('');
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('Error submitting reply:', error);
        setMessage('An error occurred while submitting the reply.');
        setSuccess(false);
    } finally {
        setSubmitting(false); // Re-enable the button after submission
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

function Reply({ threadId }) {
    const [reply, setReply] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false); 
    const [error, setError] = useState(''); 
    const [file, setFile] = useState(null);
    const [submitting, setSubmitting] = useState(false); // Track submitting state

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <div className="sticky bottom-0 left-0 w-full p-4 bg-white pb-16">
            <form onSubmit={(e) => {
                setSubmitting(true); // Disable the button immediately on submit
                handleSubmit(e, reply, setReply, setMessage, threadId, setSuccess, setError, file, setSubmitting);
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
                        {success ? 'Submiting reply...' : 'Submit'}
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default Reply;
