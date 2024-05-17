import React from 'react'


const handleSubmit = async (e) => {

    

}


function createThreadPage() {
    return (
        <div>
            <div className="flex justify-center items-center">
                <div className='w-[400px] shadow-xl p-10 mt-5 rounded-xl'>
                    <div className='text-3xl text-center'>Submit Thread</div>
                    <form>
                        <input
                            type="text"
                            className='w-full bg-gray-200 border py-2 px-3 rounded text-lg my-2'
                            placeholder='Title'
                        />
                        <textarea
                            className="w-full bg-gray-200 border py-2 px-3 rounded text-lg mb-2 h-40"
                            placeholder="Text"
                            rows="5"
                        ></textarea>
                    </form>
                    <button className='bg-green-500 hover:bg-green-600 text-white border py-2 px-3 rounded text-lg my-2 justify-center items-center'>Submit</button>

                </div>
            </div>
        </div>

    )
}

export default createThreadPage