import { cacheClient } from "../../config/cache";
import Comment from "../../models/Comments";
import { IComment } from "../../types";

export default async function getCommentCache(
  id: string
): Promise<IComment | null> {
  try {
    const commentCache = await cacheClient.get(`comment:${id}`);
    if (commentCache) {
      return JSON.parse(commentCache) as IComment;
    }
    const commentDocument = await Comment.findById(id).lean();
    if (commentDocument) {
      const response: IComment = {
        id: commentDocument._id.toString(),
        content: commentDocument.content,
        parentId: commentDocument.parentId,
        associatedTo: commentDocument.associatedTo,
        createdBy: commentDocument.createdBy,
        createdAt: commentDocument.createdAt,
      };
      await cacheClient.set(
        `comment:${response.id}`,
        JSON.stringify(response),
        {
          EX: 3600,
        }
      );
      return response;
    }
    return null;
  } catch (err) {
    console.log(`falied to fetch comment with id:${id}`, err);
    return null;
  }
}
