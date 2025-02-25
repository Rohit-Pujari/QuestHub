import setPostCache from "../../../../cache/Post/setPostCache";
import getUserinfoCache from "../../../../cache/User/getUserInfoCache";
import Post from "../../../../models/Post";
import { IPost } from "../../../../types";
import getPostMain from "../../queries/Post/getPost";

export default async function updatePostMain(
  id: string,
  userId: string,
  title: string,
  content: string,
  mediaUrl: string
): Promise<IPost | Error> {
  try {
    const userinfo = await getUserinfoCache(userId);
    if (!userinfo || !userinfo.id) {
      return new Error(`Cannot Update Post:${id}`);
    }
    const post = await getPostMain(id);
    if (!post || !post.id) {
      return new Error(`Cannot Update Post:${id}`);
    }
    if (post.createdBy !== userinfo.id) {
      return new Error(`Cannot Update Post:${id}`);
    }
    const updatedPost = await Post.findByIdAndUpdate(
      post.id,
      { title: title, content: content, mediaUrl: mediaUrl },
      { new: true }
    ).lean();
    if (updatedPost) {
      const response = {
        id: updatedPost._id.toString(),
        title: updatedPost.title,
        content: updatedPost.content,
        mediaUrl: updatedPost.mediaUrl,
        createdBy: updatedPost.createdBy,
        createdAt: updatedPost.createdAt,
      };
      await setPostCache(response);
      return response;
    }
    return new Error(`Error Updating Post:${id}`);
  } catch (err) {
    return new Error("Error updating Post");
  }
}
