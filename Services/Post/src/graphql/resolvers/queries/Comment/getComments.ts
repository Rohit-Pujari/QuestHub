import getUserinfoCache from "../../../../cache/User/getUserInfoCache";
import Dislike from "../../../../models/Dislike";
import Like from "../../../../models/Likes";
import { IComment } from "../../../../types";
import getComment from "./getComment";

export default async function getComments(ids: string[], userId: string) {
  try {
    const comments = (
      await Promise.all(ids.map(async (id) => await getComment(id)))
    ).filter((comment): comment is IComment => comment !== undefined);
    if (!comments) {
      return null;
    }
    const userIds = [...new Set(comments.map((comment) => comment.createdBy))];
    const userInfo = (
      await Promise.all(userIds.map(async (id) => await getUserinfoCache(id)))
    ).filter((user) => user !== null);
    const userInfoMap = new Map(userInfo.map((user) => [user.id, user]));
    const likeCount = await Like.aggregate([
      { $match: { on: { $in: ids } } },
      { $group: { _id: "$on", count: { $sum: 1 } } },
    ]);
    const likeMap = Object.fromEntries(
      likeCount.map((like) => [like.on, like.count])
    );
    const dislikeCount = await Dislike.aggregate([
      { $match: { on: { $in: ids } } },
      { $group: { _id: "$on", count: { $sum: 1 } } },
    ]);
    const dislikeMap = Object.fromEntries(
      dislikeCount.map((dislike) => [dislike.on, dislike.count])
    );
    const userLikes = await Like.find({
      likedBy: userId,
      on: { $in: ids },
    });
    const userDislikes = await Dislike.find({
      dislikedBy: userId,
      on: { $in: ids },
    });
    const likedComments = new Set(userLikes.map((like) => like.on.toString()));
    const dislikedComments = new Set(
      userDislikes.map((dislike) => dislike.on.toString())
    );
    return comments.map((comment) => ({
      id: comment.id,
      content: comment.content,
      parentId: comment.parentId,
      associatedTo: comment.associatedTo,
      createdBy: userInfoMap.get(comment.createdBy),
      createdAt: comment.createdAt,
      likeCount: likeMap[comment.id] || 0,
      dislikeCount: dislikeMap[comment.id] || 0,
      likedByUser: likedComments.has(comment.id),
      dislikedByUser: dislikedComments.has(comment.id),
    }));
  } catch (err) {
    console.log(`getComments method failed with error:${err}`);
    return null;
  }
}
