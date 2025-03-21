import { Comment, Dislike, Like, Post } from "../../../../models/index";
import { IPost } from "../../../../types";

const addPost = async (
  title: string,
  userId: string,
  content: string,
  mediaUrl?: string
): Promise<IPost | Error> => {
  try {
    const post = await Post.create({
      title: title,
      content: content,
      mediaUrl: mediaUrl,
      createdBy: { id: userId },
      likeCount: 0,
      dislikeCount: 0,
    });
    return post.save();
  } catch (err) {
    throw new Error("Failed to add post");
  }
};

const updatePost = async (
  id: string,
  title: string,
  content: string,
  mediaUrl?: string
) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title: title, content: content, mediaUrl: mediaUrl },
      { new: true }
    );
    return updatedPost;
  } catch (err) {
    throw new Error("Failed to update post");
  }
};

const removePost = async (id: string) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(id);
    if (!deletedPost) {
      throw new Error("Post not found");
    }
    const deleteLikesDislikes =
      (await Like.deleteMany({ on: id })) &&
      (await Comment.deleteMany({ on: id }));
    if (!deleteLikesDislikes)
      throw new Error(
        "Failed to delete likes and dislikes for the post which got deleted"
      );
    return "Post deleted successfully";
  } catch (err) {
    throw new Error("Failed to delete post");
  }
};

export { addPost, updatePost, removePost };
