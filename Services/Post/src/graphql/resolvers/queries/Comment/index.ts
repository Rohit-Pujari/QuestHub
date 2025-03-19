import { getCommentCache } from "../../../../cache/Comment";
import { getUserCache } from "../../../../cache/User";
import { Dislike, Follow, Like } from "../../../../models";
import { IComment, IUser } from "../../../../types";

const getComment = async (id: string): Promise<IComment> => {
  try {
    const comment = await getCommentCache(id);
    return comment;
  } catch (err) {
    throw new Error("Error getting comment from cache");
  }
};

const getComments = async (ids: string[]): Promise<IComment[]> => {
  try {
    const comments = await Promise.all(
      ids.map(async (id) => {
        const comment = await getComment(id);
        return comment;
      })
    );
    const filteredComments = comments.filter(
      (comment) => comment !== null
    ) as IComment[];
    return filteredComments;
  } catch (err) {
    throw new Error("Error getting comments from cache");
  }
};

const getCommentsWithDetails = async (
  commentIds: string[],
  userId: string
): Promise<IComment[]> => {
  try {
    const comments = await getComments(commentIds);
    const userIds = [
      ...new Set(comments.map((comment) => comment.createdBy.id)),
    ];
    const follows = await Follow.find({
      "follower.id": userId,
      "following.id": { $in: userIds },
    });
    const followedUsers = follows.map((follow) => follow.following.id);
    const userInfo = await Promise.all(
      userIds.map(async (id) => {
        const user = await getUserCache(id);
        followedUsers.includes(user.id)
          ? (user.isFollowed = true)
          : (user.isFollowed = false);
        return user;
      })
    );
    const userMap = new Map(userInfo.map((user) => [user.id, user])) as Map<
      string,
      IUser
    >;
    const userLikes = await Like.find({
      likedBy: userId,
      on: { $in: commentIds },
    });
    const userDisikes = await Dislike.find({
      dislikedBy: userId,
      on: { $in: commentIds },
    });
    const likedComments = new Set(userLikes.map((like) => like.on.toString()));
    const dislikedComments = new Set(
      userDisikes.map((dislike) => dislike.on.toString())
    );
    const response: IComment[] = comments.map((comment) => {
      const createdBy = userMap.get(comment.createdBy.id);
      if (!createdBy) {
        throw new Error(`User with id ${comment.createdBy.id} not found`);
      }
      return {
        id: comment.id,
        content: comment.content,
        createdBy: createdBy,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
        associatedTo: comment.associatedTo,
        likeCount: comment.likeCount,
        dislikeCount: comment.dislikeCount,
        likedByUser: likedComments.has(comment.id),
        dislikedByUser: dislikedComments.has(comment.id),
      };
    });
    return response;
  } catch (err) {
    throw new Error("Error fetching Comments");
  }
};

export { getComment, getComments, getCommentsWithDetails };
