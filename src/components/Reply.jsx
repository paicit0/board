import React, { useState } from 'react';

const handleSubmit = async (e, reply, setReply, setMessage, threadId, setSuccess) => {
    e.preventDefault();
    console.log('Reply submitted:', reply);
    console.log('Thread ID:', threadId);

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
        setTimeout(() => {
            window.location.reload();
        }, 1000);

        
    } catch (error) {
        console.error('Error submitting reply:', error);
        setMessage('An error occurred while submitting the reply.');
        setSuccess(false); // Ensure success state is false if there's an error
    }
};

function Reply({ threadId }) {
    const [reply, setReply] = useState('');
    const [message, setMessage] = useState('');
    const [success, setSuccess] = useState(false); // Initialize success state

    return (
        <div className="w-full p-4">
            <form onSubmit={(e) => handleSubmit(e, reply, setReply, setMessage, threadId, setSuccess)}>
                <div className="flex flex-col">
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
