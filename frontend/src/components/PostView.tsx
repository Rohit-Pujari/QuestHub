import React from 'react'

interface PostViewProps {
    title: string
    content: string
    likes: number
    dislikes: number
    createdAt: string
    createdBy: string
}
const PostView: React.FC<PostViewProps> = ({ title, content, likes, dislikes, createdAt, createdBy }) => {
    return (
        <div>PostView</div>
    )
}

export default PostView