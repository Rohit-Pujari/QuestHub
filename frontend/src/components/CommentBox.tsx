import React, { useState } from 'react';
import { ICommentBox } from './ListComments';
import UserBox from './UserBox';
import LikeDislikeView from './LikeDislikeView';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit, faCheck, faTimes, faReply } from '@fortawesome/free-solid-svg-icons';
import { useAlert } from '@/lib/context/AlertContext';
import { deleteCommentAPI, updateCommentAPI } from '@/api/post/postAPI';
import { RootState } from '@/lib/store';
import { useSelector } from 'react-redux';
import CreateComment from './CreateComment';
import { IComment } from '@/types';

interface CommentBoxProps {
    comment: ICommentBox;
    onDelete: (id: string) => void;
}

const CommentBox: React.FC<CommentBoxProps> = ({ comment, onDelete }) => {
    const [content, setContent] = useState(comment.content);
    const [isEditing, setIsEditing] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [showReplies, setShowReplies] = useState(false);
    const [replies, setReplies] = useState<ICommentBox[]>(comment.replies);

    const { setAlert } = useAlert();
    const userId = useSelector((state: RootState) => state.auth.user?.id);

    const deleteComment = async () => {
        if (userId !== comment.createdBy.id) return setAlert({ message: "Can't delete comment", type: "error" });
        try {
            const response = await deleteCommentAPI(comment.id, comment.createdBy.id);
            if (response) return onDelete(comment.id);
            setAlert({ message: "Error deleting comment", type: "error" });
        } catch (err) {
            setAlert({ message: "Error deleting comment", type: "error" });
        }
    };

    const updateComment = async () => {
        if (!userId) return;
        try {
            const response = await updateCommentAPI(comment.id, userId, content);
            if (!response) return setAlert({ message: "Error updating comment", type: "error" });
            setContent(response.content);
            setIsEditing(false);
        } catch (err) {
            setAlert({ message: "Error updating comment", type: "error" });
        }
    };

    return (
        <div className="flex border-l-2 border-gray-300 dark:border-gray-700 pl-4 my-3">
            <div className="p-4 m-2 w-full rounded-lg bg-gray-100 dark:bg-gray-800 text-black dark:text-white shadow-md">
                <div className='flex justify-between'>
                    <UserBox user={comment.createdBy} />
                    {userId === comment.createdBy.id && (
                        <div className='flex items-center gap-4'>
                            {isEditing ? (
                                <>
                                    <FontAwesomeIcon icon={faCheck} className='cursor-pointer text-green-500' onClick={updateComment} />
                                    <FontAwesomeIcon icon={faTimes} className='cursor-pointer text-red-500' onClick={() => setIsEditing(false)} />
                                </>
                            ) : (
                                <>
                                    <FontAwesomeIcon icon={faEdit} className='cursor-pointer' onClick={() => setIsEditing(true)} />
                                    <FontAwesomeIcon icon={faTrash} className='cursor-pointer text-red-500' onClick={deleteComment} />
                                </>
                            )}
                        </div>
                    )}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">{new Date(comment.createdAt).toLocaleString()}</div>
                {isEditing ? (
                    <textarea
                        className="w-full p-2 mt-2 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                ) : (
                    <p className="text-md mt-2">{content}</p>
                )}

                {/* Like & Dislike */}
                <LikeDislikeView
                    dislikeCount={comment.dislikeCount}
                    likeCount={comment.likeCount}
                    on={comment.id}
                    userDislikes={comment.dislikedByUser}
                    userLikes={comment.likedByUser}
                />

                {/* Reply Button */}
                <div className="flex items-center justify-between mt-2">
                    <button
                        className="flex items-center text-blue-500 hover:underline"
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        <FontAwesomeIcon icon={faReply} className="mr-2" />
                        Reply
                    </button>

                    {replies.length > 0 && (
                        <button
                            className="text-sm text-gray-500 hover:underline"
                            onClick={() => setShowReplies(!showReplies)}
                        >
                            {showReplies ? `Hide Replies (${replies.length})` : `View Replies (${replies.length})`}
                        </button>
                    )}
                </div>

                {/* Reply Input Box */}
                {isReplying && (
                    <CreateComment associatedTo={comment.associatedTo} onNewComment={(comment: ICommentBox | IComment) => {
                        if ('replies' in comment) {
                            setReplies([...replies, comment]);
                        }
                    }} parentId={comment.id} />
                )}
                {/* Replies Section (Hidden Until Expanded) */}
                {showReplies && replies.length > 0 && (
                    <div className="ml-6 border-l-2 border-gray-300 dark:border-gray-700">
                        {replies.map(reply => (
                            <CommentBox key={reply.id} comment={reply} onDelete={(id: string) => setReplies(replies.filter(reply => reply.id !== id))} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentBox;
