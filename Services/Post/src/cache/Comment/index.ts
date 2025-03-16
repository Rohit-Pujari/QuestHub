import { cacheClient } from "../../config/cache";
import { Comment } from "../../models";
import { IComment } from "../../types";

const addCommentCache = async (comment: IComment): Promise<IComment> => {
  try {
    const cacheComment: IComment = {
      id: comment.id,
      content: comment.content,
      parentId: comment.parentId,
      associatedTo: comment.associatedTo,
      createdBy: comment.createdBy,
      createdAt: comment.createdAt,
      likeCount: comment.likeCount,
      dislikeCount: comment.dislikeCount,
    };
    const success = await cacheClient.set(
      cacheComment.id,
      JSON.stringify(cacheComment),
      {
        EX: 60,
      }
    );
    if (!success) {
      throw new Error("Error adding comment to cache");
    }
    return cacheComment;
  } catch (err) {
    throw new Error("Error adding comment to cache");
  }
};

const getCommentCache = async (commentId: string): Promise<IComment> => {
  try {
    const comment = await cacheClient.get(commentId);
    if (!comment) {
      const comment = await Comment.findById(commentId);
      if (!comment) throw new Error("Comment not found");
      const response = await addCommentCache(comment);
      return response;
    }
    const parsedComment: IComment = JSON.parse(comment);
    const response: IComment = {
      id: parsedComment.id,
      content: parsedComment.content,
      parentId: parsedComment.parentId,
      associatedTo: parsedComment.associatedTo,
      createdBy: parsedComment.createdBy,
      createdAt: parsedComment.createdAt,
      likeCount: parsedComment.likeCount,
      dislikeCount: parsedComment.dislikeCount,
    };
    return response;
  } catch (err) {
    throw new Error("Error getting comment from cache");
  }
};

export { addCommentCache, getCommentCache };
