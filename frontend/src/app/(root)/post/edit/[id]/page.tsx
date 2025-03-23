import UpdatePost from '@/components/UpdatePost'
import React from 'react'

const page = async ({ params }: { params: { id: string } }) => {
    const { id } = await params
    return (
        <main className='flex items-center justify-center'>
            <UpdatePost id={id} />
        </main>
    )
}

export default page