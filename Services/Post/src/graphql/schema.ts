import { gql } from "apollo-server";

const typeDefs = gql`
    type Post {
        id: ID!
        title: String!
        content: String!
        mediaUrl: String
        createdBy: String!
        createdAt: String
    }

    type Query {
        getPosts:[Post!]!
        getPost(id:ID!):Post
        getPostsByUser(username: String!): [Post!]
    }

    type Mutation {
        createPost(title: String!, content: String!, mediaUrl: String): Post!
        updatePost(id: ID!, title: String!, content: String!, mediaUrl: String): Post!
        deletePost(id: ID!): String!
    }
`
export default typeDefs;