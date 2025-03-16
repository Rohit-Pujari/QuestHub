import React from 'react'
import { IPost } from '@/types'
import LikeDislikeView from './LikeDislikeView'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface ListPostsProps {
    posts: IPost[]
}
const ListPosts: React.FC<ListPostsProps> = ({ posts }) => {
    return posts.map((post) => (
        <div key={post.id} className="w-full bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-4">
            {/* User Info */}
            <div className="flex items-center gap-2">
                {post.createdBy.profile_picture ? (
                    <img
                        src={post.createdBy.profile_picture || "/default-avatar.png"}
                        alt={post.createdBy.username}
                        className="w-8 h-8 rounded-full"
                    />) : (
                    <FontAwesomeIcon
                        icon={faUser}
                        className="w-8 h-8 rounded-full"
                    />
                )}
                <div>
                    <p className="text-white font-semibold">{post.createdBy.username}</p>
                    <p className="text-gray-400 text-xs">{new Date(post.createdAt).toLocaleString()}</p>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-white mt-2">{post.title}</h3>

            {/* Content Preview (Truncated) */}
            <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-gray-300 text-sm line-clamp-2"
            />
            {/* Read More Link */}
            <a href={`/post/${post.id}`} className="text-blue-400 text-sm mt-2 inline-block">
                Read More
            </a>

            {/* Media (If Exists) */}
            {post.mediaUrl && (
                /\.(jpg|jpeg|png|gif|webp)$/i.test(post.mediaUrl) ? (
                    <img
                        src={post.mediaUrl}
                        alt="Post Media"
                        className="mt-3 rounded-lg max-h-60 w-full object-cover"
                    />
                ) : (
                    <video
                        src={post.mediaUrl}
                        controls
                        className="mt-3 rounded-lg max-h-60 w-full"
                    />
                )
            )}
            {/* Like & Dislike Buttons */}
            <LikeDislikeView on={post.id} likeCount={post.likeCount} dislikeCount={post.dislikeCount} userLikes={post.likedByUser} userDislikes={post.dislikedByUser} />
        </div>
    ))
}

export default ListPosts