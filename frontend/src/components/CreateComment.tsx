import postAPI from '@/api/post/postAPI';
import { useAlert } from '@/lib/context/AlertContext';
import { RootState } from '@/lib/store';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';

interface CreateCommentProps {
    associatedTo: string;
    parentId?: string; // parentId is optional for top-level comments
}

const CreateComment: React.FC<CreateCommentProps> = ({ associatedTo, parentId = "" }) => {
    const [content, setContent] = useState('');
    const user = useSelector((state: RootState) => state.auth.user);
    const { setAlert } = useAlert();

    if (!user) return null;

    const createComment = async () => {
        if (!content.trim()) {
            setAlert({ message: "Comment cannot be empty!", type: "error" });
            return;
        }

        try {
            const payload = {
                query: `mutation createComment($content: String!, $postId: ID!, $userId: ID!, $parentId: ID){
                    createComment(content: $content, postId: $postId, userId: $userId, parentId: $parentId){
                        id
                    }
                }`,
                variables: {
                    content,
                    postId: associatedTo,
                    userId: user.id,
                    parentId: parentId || null
                }
            };

            const response = await postAPI.post("/", payload);
            if (response.data?.data?.createComment?.id) {
                setContent('');
                setAlert({ message: "Comment posted successfully!", type: "success" });
            } else {
                throw new Error("Failed to post comment");
            }
        } catch (error) {
            setAlert({ message: "Error posting comment", type: "error" });
        }
    };

    return (
        <div className="mt-4">
            <textarea
                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white"
                placeholder="Write a comment..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
            <button
                onClick={createComment}
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
                Post Comment
            </button>
        </div>
    );
};

export default CreateComment;
