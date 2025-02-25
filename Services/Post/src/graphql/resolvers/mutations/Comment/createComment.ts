import setCommentCache from "../../../../cache/Comment/setCommentCache";
import { cacheClient } from "../../../../config/cache";
import Comment from "../../../../models/Comments";

export default async function createCommentMain(
  content: string,
  createdBy: string,
  associatedTo: string,
  parentId?: string
) {
  try {
    const comment = new Comment({
      content: content,
      parentId: parentId,
      createdBy: createdBy,
      associatedTo: associatedTo,
    });
    const savedComment = await comment.save();
    if (savedComment) {
      const response = {
        id: savedComment.id,
        content: savedComment.content,
        parentId: savedComment.parentId,
        createdBy: savedComment.createdBy,
        associatedTo: savedComment.associatedTo,
        createdAt: savedComment.createdAt,
      };
      const cacheComment = await setCommentCache(response);
      if (cacheComment) {
        return response;
      }
      return null;
    }
    return null;
  } catch (err) {
    return null;
  }
}
