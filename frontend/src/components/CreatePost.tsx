'use client';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import TextEditor from './TextEditor';
import { RootState } from '@/lib/store';
import { createPostAPI } from '@/api/post/postAPI';
import FileUpload from './FileUpload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/lib/context/AlertContext';

interface CreatePostProps {
}
const CreatePost: React.FC<CreatePostProps> = ({ }) => {
    const [title, setTiltle] = useState('')
    const [content, setContent] = useState('')
    const [progress, setProgress] = useState<number>(0)
    const [file, setFile] = useState<File | null>(null)
    const user = useSelector((state: RootState) => state.auth.user)
    const navigate = useRouter()
    const { setAlert } = useAlert()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (title === '' || content === '') {
            setAlert({ message: 'Please fill all the fields', type: 'error' })
            return
        }
        const userid = user?.id
        let fileurl = ''
        if (userid) {
            try {
                if (file) {
                    const formData = new FormData();
                    formData.append('file', file!);
                    formData.append('type', 'Posts/');
                    const fileUpload = await axios.post('/api/cdn', formData, {
                        onUploadProgress: (progressEvent) => {
                            if (progressEvent.progress) setProgress(progressEvent.progress)
                        },
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
                    fileurl = fileUpload.data.fileUrl
                }

                const id = await createPostAPI(title, content, userid, fileurl)
                if (id) {
                    navigate.push(`/post/${id}`)
                    return
                } else {
                    setAlert({ message: 'Failed to create post', type: 'error' })
                }
            } catch (err) {
                setAlert({ message: 'Failed to create post', type: 'error' })
            }
        }
    }
    useEffect(() => {
        setTiltle('')
        setContent('')
        setProgress(0)
        setFile(null)
        return () => {
            setTiltle('')
            setContent('')
            setProgress(0)
            setFile(null)
        }
    }, [])
    return (
        <form
            onSubmit={handleSubmit}
            className='flex flex-col gap-2 bg-white border border-gray-300 rounded-lg shadow-lg p-6'
        >
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Create Post</h1>
            <section className="flex flex-col mb-4">
                <label htmlFor='title' className="text-lg font-semibold text-gray-600 mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    id='title'
                    value={title}
                    onChange={(e) => setTiltle(e.target.value)}
                    className="w-full border text-black border-gray-300 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                />
            </section>
            <section className='flex flex-col mb-4'>
                <label className='text-lg text-gray-600 font-semibold mb-1'>Content</label>
                <TextEditor content={content} setContent={setContent} />
            </section>
            <FileUpload progress={progress} setFile={setFile} />
            <button type="submit" className="bg-indigo-600 text-white py-2 rounded-md text-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300">
                Submit
            </button>
        </form>
    )
}

export default CreatePost