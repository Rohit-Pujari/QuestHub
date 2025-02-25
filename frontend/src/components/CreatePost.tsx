'use client';
import React, { useState } from 'react'
import { useSelector } from 'react-redux';
import TextEditor from './TextEditor';
import { useAlert } from '@/lib/context/AlertContext';
import { RootState } from '@/lib/store';
import postAPI from '@/api/post/postAPI';

interface CreatePostProps {
}
const CreatePost: React.FC<CreatePostProps> = ({ }) => {
    const [title, setTiltle] = useState('Your Post Title')
    const [content, setContent] = useState('Your Post Content')
    const { auth } = useSelector((state: RootState) => state)
    const { user } = auth
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const userid = user?.id
        if (userid) {
            try {
                const payload = {
                    query: `
                        mutation CreatePost($title: String!, $content: String!, $createdBy: String!) {
                            createPost(title: $title, content: $content, createdBy: $createdBy) {
                                id
                                title
                            }
                        }
                    `,
                    variables: {
                        title,
                        content,
                        createdBy: userid,
                    },
                };
                const response = await postAPI.post('/', payload)
                console.log('success', response);
            } catch (err) {
                console.log(err);
            }
        }
    }
    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col bg-white border border-gray-300 rounded-lg shadow-lg p-6'
        >
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create Post</h1>
            <section className="flex flex-col mb-4">
                <label htmlFor='title' className="text-sm text-gray-600 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    id='title'
                    value={title}
                    onChange={(e) => setTiltle(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
            </section>
            <TextEditor content={content} setContent={setContent} />
            <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300">
                Submit
            </button>
        </form>
    )
}

export default CreatePost