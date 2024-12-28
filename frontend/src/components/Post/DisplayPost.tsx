import Image from 'next/image'
import React from 'react'
import 'tailwindcss/tailwind.css'

interface DisplayPostProps {
    post:{
        id:string,
        title:string
        content:string
        mediaUrl?:string
        createdAt:string
        createdBy:{username:string}
    }
}

const DisplayPost:React.FC<DisplayPostProps> = ({post}) => {
  return (
    <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg overflow-hidden text-black">
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
            <h2 className="text-gray-700 text-base mb-4">{post.content}</h2>
            {post.mediaUrl && <Image className="w-full h-64 object-cover mb-4" src={post.mediaUrl} alt={post.title} width={500} height={500}/>}
            <p className="text-gray-500 text-sm">{new Date(post.createdAt).toLocaleDateString()}</p>
            <p className="text-gray-700 text-sm font-semibold">{post.createdBy.username}</p>
        </div>
    </div>
  )
}

export default DisplayPost