import { Comment, Dislike, Like, Post } from "../../../../models";

const addComment = async (
  postId: string,
  userId: string,
  content: string,
  parentId?: string
) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (parentId) {
      const checkComment = await Comment.findById(parentId);
      if (!checkComment) {
        throw new Error("Parent comment not found");
      }
    }
    const comment = await Comment.create({
      content: content,
      associatedTo: postId,
      createdBy: { id: userId },
      parentId: parentId || "",
      likeCount: 0,
      dislikeCount: 0,
    });
    return comment.save();
  } catch (err) {
    console.log(err);
    throw new Error("Failed to add comment");
  }
};

const updateComment = async (id: string, content: string) => {
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      {
        content: content,
      },
      { new: true }
    );
    return updatedComment;
  } catch (err) {
    throw new Error("Failed to update comment");
  }
};

const removeComment = async (id: string) => {
  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      throw new Error("Comment not found");
    }
    const deleteLikesDislikes =
      (await Like.deleteMany({ on: id })) &&
      (await Dislike.deleteMany({ on: id }));
    if (!deleteLikesDislikes)
      throw new Error(
        "Failed to delete likes and dislikes for the post which got deleted"
      );
    return "Comment deleted successfully";
  } catch (err) {
    throw new Error("Failed to delete comment");
  }
};

export { addComment, updateComment, removeComment };
