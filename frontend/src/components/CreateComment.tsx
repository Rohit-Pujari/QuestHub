import { createCommentAPI } from '@/api/post/postAPI';
import { useAlert } from '@/lib/context/AlertContext';
import { RootState } from '@/lib/store';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { IComment } from '@/types';
import { ICommentBox } from './ListComments';

interface CreateCommentProps {
    associatedTo: string;
    parentId?: string; // parentId is optional for top-level comments
    onNewComment: (comment: IComment | ICommentBox) => void
}

const CreateComment: React.FC<CreateCommentProps> = ({ associatedTo, parentId = "", onNewComment }) => {
    const [content, setContent] = useState('');
    const [mount, setMount] = useState(false);
    const user = useSelector((state: RootState) => state.auth.user);
    const { setAlert } = useAlert();
    if (!user) return null;

    const createComment = async () => {
        if (!user.id) return
        if (!content.trim()) {
            setAlert({ message: "Comment cannot be empty!", type: "error" });
            return;
        }
        try {
            const response = await createCommentAPI(content, associatedTo, user.id, parentId);
            if (response) {
                onNewComment(response);
            } else {
                setAlert({ message: "Failed to post comment", type: "error" });
            }
        } catch (error) {
            setAlert({ message: "Error posting comment", type: "error" });
        }
    };
    useEffect(() => {
        setMount(true);
        setContent('');
        return () => {
            setMount(false);
            setContent('');
        }
    }, [associatedTo]);
    return mount ? (
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
    ) : (
        <button
            onClick={() => setMount(true)}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
            <FontAwesomeIcon icon={faComment} size='sm' />
        </button>
    );
};

export default CreateComment;
