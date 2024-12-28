import { gql } from "@apollo/client";

const createPost = gql`
    mutation createPost($title: String!, $content: String!, $mediaUrl: String, $createdBy: String!) {
        createPost(title: $title, content: $content, mediaUrl: $mediaUrl, createdBy: $createdBy) {
            id
            title
            content
            mediaUrl
            createdAt
            createdBy {
                id
                username
            }
        }
    }
`
const updatePost = gql`
    mutation updatePost($postId: ID!, $title: String!, $content: String!, $mediaUrl: String) {
        updatePost(postId: $postId, title: $title, content: $content, mediaUrl: $mediaUrl) {
            id
            title
            content
            mediaUrl
            createdAt
            createdBy {
                id
                username
            }
        }
    }
`
const deletePost = gql`
    mutation deletePost($postId: ID!) {
        deletePost(postId: $postId)
    }
`

const like = gql`
    mutation like($on: String!, $likedBy: String!, $onModel: String!) {
        like(on: $on, likedBy: $likedBy, onModel: $onModel) {
            id
            on
            likedBy
            createdAt
        }
    }
`
const dislike = gql`
    mutation dislike($on: String!, $dislikedBy: String!, $onModel: String!) {
        dislike(on: $on, dislikedBy: $dislikedBy, onModel: $onModel) {
            id
            on
            dislikedBy
            createdAt
        }
    }
`

const undoLike = gql`
    mutation undoLike($likeId: String!) {
        undoLike(likeId: $likeId)
    }
`

const undoDislike = gql`
    mutation undoDislike($dislikeId: String!) {
        undoDislike(dislikeId: $dislikeId)
    }
`

const createComment = gql`
    mutation createComment($content: String!, $parentId: String, $associatedTo: String!, $createdBy: String!) {
        createComment(content: $content, parentId: $parentId, associatedTo: $associatedTo, createdBy: $createdBy) {
            id
            content
            createdAt
            createdBy {
                id
                username
            }
        }
    }
`

const deleteComment = gql`
    mutation deleteComment($commentId: String!) {
        deleteComment(commentId: $commentId)
    }
`
export { createPost, updatePost, deletePost, like, dislike, undoLike, undoDislike, createComment, deleteComment };