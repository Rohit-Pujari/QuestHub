import { IComment, IPost, IUser } from "@/types";
import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_API_URL! + "graphql/";

const postAPI = axios.create({
  baseURL: base_url,
  headers: {
    "Content-Type": "application/json",
  },
});

const createPostAPI = async (
  title: string,
  content: string,
  userid: string,
  fileurl: string
): Promise<string> => {
  try {
    const payload = {
      query: `mutation CreatePost($title: String!, $content: String!, $createdBy: ID!, $mediaUrl: String) {
                createPost(title: $title, content: $content, createdBy: $createdBy,mediaUrl: $mediaUrl) {
                  id
              }
            }`,
      variables: {
        title,
        content,
        createdBy: userid,
        mediaUrl: fileurl,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.status === 200) {
      return response.data.data.createPost.id;
    }
    throw new Error("unable to create post");
  } catch (err) {
    throw new Error("unable to create post");
  }
};

const createCommentAPI = async (
  content: string,
  associatedTo: string,
  userid: string,
  parentId?: string
): Promise<IComment> => {
  try {
    const payload = {
      query: `mutation createComment($content: String!, $associatedTo: ID!, $createdBy: ID!, $parentId: ID){
          createComment(content: $content, associatedTo: $associatedTo, createdBy: $createdBy, parentId: $parentId){
              id
              content
              associatedTo
              parentId
              createdBy {
                id
                username
                email
                isFollowed
                profile_picture
              }   
              createdAt
              dislikeCount
              dislikedByUser
              likeCount
              likedByUser}
            }`,
      variables: {
        content,
        associatedTo: associatedTo,
        createdBy: userid,
        parentId: parentId || "",
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.createComment) {
      return response.data.data.createComment as IComment;
    }
    console.log(response.data);

    throw new Error("Error creating comment ");
  } catch (err) {
    console.log(err);
    throw new Error("Error creating comment ");
  }
};

const updateCommentAPI = async (
  commentId: string,
  userId: string,
  content: string
): Promise<IComment> => {
  try {
    const payload = {
      query: `mutation updateComment($commentId:ID!,$userId:ID!,$content: String!){
        updateComment(commentId:$commentId,userId:$userId,content:$content){
        id
        content
        associatedTo
        parentId
        createdBy {
          id
          username
          email
          isFollowed
          profile_picture
        }   
        createdAt
        dislikeCount
        dislikedByUser
        likeCount
        likedByUser
        }  
      }`,
      variables: {
        commentId: commentId,
        userId: userId,
        content: content,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.updateComment)
      return response.data.data.updateComment as IComment;
    throw new Error("unable to update comment");
  } catch (err) {
    throw new Error("unable to update comment");
  }
};

const deleteCommentAPI = async (
  commentId: string,
  userId: string
): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation deleteComment($commentId:ID!,$userId:ID!){
        deleteComment(commentId:$commentId,userId:$userId)
      }`,
      variables: {
        commentId: commentId,
        userId: userId,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.deleteComment) {
      return true;
    }
    return false;
  } catch (err) {
    throw new Error("unable to delete comment");
  }
};

const getPostAPI = async (id: string, userid: string): Promise<IPost> => {
  try {
    const payload = {
      query: `query getPost($postId: ID!, $userId: ID!){
                getPost(postId: $postId, userId: $userId) {
                  id
                  title
                  content
                  mediaUrl
                  createdAt
                  createdBy {
                    id
                    username
                    email
                    profile_picture
                    isFollowed
                  }
                  likeCount
                  dislikeCount
                  likedByUser
                  dislikedByUser
                  }
                }`,
      variables: {
        postId: id,
        userId: userid,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getPost) {
      return response.data.data.getPost as IPost;
    }
    throw new Error("Error getting post");
  } catch (err) {
    throw new Error("Error getting posts");
  }
};

const getPostsAPI = async (userid: string, skip: number): Promise<IPost[]> => {
  try {
    const payload = {
      query: `query getPosts($userId: ID!,$skip:Int,$limit:Int!){
            getPosts(userId:$userId,skip:$skip,limit:$limit){
              id
              title
              content
              mediaUrl
              createdAt
              createdBy{
                id
                username
                email
                profile_picture
                isFollowed
              }
              likeCount
              dislikeCount
              likedByUser
              dislikedByUser
            }
          }
          `,
      variables: {
        userId: userid,
        skip: skip,
        limit: 10,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getPosts) {
      return response.data.data.getPosts as IPost[];
    }
    throw new Error("Error getting posts");
  } catch (err) {
    throw new Error("Error getting posts");
  }
};

const getPostsByUserAPI = async (
  postUserId: string,
  userId: string,
  skip: number
): Promise<IPost[]> => {
  try {
    const payload = {
      query: `query getPostsByUser($postUserId: ID!,$userId: ID!,$limit:Int!,$skip:Int){
        getPostsByUser(postUserId:$postUserId,userId:$userId,skip:$skip,limit:$limit){
              id
              title
              content
              mediaUrl
              createdAt
              createdBy{
                id
                username
                email
                profile_picture
                isFollowed
              }
              likeCount
              dislikeCount
              likedByUser
              dislikedByUser
    }}`,
      variables: {
        postUserId: postUserId,
        userId: userId,
        skip: skip,
        limit: 10,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getPostsByUser)
      return response.data.data.getPostsByUser as IPost[];
    throw new Error("Error getting posts by user");
  } catch (err) {
    throw new Error("Error getting posts by user");
  }
};

const likeAPI = async (on: string, userId: string): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation like($on: ID!, $likedBy: ID!){ like(on: $on, likedBy: $likedBy) }`,
      variables: { on, likedBy: userId },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.like) return true;
    return false;
  } catch (err) {
    throw new Error("unable to like");
  }
};

const undoLikeAPI = async (on: string, userId: string): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation undoLike($on: ID!, $likedBy: ID!){ undoLike(on: $on, likedBy: $likedBy) }`,
      variables: { on, likedBy: userId },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.undoLike) return true;
    return false;
  } catch (err) {
    throw new Error("unable to undo like");
  }
};

const dislikeAPI = async (on: string, userId: string): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation dislike($on: ID!, $dislikedBy: ID!){ dislike(on: $on, dislikedBy: $dislikedBy) }`,
      variables: { on, dislikedBy: userId },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.dislike) return true;
    return false;
  } catch (err) {
    throw new Error("unable to dislike");
  }
};

const undoDislikeAPI = async (on: string, userId: string): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation undoDislike($on: ID!, $dislikedBy: ID!){ undoDislike(on: $on, dislikedBy: $dislikedBy) }`,
      variables: { on, dislikedBy: userId },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.undoDislike) return true;
    return false;
  } catch (err) {
    throw new Error("unable to undo dislike");
  }
};

const followAPI = async (
  follower: string,
  following: string
): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation follow($follower: ID!, $following: ID!){ follow(follower: $follower, following: $following) }`,
      variables: { follower, following },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.follow) return true;
    return false;
  } catch (err) {
    throw new Error("unable to follow");
  }
};

const unfollowAPI = async (
  follower: string,
  following: string
): Promise<Boolean> => {
  try {
    const payload = {
      query: `mutation unfollow($follower: ID!, $following: ID!){ unfollow(follower: $follower, following: $following) }`,
      variables: { follower, following },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.unfollow) return true;
    return false;
  } catch (err) {
    throw new Error("unable to unfollow");
  }
};

const getCommentsByPost = async (
  postId: string,
  userId: string,
  skip: number
): Promise<IComment[]> => {
  try {
    const payload = {
      query: `query getCommentsByPost($postId:ID!,$userId:ID!,$limit:Int!,$skip:Int){
        getCommentsByPost(postId: $postId, userId: $userId, limit: $limit, skip: $skip) {
          id
          content
          associatedTo
          parentId
          createdBy {
            id
            username
            email
            isFollowed
            profile_picture
          }   
          createdAt
          dislikeCount
          dislikedByUser
          likeCount
          likedByUser 
          }
        }`,
      variables: {
        postId: postId,
        userId: userId,
        limit: 10,
        skip: skip,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getCommentsByPost)
      return response.data.data.getCommentsByPost as IComment[];
    return [];
  } catch (err) {
    console.log(err);
    throw new Error("unable to get comments");
  }
};

const getCommentsByUserAPI = async (
  commentUserId: string,
  userId: string,
  skip: number
): Promise<IComment[]> => {
  try {
    const payload = {
      query: `query getCommentsByUser($commentUserId:ID!,$userId:ID!,$limit:Int!,$skip:Int){
        getCommentsByUser(commentUserId: $commentUserId, userId: $userId, limit: $limit, skip: $skip) {
          id
          content
          associatedTo
          parentId
          createdBy {
            id
            username
            email
            isFollowed
            profile_picture
          }   
          createdAt
          dislikeCount
          dislikedByUser
          likeCount
          likedByUser
        }        
      }
      `,
      variables: {
        commentUserId: commentUserId,
        userId: userId,
        limit: 10,
        skip: skip,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getCommentsByUser)
      return response.data.data.getCommentsByUser as IComment[];
    throw new Error("unable to get comments");
  } catch (err) {
    throw new Error("unable to get comments");
  }
};

const getFollowersAPI = async (
  profileId: string,
  userId: string,
  skip: number
): Promise<IUser[]> => {
  try {
    const payload = {
      query: `query getFollowers($profileId:ID!,$userId:ID!,$limit:Int!,$skip:Int!){ 
        getFollowers(profileId:$profileId,userId:$userId,limit:$limit,skip:$skip){
         id
         username
         email
         isFollowed
         profile_picture
        }}
      `,
      variables: {
        profileId: profileId,
        userId: userId,
        limit: 10,
        skip: skip,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getFollowers)
      return response.data.data.getFollowers as IUser[];
    throw new Error("unable to get followers");
  } catch (err) {
    throw new Error("unable to get followers");
  }
};

const getFollowingAPI = async (
  profileId: string,
  userId: string,
  skip: number
): Promise<IUser[]> => {
  try {
    const payload = {
      query: `query getFollowing($profileId:ID!,$userId:ID!,$limit:Int!,$skip:Int!){
        getFollowing(profileId:$profileId,userId:$userId,limit:$limit,skip:$skip){
         id
         username
         email
         isFollowed
         profile_picture
        }
      }`,
      variables: {
        profileId: profileId,
        userId: userId,
        limit: 10,
        skip: skip,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getFollowing)
      return response.data.data.getFollowing as IUser[];
    throw new Error("unable to get following");
  } catch (err) {
    throw new Error("unable to get following");
  }
};

const getFollowersCountAPI = async (profileId: string): Promise<number> => {
  try {
    const payload = {
      query: `query getFollowersCount($profileId:ID!){
        getFollowersCount(profileId:$profileId)
      }`,
      variables: {
        profileId: profileId,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getFollowersCount !== undefined)
      return response.data.data.getFollowersCount;
    throw new Error("unable to get followers count");
  } catch (err) {
    throw new Error("unable to get followers count");
  }
};

const getFollowingCountAPI = async (profileId: string): Promise<number> => {
  try {
    const payload = {
      query: `query getFollowingCount($profileId:ID!){
        getFollowingCount(profileId:$profileId)
      }`,
      variables: {
        profileId: profileId,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.getFollowingCount !== undefined)
      return response.data.data.getFollowingCount;
    throw new Error("unable to get following count");
  } catch (err) {
    throw new Error("unable to get following count");
  }
};

const isFollowedAPI = async (
  follower: string,
  following: string
): Promise<boolean> => {
  try {
    const payload = {
      query: `query isFollowed($follower:ID!,$following:ID!){
        isFollowed(follower:$follower,following:$following)
      }`,
      variables: {
        follower: follower,
        following: following,
      },
    };
    const response = await postAPI.post("/", payload);
    return response.data?.data?.isFollowed;
  } catch (err) {
    throw new Error("unable to check if followed");
  }
};

const queryPostsAPI = async (
  userId: string,
  query: string,
  skip: number
): Promise<IPost[]> => {
  try {
    const payload = {
      query: `query query($userId:ID!,$query:String!,$limit:Int!,$skip:Int!){
        query(userId:$userId,query:$query,limit:$limit,skip:$skip){
          id
          title
          content
          mediaUrl
          createdAt
          createdBy{
            id
            username
            email
            profile_picture
            isFollowed
          }
          likeCount
          dislikeCount
          likedByUser
          dislikedByUser
        }
      }`,
      variables: {
        userId: userId,
        query: query,
        limit: 10,
        skip: skip,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.query) {
      return response.data.data.query as IPost[];
    }
    throw new Error("unable to query posts");
  } catch (err) {
    throw new Error("unable to query posts");
  }
};

const deletePostAPI = async (
  postId: string,
  userId: string
): Promise<boolean> => {
  try {
    const payload = {
      query: `mutation deletePost($postId:ID!,$userId:ID!){deletePost(postId:$postId,userId:$userId)}`,
      variables: { postId: postId, userId: userId },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.deletePost) return true;
    return false;
  } catch (err) {
    throw new Error("unable to delete post");
  }
};

const updatePostAPI = async (
  postId: string,
  userId: string,
  title: string,
  content: string,
  mediaUrl: string
): Promise<string> => {
  try {
    const payload = {
      query: `mutation updatePost($postId:ID!,$userId:ID!,$title:String!,$content:String!,$mediaUrl:String){updatePost(postId:$postId,userId:$userId,title:$title,content:$content,mediaUrl:$mediaUrl){
        id
        }}`,
      variables: {
        postId: postId,
        title: title,
        content: content,
        mediaUrl: mediaUrl,
        userId: userId,
      },
    };
    const response = await postAPI.post("/", payload);
    if (response.data?.data?.updatePost)
      return response.data.data.updatePost.id;
    throw new Error("unable to update post");
  } catch (err) {
    throw new Error("unable to update post");
  }
};

export {
  createPostAPI,
  createCommentAPI,
  getPostAPI,
  getPostsAPI,
  likeAPI,
  dislikeAPI,
  undoLikeAPI,
  undoDislikeAPI,
  followAPI,
  unfollowAPI,
  getCommentsByPost,
  deleteCommentAPI,
  updateCommentAPI,
  getFollowersAPI,
  getFollowingAPI,
  getCommentsByUserAPI,
  getFollowersCountAPI,
  getFollowingCountAPI,
  getPostsByUserAPI,
  isFollowedAPI,
  queryPostsAPI,
  updatePostAPI,
  deletePostAPI,
};
