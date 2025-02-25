const typeDefs = `
  scalar DateTime
  type User {
    id: ID!
    username: String!
    email: String!
    profile_picture: String
  }
  type Post {
    id: ID!
    title: String!
    content: String!
    mediaUrl: String
    createdBy: User
    likeCount: Int!
    dislikeCount: Int!
    createdAt: DateTime
    likedByUser: Boolean!
    dislikedByUser: Boolean!
  }
  type Comment {
    id: ID!
    content: String!
    parentId: String
    associatedTo: String!
    createdBy: User
    likeCount: Int!
    dislikeCount: Int!
    createdAt: DateTime
    likedByUser: Boolean!
    dislikedByUser: Boolean!
  }
  type Like {
    id: ID!
    on: String!
    likedBy: User
  }
  type Dislike {
    id: ID!
    on: String!
    dislikedBy: User
  }
  type Query {
    getPosts(limit: Int!, skip: Int, userId: ID!): [Post!]!
    getPost(postId: ID!, userId: ID!): Post!
    getPostsByUser(
      postUserId: ID!
      userId: ID!
      limit: Int!
      skip: Int
    ): [Post!]!
    getCommentsByPost(
      postId: ID!
      userId: ID!
      limit: Int!
      skip: Int
    ): [Comment!]!
    getCommentsByUser(
      commentUserId: ID!
      userId: ID!
      limit: Int!
      skip: Int
    ): [Comment!]!
  }
  type Mutation {
    createPost(
      title: String!
      content: String!
      mediaUrl: String
      createdBy: ID!
    ): Post!
    updatePost(
      id: ID!
      userId: ID!
      title: String!
      content: String!
      mediaUrl: String
    ): Post!
    deletePost(id: ID!, userId: ID!): String!
    createComment(content: String!, parentId: ID, createdBy: ID!,associatedTo:ID!): Comment!
    updateComment(id: ID!, userId: ID!, content: String!): Comment!
    deleteComment(id: ID!, userId: ID!): String!
    like(on: ID!, likedBy: ID!): Like!
    dislike(on: ID!, dislikedBy: ID!): Dislike!
    undoLike(on: ID!, userId: ID!): String!
    undoDislike(on: ID!, userId: ID!): String!
  }
`;

export default typeDefs;
