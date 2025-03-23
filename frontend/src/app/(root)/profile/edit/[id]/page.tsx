import EditProfile from '@/components/EditProfile';
import React from 'react'

interface pageProps {
    params: {
        id: string
    }
}

const page = async ({ params }: pageProps) => {
    const { id } = await params;
    return (
        <EditProfile id={id} />
    )
}

export default page