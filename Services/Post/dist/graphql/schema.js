"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apollo_server_1 = require("apollo-server");
const typeDefs = (0, apollo_server_1.gql) `
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
`;
exports.default = typeDefs;
