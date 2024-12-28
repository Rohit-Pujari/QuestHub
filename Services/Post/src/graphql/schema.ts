import { gql } from "apollo-server";

const typeDefs = gql`
    scalar DateTime
    type User{
        id:ID!
        username:String!
        email:String
    }
    type Post {
        id: ID!
        title: String!
        content: String!
        mediaUrl: String
        createdBy: User
        createdAt: DateTime
    }
    type Comment {
        id: ID!
        content: String!
        parentId: String
        createdBy: User
        associatedTo: String!
        createdAt: DateTime
    }
    union LikeDislike = Post | Comment
    type Like {
        id: ID!
        on: LikeDislike!
        likedBy: User
        createdAt: DateTime
    }
    type Dislike {
        id: ID!
        on: LikeDislike!
        dislikedBy: User
        createdAt: DateTime
    }
    type Query {
        getPosts(limit: Int!, skip: Int):[Post!]!
        getPost(postId:ID!):Post
        getPostsByUser(username: String!,limit: Int!, skip: Int): [Post!]
        getCommentsByPost(postId: String!,limit: Int!, skip: Int): [Comment!]
        getCommentsByUser(createdBy: String!,limit: Int!, skip: Int): [Comment!]
        getLikes(on: String!): Int
        getDislikes(on: String!): Int
    }
    type Mutation {
        createPost(title: String!, content: String!, mediaUrl: String,createdBy: String): Post!
        updatePost(postId: ID!, title: String!, content: String!, mediaUrl: String): Post!
        deletePost(postId: ID!): String!
        like(on: String!, likedBy: String!,onModel: String!): Like!
        dislike(on: String!, dislikedBy: String!,onModel: String!): Dislike!
        undoLike(likeId: String!): String!
        undoDislike(dislikeId: String!): String!
        createComment(content: String!, parentId: String, associatedTo: String!, createdBy: String!): Comment!
        deleteComment(commentId: String!): String!
    }
`
export default typeDefs;