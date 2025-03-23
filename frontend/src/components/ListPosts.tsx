import React, { useEffect, useState } from 'react';
import { IPost } from '@/types';
import LikeDislikeView from './LikeDislikeView';
import UserBox from './UserBox';
import MediaBox from './MediaBox';
import Link from 'next/link';
import { useSelector } from 'react-redux';
import { RootState } from '@/lib/store';
import { useAlert } from '@/lib/context/AlertContext';
import { deletePostAPI } from '@/api/post/postAPI';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

interface ListPostsProps {
    posts: IPost[];
}

const ListPosts: React.FC<ListPostsProps> = ({ posts }) => {
    const [postList, setPostList] = useState<IPost[]>([]);
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const userId = useSelector((state: RootState) => state.auth.user?.id);
    const { setAlert } = useAlert();

    const deletePost = async (id: string) => {
        if (!userId) return;
        try {
            const response = await deletePostAPI(id, userId);
            if (response) {
                setAlert({ message: 'Post deleted successfully', type: 'success' });
                setPostList(prevPosts => prevPosts.filter(post => post.id !== id));
                return;
            }
            setAlert({ message: 'Error deleting post', type: 'error' });
        } catch (error) {
            setAlert({ message: 'Error deleting post', type: 'error' });
        }
    };
    useEffect(() => {
        setPostList(posts);
    }, [posts])
    console.log(postList);
    return (
        <div className="w-full space-y-4">
            {postList.map((post) => (
                <div key={post.id} className="w-full bg-gray-700 dark:bg-[#1a1a2e] p-4 rounded-lg shadow-md relative">
                    {/* User Info */}
                    <UserBox user={post.createdBy} />

                    {/* Three Dots Menu */}
                    <div className="absolute top-4 right-4">
                        <button onClick={() => setOpenMenu(openMenu === post.id ? null : post.id)}>
                            <FontAwesomeIcon icon={faEllipsisV} className="text-gray-300 hover:text-white cursor-pointer" />
                        </button>

                        {openMenu === post.id && (
                            <div className="absolute right-0 mt-2 w-28 bg-gray-800 text-white rounded-md shadow-lg z-10">
                                <Link href={`/post/edit/${post.id}/`} key={post.id}>
                                    <button className="flex items-center w-full px-4 py-2 hover:bg-gray-700">
                                        <FontAwesomeIcon icon={faEdit} className="mr-2" /> Update
                                    </button>
                                </Link>
                                <button
                                    onClick={() => deletePost(post.id)}
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-700 text-red-400"
                                >
                                    <FontAwesomeIcon icon={faTrash} className="mr-2" /> Delete
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mt-2">{post.title}</h3>

                    {/* Content Preview */}
                    <div dangerouslySetInnerHTML={{ __html: post.content }} className="text-gray-300 text-sm line-clamp-2" />

                    {/* Read More Link */}
                    <Link href={`/post/${post.id}`} className="text-blue-400 text-sm mt-2 inline-block hover:underline">
                        Read More
                    </Link>

                    {/* Media (If Exists) */}
                    {post.mediaUrl && <MediaBox mediaUrl={post.mediaUrl} />}

                    {/* Like & Dislike Buttons */}
                    <LikeDislikeView
                        on={post.id}
                        likeCount={post.likeCount}
                        dislikeCount={post.dislikeCount}
                        userLikes={post.likedByUser}
                        userDislikes={post.dislikedByUser}
                    />
                </div>
            ))}
        </div>
    );
};

export default ListPosts;
