import Link from 'next/link'
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
                        <div>
                            <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white" for="file_input">Upload file</label>
                            <input class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"></input>
                        </div>
                    </form>
                    <button className='bg-green-500 hover:bg-green-600 text-white border py-2 px-3 rounded text-lg my-2 justify-center items-center mr-4'>Submit</button>

                    <Link href="/" className='hover:underline font-semibold'>Back</Link>

                </div>
            </div>
        </div>

    )
}

export default createThreadPage