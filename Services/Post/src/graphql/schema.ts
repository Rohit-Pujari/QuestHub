const typeDefs = `
  scalar DateTime
  type User {
    id: ID!
    username: String!
    email: String!
    profile_picture: String
    isFollowed:Boolean!
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
  type Follow {
    id: ID!
    follower: User
    following: User
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
    getFollowers(profileId: ID!,userId:ID!,limit:Int!,skip:Int): [User!]!
    getFollowing(profileId: ID!,userId: ID!,limit:Int!,skip:Int): [User!]!
    getFollowersCount(profileId: ID!): Int!
    getFollowingCount(profileId: ID!): Int!
    isFollowed(follower:ID!,following:ID!):Boolean!
  }
  type Mutation {
    createPost(
      title: String!
      content: String!
      mediaUrl: String
      createdBy: ID!
    ): Post!
    updatePost(
      postId: ID!
      userId: ID!
      title: String!
      content: String!
      mediaUrl: String
    ): Post!
    deletePost(postId: ID!, userId: ID!): String!
    createComment(content: String!, parentId: ID, createdBy: ID!,associatedTo:ID!): Comment!
    updateComment(commentId: ID!, userId: ID!, content: String!): Comment!
    deleteComment(commentId: ID!, userId: ID!): String!
    like(on: ID!, likedBy: ID!): String!
    dislike(on: ID!, dislikedBy: ID!): String!
    undoLike(on: ID!, likedBy: ID!): String!
    undoDislike(on: ID!, dislikedBy: ID!): String!
    follow(follower: ID!, following: ID!): String!
    unfollow(follower: ID!, following: ID!): String!
  }
`;

export default typeDefs;
