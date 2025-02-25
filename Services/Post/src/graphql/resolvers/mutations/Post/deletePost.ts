import { cacheClient } from "../../../../config/cache";
import Post from "../../../../models/Post";
import getPostMain from "../../queries/Post/getPost";

export default async function deletePostMain(
  id: string,
  userId: string
): Promise<boolean> {
  try {
    const post = await getPostMain(id);
    if (!post || !post.id) {
      return false;
    }
    if (post.createdBy !== userId) {
      return false;
    }
    const deletePost = await Post.findByIdAndDelete(id).lean();
    if (deletePost) {
      await cacheClient.del(`Post:${id}`);
      return true;
    }
    return false;
  } catch (err) {
    return false;
  }
}
