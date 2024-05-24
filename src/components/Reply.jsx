import React from 'react'

const handleSubmit = async (e) => {
    e.preventDefault();
}

function Reply() {
    return (
        <div>
            <form>
                <input
                    type="reply"
                    className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                    placeholder='Enter your reply'
                />
            </form>
        </div>
    )
}

export default Reply