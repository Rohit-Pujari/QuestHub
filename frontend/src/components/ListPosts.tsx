import React, { useEffect, useState } from 'react'
import { IPost } from '@/types'
import LikeDislikeView from './LikeDislikeView'
import UserBox from './UserBox'
import MediaBox from './MediaBox'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { usePathname } from 'next/navigation'

interface ListPostsProps {
    posts: IPost[]
}
const ListPosts: React.FC<ListPostsProps> = ({ posts }) => {
    return posts.map((post) => (
        <div key={post.createdAt} className="w-full bg-gray-700 dark:bg-[#1a1a2e] p-4 rounded-lg shadow-md mb-4">
            {/* User Info */}
            <UserBox user={post.createdBy} />
            {/* Title */}
            <h3 className="text-lg font-semibold text-white mt-2">{post.title}</h3>

            {/* Content Preview (Truncated) */}
            <div
                dangerouslySetInnerHTML={{ __html: post.content }}
                className="text-gray-300 text-sm line-clamp-2"
            />
            {/* Read More Link */}
            <Link href={`/post/${post.id}`} className="text-blue-400 text-sm mt-2 inline-block">
                Read More
            </Link>

            {/* Media (If Exists) */}
            {post.mediaUrl && <MediaBox mediaUrl={post.mediaUrl} />}
            {/* Like & Dislike Buttons */}
            <LikeDislikeView on={post.id} likeCount={post.likeCount} dislikeCount={post.dislikeCount} userLikes={post.likedByUser} userDislikes={post.dislikedByUser} />
        </div>
    ))
}

export default ListPosts