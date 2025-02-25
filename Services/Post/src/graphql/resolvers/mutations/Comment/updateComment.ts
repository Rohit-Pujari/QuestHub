import setCommentCache from "../../../../cache/Comment/setCommentCache";
import getUserinfoCache from "../../../../cache/User/getUserInfoCache";
import Comment from "../../../../models/Comments";
import getComment from "../../queries/Comment/getComment";

export default async function updateCommentMain(
  id: string,
  userid: string,
  content: string
) {
  try {
    const user = await getUserinfoCache(userid);
    if (!user || !user.id) {
      return new Error("Login to update Comment");
    }
    const comment = await getComment(id);
    if (!comment || !comment.id) {
      return new Error(`Cannot Update Comment:${id}`);
    }
    if (comment.createdBy !== user.id) {
      return new Error(`Cannot Update Comment:${id}`);
    }
    const updatedComment = await Comment.findByIdAndUpdate(
      comment.id,
      { content: content },
      { new: true }
    ).lean();
    if (updatedComment) {
      const response = {
        id: updatedComment._id.toString(),
        content: updatedComment.content,
        parentId: updatedComment.parentId,
        createdBy: updatedComment.createdBy,
        associatedTo: updatedComment.associatedTo,
        createdAt: updatedComment.createdAt,
      };
      await setCommentCache(response);
      return response;
    }
    return new Error(`Error Updating Comment:${id}`);
  } catch {
    return new Error("Error updating Comment");
  }
}
