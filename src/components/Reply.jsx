import React, { useState } from 'react';

const handleSubmit = async (e, reply, setReply, setMessage) => {
    e.preventDefault();
    console.log('Reply submitted:', reply);

    try {
        const response = await fetch('/api/createReply', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ replyContent: reply })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessage(data.message);
        setReply(''); 
    } catch (error) {
        console.error('Error submitting reply:', error);
        setMessage('An error occurred while submitting the reply.');
    }
};

function Reply() {
    const [reply, setReply] = useState('');
    const [message, setMessage] = useState('');

    return (
        <div>
            <form onSubmit={(e) => handleSubmit(e, reply, setReply, setMessage)}>
                <input
                    type="text"
                    className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                    placeholder='Enter your reply'
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                />
                <button
                    type="submit"
                    className='bg-blue-500 text-white py-2 px-4 rounded'
                >
                    Submit
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Reply;
