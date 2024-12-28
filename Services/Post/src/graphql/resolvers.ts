import Comment from "../models/Comments";
import Post, { IPost } from "../models/Post";
import Like, { ILike } from "../models/Likes";
import Dislike, { IDislike } from "../models/Dislike";
import { getUserInfo } from "../service-comms/auth";
import DataLoader from "dataloader";

const userLoader = new DataLoader(async (userIds: readonly string[]) => {
  const responses = await Promise.all(userIds.map((id) => getUserInfo(id)));
  return responses.map((response) => response.data.user);
});

const resloveOnModel = async (id: string, onModel: string) => {
  if (onModel === "Post") {
    return await Post.findById(id);
  }
  if (onModel === "Comment") {
    return await Comment.findById(id);
  }
  return null;
};

const resolvers = {
  LikeDislike: {
    __resolveType(obj: {
      title?: string;
      content?: string;
    }): "Post" | "Comment" | null {
      if (obj.title) {
        return "Post";
      }
      if (obj.content) {
        return "Comment";
      }
      return null;
    },
  },
  Query: {
    getPosts: async (
      _: any,
      { limit, skip }: { limit: number; skip: number }
    ) => {
        try {
          const posts = await Post.find().skip(skip).limit(limit);
          return posts || [];
        } catch (error) {
          console.error("Error fetching posts:", error);
          return [];
        }
    },
    getPost: async (_: any, { postId }: { postId: string }) => {
        try{
            const post = await Post.findById(postId);
            return post;
        } catch (error) {
            return null;
        }
    },
    getPostsByUser: async (
      _: any,
      {
        username,
        limit,
        skip,
      }: { username: string; limit: number; skip: number }
    ) => {
        try{
            const posts = await Post.find({ createdBy: username }).skip(skip).limit(limit);
            return posts || [];
        } catch (error) {
            return [];
        }
    },
    getCommentsByPost: async (
      _: any,
      { postId, limit, skip }: { postId: string; limit: number; skip: number }
    ) => {
        try{
            const comments = await Comment.find({ associatedTo: postId }).skip(skip).limit(limit);
            return comments || [];
        }
        catch (error) {
            return [];
        }
    },
    getCommentsByUser: async (
      _: any,
      {
        createdBy,
        skip,
        limit,
      }: { createdBy: string; skip: number; limit: number }
    ) => {
        try{
            const comments = await Comment.find({ createdBy: createdBy }).skip(skip).limit(limit);
            return comments || [];
        } catch (error) { 
            return [];
        }
    },
    getLikes: async (_: any, { on }: { on: string }) => {
      // Define a model dynamically based on the 'on' field
      const model =
        on === "Post" ? "Post" : on === "Comment" ? "Comment" : null;

      if (!model) {
        throw new Error('Invalid model type provided for "on"');
      }

      // Fetch likes and populate the 'on' field with the correct model
      const like = await Like.find({ onModel: on }).populate({
        path: "on",
        model: model,
      });

      return like.length;
    },
    getDislikes: async (_: any, { on }: { on: string }) => {
        // Define a model dynamically based on the 'on' field
      const model =
      on === "Post" ? "Post" : on === "Comment" ? "Comment" : null;

    if (!model) {
      throw new Error('Invalid model type provided for "on"');
    }

    // Fetch likes and populate the 'on' field with the correct model
    const dislike = await Dislike.find({ onModel: on }).populate({
      path: "on",
      model: model,
    });

    return dislike.length;
    },
  },
  Mutation: {
    createPost: async (
      _: any,
      { title, content, mediaUrl, createdBy }: IPost
    ) => {
      const newPost = new Post({ title, content, mediaUrl, createdBy });
      return await newPost.save();
    },
    updatePost: async (
      _: any,
      {
        postId,
        title,
        content,
        mediaUrl,
      }: { postId: string; title: string; content: string; mediaUrl?: string }
    ) => {
      const post = await Post.findById(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, content, mediaUrl },
        { new: true }
      );
      return updatedPost;
    },
    deletePost: async (_: any, { postId }: { postId: string }) => {
      const post = await Post.findByIdAndDelete(postId);
      if (!post) {
        throw new Error("Post not found");
      }
      return "Post deleted successfully";
    },
    like: async (
      _: any,
      { on, likedBy, onModel }: { on: string; likedBy: string; onModel: string }
    ) => {
      const newLike = new Like({ on, likedBy, onModel });
      return await newLike.save();
    },
    dislike: async (
      _: any,
      {
        on,
        dislikedBy,
        onModel,
      }: { on: string; dislikedBy: string; onModel: string }
    ) => {
      const newDislike = new Dislike({ on, dislikedBy, onModel });
      return await newDislike.save();
    },
    undoLike: async (_: any, { likeId }: { likeId: string }) => {
      try{
        const like = await Like.findOneAndDelete({ likeId });
        return like
      }
      catch (error) {
        throw error
      }
    },
    undoDislike: async (_: any, { dislikeId }: { dislikeId: string }) => {
      try{
        const dislike = await Dislike.findOneAndDelete({ dislikeId });
        return dislike
      }
      catch (error) {
        throw error
      }
    },
    createComment: async (
      _: any,
      {
        content,
        parentId,
        associatedTo,
        createdBy,
      }: {
        content: string;
        parentId?: string;
        associatedTo: string;
        createdBy: string;
      }
    ) => {
      const newComment = new Comment({
        content,
        parentId,
        associatedTo,
        createdBy,
      });
      return await newComment.save();
    },
    deleteComment: async (_: any, { commentId }: { commentId: string }) => {
      const comment = await Comment.findByIdAndDelete(commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }
      return "Comment deleted successfully";
    },
  },
  Like: {
    on: async (like: ILike) => resloveOnModel(like.on, like.onModel),
    likedBy: async (like: ILike) => {
      return userLoader.load(like.likedBy);
    }
  },
  Dislike: {
    on: async (like: ILike) => resloveOnModel(like.on, like.onModel),
    dislikedBy: async (like: IDislike) => {
      return userLoader.load(like.dislikedBy);
    }
  },
  Post: {
    createdBy: async (parent: IPost) => {
      return userLoader.load(parent.createdBy);
    },
  },
  Comment: {
    createdBy: async (parent: IPost) => {
      return userLoader.load(parent.createdBy);
    },
  },
};

export default resolvers;
