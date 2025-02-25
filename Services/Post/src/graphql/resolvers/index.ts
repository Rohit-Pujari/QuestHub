import getUserinfoCache from "../../cache/User/getUserInfoCache";
import Post from "../../models/Post";
import createPostMain from "./mutations/Post/createPost";
import { IComment } from "./../../types/index";
import Like from "../../models/Likes";
import Dislike from "../../models/Dislike";
import getPostMain from "./queries/Post/getPost";
import updatePostMain from "./mutations/Post/updatePost";
import getLikeCount from "./queries/Like/getLikeCount";
import getDislikeCount from "./queries/Dislike/getDislikeCount";
import getLikeExists from "./queries/Like/getLikeExists";
import getDislikeExists from "./queries/Dislike/getDislikeExists";
import deletePostMain from "./mutations/Post/deletePost";
import Comment from "../../models/Comments";
import getComment from "./queries/Comment/getComment";
import getPostsMain from "./queries/Post/getPosts";
import getComments from "./queries/Comment/getComments";
import createCommentMain from "./mutations/Comment/createComment";
import updateCommentMain from "./mutations/Comment/updateComment";
import deleteCommentMain from "./mutations/Comment/deleteComment";

const resolvers = {
  Query: {
    getPosts: async (
      _: any,
      { userId, limit, skip }: { userId: string; limit: number; skip: number }
    ) => {
      try {
        const postIds = (
          await Post.find({}, "_id").skip(skip).limit(limit).lean()
        ).map((post) => post._id.toString());
        const posts = await getPostsMain(postIds, userId);
        if (posts) {
          return posts;
        }
        return new Error("Error Occurred While Fetching Posts");
      } catch (err) {
        return new Error("Error Occurred While Fetching Posts");
      }
    },
    getPost: async (
      _: any,
      { postId, userId }: { postId: string; userId: string }
    ) => {
      try {
        const post = await getPostMain(postId);
        if (post) {
          const userInfo = await getUserinfoCache(post.createdBy);
          if (!userInfo || !userInfo.id) {
            await Post.findByIdAndDelete(postId);
            return new Error("Error loading Post");
          }
          const response = {
            id: post.id,
            title: post.title,
            content: post.content,
            mediaUrl: post.mediaUrl,
            createdBy: userInfo,
            createdAt: post.createdAt,
            likeCount: await getLikeCount(post.id),
            dislikeCount: await getDislikeCount(post.id),
            likedByUser: await getLikeExists(post.id, userId),
            dislikedByUser: await getDislikeExists(post.id, userId),
          };
          return response;
        }
        return new Error("Post not Found");
      } catch (err) {
        return new Error("Error loading Post");
      }
    },
    getPostsByUser: async (
      _: any,
      {
        postUserId,
        userId,
        limit,
        skip,
      }: { postUserId: string; userId: string; limit: number; skip: number }
    ) => {
      try {
        const postIds = (
          await Post.find({ createdBy: postUserId }, "_id")
            .skip(skip)
            .limit(limit)
            .lean()
        ).map((post) => post._id.toString());
        const posts = await getPostsMain(postIds, userId);
        if (!posts) {
          return new Error("Error loading Posts");
        }
        return posts;
      } catch (err) {
        return new Error("Error loading Posts");
      }
    },
    getCommentsByPost: async (
      _: any,
      {
        postId,
        userId,
        limit,
        skip,
      }: { postId: string; userId: string; limit: number; skip: number }
    ) => {
      try {
        const commentIds = (
          await Comment.find({ on: postId }, "_id")
            .skip(skip)
            .limit(limit)
            .lean()
        ).map((comment) => comment._id.toString());
        const comments = await getComments(commentIds, userId);
        if (!comments) {
          return new Error("Error loading Comments");
        }
        return comments;
      } catch (err) {
        return new Error("Error loading Comments");
      }
    },
    getCommentsByUser: async (
      _: any,
      {
        commentUserId,
        userId,
        limit,
        skip,
      }: { commentUserId: string; userId: string; limit: number; skip: number }
    ) => {
      try {
        const commentIds = (
          await Comment.find({ createdBy: commentUserId }, "_id")
            .skip(skip)
            .limit(limit)
            .lean()
        ).map((comment) => comment._id.toString());
        const comments = await getComments(commentIds, userId);
        if (!comments) {
          return new Error("Error loading Comments");
        }
        return comments;
      } catch (err) {
        return new Error("Error loading Comments");
      }
    },
  },
  Mutation: {
    createPost: async (
      _: any,
      {
        title,
        content,
        mediaUrl,
        createdBy,
      }: {
        title: string;
        content: string;
        mediaUrl: string;
        createdBy: string;
      }
    ) => {
      try {
        const user = await getUserinfoCache(createdBy);
        if (!user || !user.id) {
          return new Error("Login to create Post");
        }
        const post = await createPostMain({
          title: title,
          content: content,
          mediaUrl: mediaUrl,
          createdBy: createdBy,
        });
        if (post) {
          const response = {
            id: post.id,
            title: post.title,
            content: post.content,
            mediaUrl: post.mediaUrl,
            createdBy: user,
            createdAt: post.createdAt,
            likeCount: 0,
            dislikeCount: 0,
            likedByUser: false,
            dislikedByUser: false,
          };
          return response;
        }
        return new Error("Error Occurred try again later");
      } catch (err) {
        return new Error("Error Occurred While Creating Post");
      }
    },
    updatePost: async (
      _: any,
      {
        id,
        userId,
        title,
        content,
        mediaUrl,
      }: {
        id: string;
        userId: string;
        title: string;
        content: string;
        mediaUrl: string;
      }
    ) => {
      try {
        const updatedPost = await updatePostMain(
          id,
          userId,
          title,
          content,
          mediaUrl
        );
        if (updatedPost && !(updatedPost instanceof Error)) {
          const response = {
            id: updatedPost.id,
            title: updatedPost.title,
            content: updatedPost.content,
            mediaUrl: updatedPost.mediaUrl,
            createdBy: await getUserinfoCache(updatedPost.createdBy),
            createdAt: updatedPost.createdAt,
            likeCount: await getLikeCount(updatedPost.id),
            dislikeCount: await getDislikeCount(updatedPost.id),
            likedByUser: await getLikeExists(updatedPost.id, userId),
            dislikedByUser: await getDislikeExists(updatedPost.id, userId),
          };
          return response;
        }
        return updatedPost;
      } catch (err) {
        return new Error("Error updating Post");
      }
    },
    deletePost: async (
      _: any,
      { id, userId }: { id: string; userId: string }
    ) => {
      try {
        const deletePost = await deletePostMain(id, userId);
        if (deletePost) {
          return "Post Deleted Successfully";
        }
        return new Error("Error deleting Post");
      } catch (err) {
        return new Error("Error deleting Post");
      }
    },
    createComment: async (
      _: any,
      {
        content,
        parentId,
        createdBy,
        associatedTo,
      }: {
        content: string;
        parentId: string;
        createdBy: string;
        associatedTo: string;
      }
    ) => {
      try {
        const user = await getUserinfoCache(createdBy);
        if (!user || !user.id) {
          return new Error("Login to create Comment");
        }
        const comment = await createCommentMain(
          content,
          createdBy,
          associatedTo,
          parentId
        );
        if (comment) {
          const response = {
            id: comment.id,
            content: comment.content,
            parentId: comment.parentId,
            createdBy: user,
            associatedTo: comment.associatedTo,
            createdAt: comment.createdAt,
            likeCount: 0,
            dislikeCount: 0,
            likedByUser: false,
            dislikedByUser: false,
          };
          return response;
        }
        return new Error("Error creating Comment");
      } catch (err) {
        return new Error("Error creating Comment");
      }
    },
    updateComment: async (
      _: any,
      { id, userId, content }: { id: string; userId: string; content: string }
    ) => {
      try {
        const updatedComment = await updateCommentMain(id, userId, content);
        if (updatedComment && !(updatedComment instanceof Error)) {
          const response = {
            id: updatedComment.id,
            content: updatedComment.content,
            parentId: updatedComment.parentId,
            createdBy: await getUserinfoCache(updatedComment.createdBy),
            associatedTo: updatedComment.associatedTo,
            createdAt: updatedComment.createdAt,
            likeCount: await getLikeCount(updatedComment.id),
            dislikeCount: await getDislikeCount(updatedComment.id),
            likedByUser: await getLikeExists(updatedComment.id, userId),
            dislikedByUser: await getDislikeExists(updatedComment.id, userId),
          };
          return response;
        }
        return updatedComment;
      } catch (err) {
        return new Error("Error updating Comment");
      }
    },
    deleteComment: async (
      _: any,
      { id, userId }: { id: string; userId: string }
    ) => {
      try {
        const deletedComment = await deleteCommentMain(id, userId);
        if (deletedComment) {
          return "Comment Deleted Successfully";
        }
        return new Error("Error deleting Comment");
      } catch (err) {
        return new Error("Error deleting Comment");
      }
    },
  },
};

export default resolvers;
