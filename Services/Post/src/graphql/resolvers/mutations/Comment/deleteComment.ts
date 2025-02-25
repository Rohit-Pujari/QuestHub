import { cacheClient } from "../../../../config/cache";
import Comment from "../../../../models/Comments";
import getComment from "../../queries/Comment/getComment";

export default async function deleteCommentMain(id: string, userId: string) {
  try {
    const comment = await getComment(id);
    if (!comment || !comment.id) {
      return new Error(`Cannot Delete Comment:${id}`);
    }
    if (comment.createdBy !== userId) {
      return new Error(`Cannot Delete Comment:${id}`);
    }
    const deletedComment = await Comment.findByIdAndDelete(id).lean();
    if (deletedComment) {
      await cacheClient.del(`comment:${id}`);
      return true;
    }
    return new Error(`Error Deleting Comment:${id}`);
  } catch (err) {
    return false;
  }
}
