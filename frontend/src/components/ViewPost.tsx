"use client"
import { getCommentsByPost, getPostAPI } from '@/api/post/postAPI';
import { RootState } from '@/lib/store';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import LikeDislikeView from './LikeDislikeView';
import { IComment, IPost } from '@/types';
import CreateComment from './CreateComment';
import ListComments from './ListComments';
import { useAlert } from '@/lib/context/AlertContext';
import UserBox from './UserBox';
import MediaBox from './MediaBox';

interface ViewPostProps {
    id: string;
}

const ViewPost: React.FC<ViewPostProps> = ({ id }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [post, setPost] = useState<IPost>();
    const [comments, setComments] = useState<IComment[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const pageRef = useRef(1);
    const { setAlert } = useAlert()
    if (!user) return null;
    const loadPost = async () => {
        if (!user.id) return
        try {
            const post = await getPostAPI(id, user.id);
            setPost(post);
        } catch (error) {
            console.error('Error fetching post:', error);
        }
    };
    const loadComments = async () => {
        if (!hasMore) return
        if (!user.id) return
        try {
            const skip = (pageRef.current - 1) * 10
            const newcomments = await getCommentsByPost(id, user.id, skip);
            setHasMore(newcomments.length > 1);
            setComments((prev) => [...prev, ...newcomments.filter((p) => !prev.some((prevPost) => prevPost.id === p.id))]);
            pageRef.current += 1
        } catch (error) {
            setAlert({ message: "Error fetching comments", type: "error" })
        }
    }
    const addNewComment = (comment: IComment) => {
        setComments((prev) => [comment, ...prev]);
    }
    useEffect(() => {
        pageRef.current = 1
        if (id && user?.id) {
            loadPost();
            loadComments();
        }
        return () => {
            setPost(undefined);
        };
    }, [id, user?.id]);
    console.log(post?.createdBy);

    return (
        <div >
            {post ? (
                <div>
                    <div className="flex flex-col m-4 p-4 rounded-lg border  border-gray-300 dark:border-gray-700 bg-gray-700 dark:bg-[#1a1a2e] shadow-md transition-all">
                        {/* User Info */}
                        <UserBox user={post.createdBy} />
                        {/* Title */}
                        <h1 className="text-2xl font-bold text-white dark:text-gray-100 mb-4">{post.title}</h1>
                        {/* Content */}
                        <div className="text-white dark:text-gray-300 text-base leading-relaxed">
                            <div dangerouslySetInnerHTML={{ __html: post.content }} />
                        </div>
                        {/* Image (if available) */}
                        {post.mediaUrl &&
                            <MediaBox mediaUrl={post.mediaUrl} />
                        }
                        {/* Likes & Dislikes */}
                        <LikeDislikeView dislikeCount={post.dislikeCount} likeCount={post.likeCount} on={post.id} userDislikes={post.dislikedByUser} userLikes={post.likedByUser} />
                        <CreateComment associatedTo={id} onNewComment={addNewComment} />
                        {comments.length > 0 &&
                            <ListComments comments={comments} getMoreComments={loadComments} hasMore={hasMore} />
                        }
                    </div>
                </div>
            ) : (
                <p className="text-gray-600 dark:text-gray-400 text-center">Loading post...</p>
            )}
        </div>

    );
};

export default ViewPost;
