import { formatDistanceToNow } from 'date-fns'
import React from 'react'

interface ListPostsProps {
    id: string
    createdBy: string
    createdAt: string
    title: string
    mediaUrl?: string
}
const ListPosts: React.FC<ListPostsProps> = ({ id, createdAt, createdBy, title, mediaUrl }) => {
    const humanizedTime = formatDistanceToNow(new Date(createdAt), { addSuffix: true })
    return (
        <div className='flex flex-col m-4 p-2 bg-gray-600 hover:bg-gray-500 dark:bg-black dark:hover:bg-gray-800 text-white rounded-lg'>
            <div className='flex items-center gap-2'>
                <p className='font-extralight'>{humanizedTime}</p>
                <p className='font-semibold'>{createdBy}</p>
            </div>
            <div className='flex flex-col'>
                <h3>{title}</h3>
                {mediaUrl ?
                    <img src={mediaUrl} alt="mediaurl" /> :
                    <></>
                }
            </div>
        </div>
    )
}

export default ListPosts