"use client"
import postAPI from '@/api/post/postAPI';
import { RootState } from '@/lib/store';
import { faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import CommentsViewPost from './CommentsViewPost';
import LikeDislikeView from './LikeDislikeView';
import { IPost } from '@/types';
import CreateComment from './CreateComment';

interface ViewPostProps {
    id: string;
}

const ViewPost: React.FC<ViewPostProps> = ({ id }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [post, setPost] = useState<IPost>();
    if (!user) return null;
    const loadPost = async () => {
        try {
            const payload = {
                query: `
                    query getPost($postId: ID!, $userId: ID!){
                        getPost(postId: $postId, userId: $userId) {
                            id
                            title
                            content
                            mediaUrl
                            createdAt
                            createdBy {
                                id
                                username
                                email
                                profile_picture
                                isFollowed
                            }
                            likeCount
                            dislikeCount
                            likedByUser
                            dislikedByUser
                        }
                    }
                `,
                variables: {
                    postId: id,
                    userId: user.id
                },
            };

            const response = await postAPI.post('/', payload);
            setPost(response.data?.data?.getPost);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };

    useEffect(() => {
        if (id && user?.id) {
            loadPost();
        }
    }, [id, user?.id]);
    return (
        <div className="flex flex-col m-4 p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-md transition-all">
            {post ? (
                <div>
                    {/* Title */}
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">{post.title}</h1>
                    {/* Content */}
                    <div className="text-gray-800 dark:text-gray-300 text-base leading-relaxed">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </div>
                    {/* Image (if available) */}
                    {post.mediaUrl && (
                        <div className="mt-4">
                            <img
                                src={post.mediaUrl}
                                alt="Post Media"
                                className="w-full max-h-96 object-cover rounded-lg shadow-lg border border-gray-200 dark:border-gray-600"
                            />
                        </div>
                    )}

                    {/* Likes & Dislikes */}
                    <LikeDislikeView dislikeCount={post.dislikeCount} likeCount={post.dislikeCount} on={post.id} userDislikes={post.dislikedByUser} userLikes={post.likedByUser} />
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center">Loading post...</p>
            )}
            <CommentsViewPost postId={id} />
            <CreateComment associatedTo={id} />
        </div>

    );
};

export default ViewPost;
