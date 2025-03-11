import { addCommentCache } from "../../cache/Comment";
import { addPostCache } from "../../cache/Post";
import { getUserCache } from "../../cache/User";
import { cacheClient } from "../../config/cache";
import { Comment, Dislike, Follow, Like, Post } from "../../models";
import { IComment, IPost, IUser } from "../../types";
import { addComment, removeComment, updateComment } from "./mutations/Comment";
import { addDislike, removeDislike } from "./mutations/Dislike";
import { addFollow, removeFollow } from "./mutations/Follow";
import { addLike, removeLike } from "./mutations/Like";
import { addPost, removePost, updatePost } from "./mutations/Post";
import { getCommentsWithDetails } from "./queries/Comment";
import { getPost, getPostsWithDetails } from "./queries/Post";

const resolvers = {
  Query: {
    getPost: async (
      _: any,
      { postId, userId }: { postId: string; userId: string }
    ): Promise<IPost> => {
      try {
        const post = await getPost(postId);
        const userInfo: IUser = await getUserCache(post.createdBy.id);
        const isFollowed = (await Follow.exists({
          follower: userId,
          following: post.createdBy.id,
        }))
          ? true
          : false;
        userInfo.isFollowed = isFollowed;
        const likeCount = (await Like.countDocuments({ on: post.id })) || 0;
        const dislikeCount =
          (await Dislike.countDocuments({ on: post.id })) || 0;
        const likedByUser = (await Like.exists({
          on: post.id,
          likedBy: userId,
        }))
          ? true
          : false;
        const dislikedByUser = (await Dislike.exists({
          on: post.id,
          dislikedBy: userId,
        }))
          ? true
          : false;
        const response: IPost = {
          id: post.id,
          title: post.title,
          content: post.content,
          mediaUrl: post.mediaUrl,
          createdBy: userInfo,
          createdAt: post.createdAt,
          likeCount: likeCount,
          dislikeCount: dislikeCount,
          likedByUser: likedByUser,
          dislikedByUser: dislikedByUser,
        };
        return response;
      } catch (err) {
        throw new Error("Error getting post");
      }
    },
    getPosts: async (
      _: any,
      { limit, skip, userId }: { limit: number; skip: number; userId: string }
    ): Promise<IPost[]> => {
      try {
        const postIds = (
          await Post.find({}, { id: 1 }).limit(limit).skip(skip)
        ).map((post) => post.id);
        const posts = await getPostsWithDetails(postIds, userId);
        return posts;
      } catch (err) {
        throw new Error("Error getting posts");
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
    ): Promise<IPost[]> => {
      try {
        const postIds = (
          await Post.find({ createdBy: { id: postUserId } }, { id: 1 })
            .limit(limit)
            .skip(skip)
        ).map((post) => post.id);
        const posts = await getPostsWithDetails(postIds, userId);
        return posts;
      } catch (err) {
        throw new Error("Error fetching posts");
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
    ): Promise<IComment[]> => {
      try {
        const commentIds = (
          await Comment.find({ associatedTo: postId }, { id: 1 })
            .limit(limit)
            .skip(skip)
        ).map((comment) => comment.id);
        const comments = getCommentsWithDetails(commentIds, userId);
        return comments;
      } catch (err) {
        throw new Error("Error fetching comments");
      }
    },
    getCommentsByUser: async (
      _: any,
      {
        commentUserId,
        limit,
        skip,
        userId,
      }: { commentUserId: string; userId: string; limit: number; skip: number }
    ): Promise<IComment[]> => {
      try {
        const commentIds = (
          await Comment.find({ createdBy: { id: commentUserId } }, { id: 1 })
            .limit(limit)
            .skip(skip)
        ).map((comment) => comment.id);
        const comments = await getCommentsWithDetails(commentIds, userId);
        return comments;
      } catch (err) {
        throw new Error("Error fetching comments");
      }
    },
    getFollowers: async (
      _: any,
      { userId, limit, skip }: { userId: string; limit: number; skip: number }
    ) => {
      try {
      } catch (err) {
        throw new Error("Error fetching followers");
      }
    },
  },
  Mutation: {
    createPost: async (
      _: any,
      {
        title,
        content,
        createdBy,
        mediaUrl,
      }: {
        title: string;
        content: string;
        createdBy: string;
        mediaUrl?: string;
      }
    ): Promise<IPost> => {
      try {
        const userInfo = await getUserCache(createdBy);
        if (!userInfo) throw new Error("User not found");
        const post = await addPost(title, createdBy, content, mediaUrl);
        if (post instanceof Error) {
          throw new Error("Error creating post");
        }
        userInfo.isFollowed = false;
        const response: IPost = {
          id: post.id,
          title: post.title,
          content: post.content,
          mediaUrl: post.mediaUrl,
          createdBy: userInfo,
          createdAt: post.createdAt,
          likeCount: 0,
          dislikeCount: 0,
          likedByUser: false,
          dislikedByUser: false,
        };
        return response;
      } catch (err) {
        throw new Error("Error creating post");
      }
    },
    updatePost: async (
      _: any,
      {
        postId,
        userId,
        title,
        content,
        mediaUrl,
      }: {
        postId: string;
        userId: string;
        title: string;
        content: string;
        mediaUrl?: string;
      }
    ): Promise<IPost> => {
      try {
        const check = await Post.exists({
          _id: postId,
          createdBy: { id: userId },
        });
        if (!check) {
          throw new Error(
            "Post not found or user is not authorized to update post"
          );
        }
        const post = await updatePost(postId, title, content, mediaUrl);
        if (post instanceof Error) {
          throw new Error("Error updating post");
        }
        if (!post) {
          throw new Error("Post not found");
        }
        const userInfo = await getUserCache(userId);
        userInfo.isFollowed = false;
        const likedByUser = !(await Like.exists({ on: postId, by: userId }));
        const dislikedByUser = !(await Dislike.exists({
          on: postId,
          by: userId,
        }));
        await addPostCache(post);
        const response: IPost = {
          id: post.id,
          title: post.title,
          content: post.content,
          mediaUrl: post.mediaUrl,
          createdBy: userInfo,
          createdAt: post.createdAt,
          likeCount: await Like.countDocuments({ on: postId }),
          dislikeCount: await Dislike.countDocuments({ on: postId }),
          likedByUser: likedByUser,
          dislikedByUser: dislikedByUser,
        };
        return response;
      } catch (err) {
        throw new Error("Error updating post");
      }
    },
    deletePost: async (
      _: any,
      { postId, userId }: { postId: string; userId: string }
    ): Promise<String> => {
      try {
        const check = await Post.exists({
          _id: postId,
          createdBy: { id: userId },
        });
        if (!check) {
          throw new Error(
            "Post not found or user is not authorized to delete post"
          );
        }
        await removePost(postId);
        await cacheClient.del(postId);
        return "Post deleted successfully";
      } catch (err) {
        throw new Error("Error deleting post");
      }
    },
    createComment: async (
      _: any,
      {
        associatedTo,
        content,
        createdBy,
        parentId,
      }: {
        associatedTo: string;
        content: string;
        createdBy: string;
        parentId?: string;
      }
    ): Promise<IComment> => {
      try {
        const comment = await addComment(
          associatedTo,
          createdBy,
          content,
          parentId
        );
        if (comment instanceof Error) {
          throw new Error("Error creating comment");
        }
        const userInfo = await getUserCache(createdBy);
        userInfo.isFollowed = false;
        const response: IComment = {
          id: comment.id,
          content: comment.content,
          createdBy: userInfo,
          createdAt: comment.createdAt,
          parentId: comment.parentId,
          associatedTo: comment.associatedTo,
          likeCount: 0,
          dislikeCount: 0,
          likedByUser: false,
          dislikedByUser: false,
        };
        return response;
      } catch (err) {
        throw new Error("Error creating comment");
      }
    },
    updateComment: async (
      _: any,
      {
        commentId,
        userId,
        content,
      }: { commentId: string; userId: string; content: string }
    ): Promise<IComment> => {
      try {
        const check = await Comment.exists({
          _id: commentId,
          createdBy: { id: userId },
        });
        if (!check) {
          throw new Error(
            "Comment not found or user is not authorized to update comment"
          );
        }
        const comment = await updateComment(commentId, content);
        if (comment instanceof Error) {
          throw new Error("Error updating comment");
        }
        if (!comment) {
          throw new Error("Comment not found");
        }
        const userInfo = await getUserCache(userId);
        const likedByUser = !(await Like.exists({ on: commentId, by: userId }));
        const dislikedByUser = !(await Dislike.exists({
          on: commentId,
          by: userId,
        }));
        userInfo.isFollowed = false;
        await addCommentCache(comment);
        const response: IComment = {
          id: comment.id,
          content: comment.content,
          createdBy: userInfo,
          createdAt: comment.createdAt,
          parentId: comment.parentId,
          associatedTo: comment.associatedTo,
          likeCount: await Like.countDocuments({ on: commentId }),
          dislikeCount: await Dislike.countDocuments({ on: commentId }),
          likedByUser: likedByUser,
          dislikedByUser: dislikedByUser,
        };
        return response;
      } catch (err) {
        throw new Error("Error updating comment");
      }
    },
    deleteComment: async (
      _: any,
      { commentId, userId }: { commentId: string; userId: string }
    ): Promise<String> => {
      try {
        const check = await Comment.exists({
          _id: commentId,
          createdBy: { id: userId },
        });
        if (!check) {
          throw new Error(
            "Comment not found or user is not authorized to delete comment"
          );
        }
        await removeComment(commentId);
        await cacheClient.del(commentId);
        return "Comment deleted successfully";
      } catch (err) {
        throw new Error("Error deleting comment");
      }
    },
    like: async (
      _: any,
      { on, likedBy }: { on: string; likedBy: string }
    ): Promise<String> => {
      try {
        const check =
          (await Post.exists({ _id: on })) ||
          (await Comment.exists({ _id: on }));
        if (!check) {
          throw new Error("Post not found");
        }
        const like = await addLike(on, likedBy);
        if (like instanceof Error) {
          throw new Error("Error liking post");
        }
        return "Post liked successfully";
      } catch (err) {
        throw new Error("Error liking post");
      }
    },
    dislike: async (
      _: any,
      { on, dislikedBy }: { on: string; dislikedBy: string }
    ): Promise<String> => {
      try {
        const check =
          (await Post.exists({ _id: on })) ||
          (await Comment.exists({ _id: on }));
        if (!check) {
          throw new Error("Post not found");
        }
        const dislike = await addDislike(on, dislikedBy);
        if (dislike instanceof Error) {
          throw new Error("Error disliking post");
        }
        return "Post disliked successfully";
      } catch (err) {
        throw new Error("Error disliking post");
      }
    },
    undoLike: async (
      _: any,
      { on, likedBy }: { on: string; likedBy: string }
    ): Promise<String> => {
      try {
        const check =
          (await Post.exists({ _id: on })) ||
          (await Comment.exists({ _id: on }));
        if (!check) {
          throw new Error("Post not found");
        }
        const like = await removeLike(on, likedBy);
        return like;
      } catch (err) {
        throw new Error("Error undoing like");
      }
    },
    undoDislike: async (
      _: any,
      { on, dislikedBy }: { on: string; dislikedBy: string }
    ): Promise<String> => {
      try {
        const check =
          (await Post.exists({ _id: on })) ||
          (await Comment.exists({ _id: on }));
        if (!check) {
          throw new Error("Post not found");
        }
        const dislike = await removeDislike(on, dislikedBy);
        return dislike;
      } catch (err) {
        throw new Error("Error undoing dislike");
      }
    },
    follow: async (
      _: any,
      { follower, following }: { follower: string; following: string }
    ): Promise<String> => {
      try {
        const follow = await addFollow(follower, following);
        if (follow instanceof Error) {
          throw new Error("Error following user");
        }
        return "User followed successfully";
      } catch (err) {
        throw new Error("Error following user");
      }
    },
    unfollow: async (
      _: any,
      { follower, following }: { follower: string; following: string }
    ): Promise<String> => {
      try {
        const follow = await removeFollow(follower, following);
        return follow;
      } catch (err) {
        throw new Error("Error unfollowing user");
      }
    },
  },
};
export default resolvers;
