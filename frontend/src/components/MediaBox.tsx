import React from 'react'

interface MediaBoxProps {
    mediaUrl: string
}

const MediaBox: React.FC<MediaBoxProps> = ({ mediaUrl }) => {
    return (
        /\.(jpg|jpeg|png|gif|webp)$/i.test(mediaUrl) ? (
            <img
                src={mediaUrl}
                alt="Post Media"
                className="mt-3 rounded-lg max-w-[1000px] max-h-[500px] w-full h-auto  object-cover sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px]"
            />
        ) : (
            <video
                src={mediaUrl}
                controls
                className="mt-3 rounded-lg max-w-[600px] max-h-[300px] w-full h-auto sm:max-w-[400px] md:max-w-[600px] lg:max-w-[800px]"
            />
        )
    )
}

export default MediaBox