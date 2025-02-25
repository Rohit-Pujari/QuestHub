import { cacheClient } from "../../config/cache";
import { IPost } from "../../types";

export default async function setPostCache(post: IPost): Promise<boolean> {
  try {
    if (!post || !post.id) {
      return false;
    }
    const cachePost = await cacheClient.set(
      `post:${post.id}`,
      JSON.stringify(post),
      {
        EX: 3600,
      }
    );
    if (cachePost) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(
      `setPostCache failed for post with id:${post.id} with error:${err}`
    );
    return false;
  }
}
