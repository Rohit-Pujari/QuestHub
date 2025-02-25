import postAPI from '@/api/post/postAPI';
import React from 'react';

async function PostPage({ params }: { params: { id: string } }) {
    const { id } = await params; // Extract the ID from params
    let post = null;
    try {
        const payload = {
            query: `
                query GetPost($postId: ID!) {
                    getPost(postId: $postId) {
                        id
                        title
                        content
                    }
                }
            `,
            variables: { postId: id },
        };
        const response = await postAPI.post('/', payload);
        post = response.data?.data?.getPost;
    } catch (err) {
        console.error('Error fetching post:', err);
    }
    return (
        <div>
            {post ? (
                <div>
                    <h1>{post.title}</h1>
                    <p>{post.content}</p>
                </div>
            ) : (
                <p>Post not found or an error occurred.</p>
            )}
        </div>
    );
}

export default PostPage;
