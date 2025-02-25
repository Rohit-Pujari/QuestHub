import setPostCache from "../../../../cache/Post/setPostCache";
import Post from "../../../../models/Post";
import { IPost } from "../../../../types";

export default async function createPostMain({
  title,
  content,
  mediaUrl,
  createdBy,
}: {
  title: string;
  content: string;
  mediaUrl?: string;
  createdBy: string;
}): Promise<IPost | null> {
  try {
    const post = new Post({
      title: title,
      content: content,
      mediaUrl: mediaUrl,
      createdBy: createdBy,
    });
    const savedPost = await post.save();
    if (savedPost) {
      const post: IPost = {
        id: savedPost.id,
        title: savedPost.title,
        content: savedPost.content,
        mediaUrl: savedPost.mediaUrl,
        createdBy: savedPost.createdBy,
        createdAt: savedPost.createdAt,
      };
      const cachePost = await setPostCache(post);
      if (cachePost) {
        return post;
      }
      return null;
    }
    return null;
  } catch (err) {
    console.log(`createPost failed for post with`);
    return null;
  }
}
