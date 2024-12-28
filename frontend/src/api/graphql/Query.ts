import { gql } from "@apollo/client";

const GET_POSTS = gql`
  query getPosts($limit: Int!, $skip: Int) {
    getPosts(limit: $limit, skip: $skip) {
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
`;

const GET_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
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
`;

const GET_POSTS_BY_USER = gql`
  query getPostsByUser($username: String!, $limit: Int!, $skip: Int) {
    getPostsByUser(username: $username, limit: $limit, skip: $skip) {
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
`;

const GET_COMMENTS_BY_POST = gql`
  query getCommentsByPost($postId: ID!, $limit: Int!, $skip: Int) {
    getCommentsByPost(postId: $postId, limit: $limit, skip: $skip) {
      id
      content
      createdAt
      parentId
      createdBy {
        id
        username
      }
    }
  }
`;

const GET_COMMENTS_BY_USER = gql`
  query getCommentsByUser($createdBy: String!, $limit: Int!, $skip: Int) {
    getCommentsByUser(createdBy: $createdBy, limit: $limit, skip: $skip) {
      id
      content
      createdAt
      parentId
      createdBy {
        id
        username
      }
    }
  }
`;

const GET_LIKES = gql`
  query getLikes($on: String!) {
    getLikes(on: $on)
  }
`;

const GET_DISLIKES = gql`
  query getDislikes($on: String!) {
    getDislikes(on: $on)
  }
`;

export { GET_POSTS, GET_POST, GET_POSTS_BY_USER, GET_COMMENTS_BY_POST, GET_COMMENTS_BY_USER, GET_LIKES, GET_DISLIKES };