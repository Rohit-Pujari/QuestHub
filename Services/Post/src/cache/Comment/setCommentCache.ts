import { error } from "console";
import { IComment } from "../../types";
import { cacheClient } from "../../config/cache";

export default async function setCommentCache(
  comment: IComment
): Promise<boolean> {
  try {
    if (!comment || !comment.id) {
      return false;
    }
    const cacheComment = await cacheClient.set(
      `comment:${comment.id}`,
      JSON.stringify(comment),
      {
        EX: 3600,
      }
    );
    if (cacheComment) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(
      `setCommentCache failed for comment with id:${comment.id} with error:${error}`
    );
    return false;
  }
}
