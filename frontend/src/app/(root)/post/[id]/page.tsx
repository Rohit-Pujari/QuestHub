import ViewPost from '@/components/ViewPost';
import React from 'react';

async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params; // Extract the ID from params
    return (
        <ViewPost id={id} />
    );
}

export default PostPage;
