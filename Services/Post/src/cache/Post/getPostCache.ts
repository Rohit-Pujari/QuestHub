import { cacheClient } from "../../config/cache";
import Post from "../../models/Post";
import { IPost } from "../../types";

export default async function getPostCache(id: string): Promise<IPost | null> {
  try {
    // Check if post exists in cache
    const cachedPost = await cacheClient.get(`post:${id}`);
    if (cachedPost) {
      return JSON.parse(cachedPost) as IPost;
    }

    // Fetch post from database
    const postDocument = await Post.findById(id).lean();
    if (postDocument) {
      const response: IPost = {
        id: postDocument._id.toString(),
        title: postDocument.title,
        content: postDocument.content,
        mediaUrl: postDocument.mediaUrl,
        createdBy: postDocument.createdBy,
        createdAt: postDocument.createdAt,
      };

      // Set post in cache with an expiration time
      await cacheClient.set(`post:${response.id}`, JSON.stringify(response), {
        EX: 3600, // Cache expires in 1 hour
      });
      return response;
    }

    return null; // Post not found
  } catch (err) {
    console.error(`Failed to fetch post ${id}:`, err); // Log error for debugging
    return null;
  }
}
