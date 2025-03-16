import postAPI from '@/api/post/postAPI';
import { RootState } from '@/lib/store';
import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { faThumbsUp, faThumbsDown, faUser, faReply } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfiniteScroll from './InfinteScroll';
import { useAlert } from '@/lib/context/AlertContext';
import { IComment } from '@/types';
import CreateComment from './CreateComment';

interface CommentsViewPostProps {
    postId: string;
}

const CommentsViewPost: React.FC<CommentsViewPostProps> = ({ postId }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [comments, setComments] = useState<IComment[]>([]);
    const [replies, setReplies] = useState<IComment[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const pageRef = useRef(1);
    const { setAlert } = useAlert();

    if (!user) return null;

    const loadComments = async () => {
        if (!hasMore) return;
        try {
            const payload = {
                query: `
                    query getCommentsByPost($postId: ID!, $userId: ID!, $limit: Int!, $skip: Int) {
                        getCommentsByPost(postId: $postId, userId: $userId, limit: $limit, skip: $skip) {
                            id
                            content
                            createdAt
                            parentId
                            createdBy {
                                id
                                username
                                profile_picture
                            }
                            likeCount
                            dislikeCount
                        }
                    }
                `,
                variables: { postId, userId: user.id, limit: 5, skip: (pageRef.current - 1) * 5 },
            };

            const response = await postAPI.post("/", payload);
            const commentResponse: IComment[] = response.data?.data?.getCommentsByPost || [];
            const newReplies = commentResponse.filter((comment) => comment.parentId);
            const newComments = commentResponse.filter((comment) => !comment.parentId);
            setComments((prev) => [...prev, ...newComments]);
            setReplies((prev) => [...prev, ...newReplies])
            setHasMore(newComments.length > 0);
            pageRef.current += 1;
        } catch (error) {
            console.error("Error fetching comments:", error);
            setAlert({ message: "Error fetching comments", type: "error" });
        }
    };

    // Load first page on mount
    useEffect(() => {
        if (postId && user?.id) {
            setComments([]);
            setReplies([]);
            setHasMore(true);
            pageRef.current = 1;
            loadComments();
        }
    }, [postId, user?.id]);

    return (
        <div>
            {comments.length > 0 ? (
                comments.map((comment) => (
                    <div key={comment.id} className="flex flex-col space-y-3 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        {/* Parent Comment */}
                        <div className="flex items-start space-x-3">
                            {/* Profile Image */}
                            {comment.createdBy.profile_picture ? (
                                <Image
                                    src={comment.createdBy.profile_picture}
                                    alt="User Avatar"
                                    width={40}
                                    height={40}
                                    className="rounded-full border border-gray-300 dark:border-gray-600"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-400 dark:bg-gray-700 flex items-center justify-center text-white font-bold">
                                    {comment.createdBy.username[0].toUpperCase()}
                                </div>
                            )}

                            {/* Comment Content */}
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {comment.createdBy.username}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>

                                {/* Like/Dislike & Reply Button */}
                                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                                    <div className="flex items-center space-x-1">
                                        <FontAwesomeIcon icon={faThumbsUp} className="text-blue-500 dark:text-blue-400" />
                                        <span>{comment.likeCount}</span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 dark:text-red-400" />
                                        <span>{comment.dislikeCount}</span>
                                    </div>
                                    <button
                                        className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 hover:underline"
                                        onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                                    >
                                        <FontAwesomeIcon icon={faReply} />
                                        <span>Reply</span>
                                    </button>
                                </div>

                                {/* Show Reply Input if Reply Button is Clicked */}
                                {replyingTo === comment.id && (
                                    <CreateComment parentId={comment.id} associatedTo={postId} />
                                )}
                            </div>
                        </div>

                        {/* Replies Section */}
                        <div className="ml-12 space-y-2">
                            {replies.filter((reply) => reply.parentId === comment.id).map((reply) => (
                                <div key={reply.id} className="flex items-start space-x-3 p-2 bg-gray-200 dark:bg-gray-700 rounded-lg">
                                    {/* Profile Image */}
                                    {reply.createdBy.profile_picture ? (
                                        <Image
                                            src={reply.createdBy.profile_picture}
                                            alt="User Avatar"
                                            width={30}
                                            height={30}
                                            className="rounded-full border border-gray-300 dark:border-gray-600"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 rounded-full bg-gray-400 dark:bg-gray-700 flex items-center justify-center text-white font-bold">
                                            {reply.createdBy.username[0].toUpperCase()}
                                        </div>
                                    )}

                                    {/* Reply Content */}
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                            {reply.createdBy.username}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">{reply.content}</p>

                                        {/* Like/Dislike */}
                                        <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faThumbsUp} className="text-blue-500 dark:text-blue-400" />
                                                <span>{reply.likeCount}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <FontAwesomeIcon icon={faThumbsDown} className="text-red-500 dark:text-red-400" />
                                                <span>{reply.dislikeCount}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center">No comments yet.</p>
            )}
        </div>
    );

};

export default CommentsViewPost;
