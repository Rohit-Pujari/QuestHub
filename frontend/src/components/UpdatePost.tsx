'use client';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import TextEditor from './TextEditor';
import { RootState } from '@/lib/store';
import { getPostAPI, updatePostAPI } from '@/api/post/postAPI';
import FileUpload from './FileUpload';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useAlert } from '@/lib/context/AlertContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTimes } from '@fortawesome/free-solid-svg-icons';

interface UpdatePostProps {
    id: string;
}

const UpdatePost: React.FC<UpdatePostProps> = ({ id }) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [progress, setProgress] = useState<number>(0);
    const [file, setFile] = useState<File | null>(null);
    const [fileUrl, setFileUrl] = useState('');
    const [editTitle, setEditTitle] = useState(false);
    const [editContent, setEditContent] = useState(false);
    const [editMedia, setEditMedia] = useState(false);

    const user = useSelector((state: RootState) => state.auth.user);
    const navigate = useRouter();
    const { setAlert } = useAlert();

    useEffect(() => {
        const loadPost = async () => {
            if (!user || !user.id) return;
            try {
                const post = await getPostAPI(id, user.id);
                setTitle(post.title);
                setContent(post.content);
                setFileUrl(post.mediaUrl);
            } catch (error) {
                console.error('Error fetching post:', error);
            }
        };
        loadPost();
    }, [id, user]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!user || !user.id) return;
        if (title === '' || content === '') {
            setAlert({ message: 'Please fill all the fields', type: 'error' });
            return;
        }
        try {
            let fileUri = fileUrl;
            if (file) {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'Posts/');
                const fileUpload = await axios.post('/api/cdn', formData, {
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.progress) setProgress(progressEvent.progress);
                    },
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                fileUri = fileUpload.data.fileUrl;
            }
            const response = await updatePostAPI(id, title, content, user.id, fileUri);
            if (!response) {
                setAlert({ message: 'Failed to update post', type: 'error' });
                return;
            }
            setAlert({ message: 'Post updated successfully', type: 'success' });
            navigate.push(`/post/${id}`);
        } catch (err) {
            setAlert({ message: 'Failed to update post', type: 'error' });
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6 bg-gray-800 dark:bg-gray-900 border border-gray-700 rounded-xl shadow-xl p-6 w-fit"
        >
            <h1 className="text-2xl font-bold text-center text-white">Update Post</h1>

            {/* Title Section */}
            <div className="flex items-center justify-between">
                <label htmlFor="title" className="text-lg font-medium text-gray-200">Title</label>
                {editTitle ?
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => setEditTitle(!editTitle)}
                    />
                    : <FontAwesomeIcon
                        icon={faEdit}
                        size="lg"
                        className="cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => setEditTitle(!editTitle)}
                    />
                }
            </div>
            {editTitle && (
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full border text-black border-gray-500 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
            )}

            {/* Content Section */}
            <div className="flex items-center justify-between">
                <label className="text-lg font-medium text-gray-200">Content</label>
                {editContent ?
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => setEditContent(!editContent)}
                    />
                    : <FontAwesomeIcon
                        icon={faEdit}
                        size="lg"
                        className="cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => setEditContent(!editContent)}
                    />
                }
            </div>
            {editContent && <TextEditor content={content} setContent={setContent} />}

            {/* Media Section */}
            <div className="flex items-center justify-between">
                <label className="text-lg font-medium text-gray-200">Media</label>
                {editMedia ?
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => setEditMedia(!editMedia)}
                    />
                    : <FontAwesomeIcon
                        icon={faEdit}
                        size="lg"
                        className="cursor-pointer text-gray-400 hover:text-indigo-400 transition"
                        onClick={() => setEditMedia(!editMedia)}
                    />
                }
            </div>

            {fileUrl && !editMedia ? (
                <div className="relative group">
                    <img
                        src={fileUrl}
                        alt="Post media"
                        className="w-full max-h-64 object-cover rounded-lg border border-gray-500"
                    />
                    <button
                        type="button"
                        onClick={() => setFileUrl('')}
                        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                    >
                        ✕ Remove
                    </button>
                </div>
            ) : editMedia && <FileUpload progress={progress} setFile={setFile} />}

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-indigo-600 text-white py-2 rounded-lg text-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            >
                Update Post
            </button>
        </form>
    );

};

export default UpdatePost;
