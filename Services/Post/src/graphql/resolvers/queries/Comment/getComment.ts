import getCommentCache from "../../../../cache/Comment/getCommentCache";
import { cacheClient } from "../../../../config/cache";
import Comment from "../../../../models/Comments";
import { IComment } from "../../../../types";

export default async function getComment(id: string): Promise<IComment | null> {
  try {
    const cacheComment = await getCommentCache(id);
    if (cacheComment) {
      return cacheComment;
    }
    const comment = await Comment.findById(id).lean();
    if (comment) {
      const response = {
        id: comment._id.toString(),
        content: comment.content,
        parentId: comment.parentId,
        associatedTo: comment.associatedTo,
        createdBy: comment.createdBy,
        createdAt: comment.createdAt,
      }
      await cacheClient.set(`comment:${id}`, JSON.stringify(response));
      return response;
    }
    return null;
  } catch (err) {
    console.log(`getComment method failed with error:${err}`);
    return null;
  }
}
