import React, { useState } from 'react';

const handleSubmit = async (e, reply, setReply, setMessage, threadId, setSuccess, setError) => {
    e.preventDefault();
    console.log('Reply submitted:', reply);
    console.log('Thread ID:', threadId);

    if (reply.length === 0) {
        setError("Empty Reply");
        return;
    }

    if (reply.length > 500) {
        setError(`Reply is too long. Maximum length is 500 characters. The current reply length is ${reply.length} characters.`);
        return;
    }

    try {
        const response = await fetch('/api/createReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ replyContent: reply, threadId: threadId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setReply('');
        setSuccess(true);
        setError('');
        setTimeout(() => {
            window.location.reload();
        }, 1000);

    } catch (error) {
        console.error('Error submitting reply:', error);
        setMessage('An error occurred while submitting the reply.');
        setSuccess(false);
    }
};

function Reply({ threadId }) {
    const [reply, setReply] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false); 
    const [error, setError] = useState(''); 

    return (
        <div className="sticky bottom-0 left-0 w-full p-4 bg-white pb-16">
            <form onSubmit={(e) => handleSubmit(e, reply, setReply, setMessage, threadId, setSuccess, setError)}>
                <div className="flex flex-col">
                    {error && <p className="text-red-500">{error}</p>}
                    <input
                        type="text"
                        className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                        placeholder='Enter your reply'
                        value={reply}
                        onChange={(e) => setReply(e.target.value)}
                    />
                    <button
                        type="submit"
                        className={`bg-blue-500 text-white py-2 px-4 rounded mb-4 ${success ? 'bg-green-500' : ''}`}
                        disabled={success}
                    >
                        {success ? 'Submitted' : 'Submit'}
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-red-500">{message}</p>}
        </div>
    );
}

export default Reply;
