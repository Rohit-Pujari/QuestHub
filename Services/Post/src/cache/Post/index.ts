import { Post } from "../../models";
import { IPost } from "../../types";
import { cacheClient } from "./../../config/cache";

const addPostCache = async (post: IPost): Promise<IPost> => {
  // Add post to cache
  try {
    const cachePost: IPost = {
      id: post.id,
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdBy: post.createdBy,
      createdAt: post.createdAt,
    };
    const success = await cacheClient.set(
      cachePost.id,
      JSON.stringify(cachePost)
    );
    if (!success) {
      throw new Error("Error adding post to cache");
    }
    return cachePost;
  } catch (err) {
    throw new Error("Error adding post to cache");
  }
};

const getPostCache = async (postId: string): Promise<IPost> => {
  // Get post from cache
  try {
    const post = await cacheClient.get(postId);
    if (!post) {
      const post = await Post.findById(postId);
      if (!post) throw new Error("Post not found");
      const response = await addPostCache(post);
      return response;
    }
    const parsedPost: IPost = JSON.parse(post);
    const response: IPost = {
      id: parsedPost.id,
      title: parsedPost.title,
      content: parsedPost.content,
      mediaUrl: parsedPost.mediaUrl,
      createdBy: parsedPost.createdBy,
      createdAt: parsedPost.createdAt,
    };
    return response;
  } catch (err) {
    throw new Error("Error getting post from cache");
  }
};

export { addPostCache, getPostCache };
