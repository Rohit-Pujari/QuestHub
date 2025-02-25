import getUserinfoCache from "../../../../cache/User/getUserInfoCache";
import Dislike from "../../../../models/Dislike";
import Like from "../../../../models/Likes";
import { IPost } from "../../../../types";
import getPostMain from "./getPost";

export default async function getPostsMain(ids: string[], userId: string) {
  try {
    const posts = await Promise.all(
      ids.map(async (id) => await getPostMain(id))
    );
    if (!posts || posts.length === 0) {
      return false;
    }
    const validPosts = posts.filter((post) => post !== null) as IPost[];
    if (validPosts.length === 0) {
      return [];
    }
    const userIds = [...new Set(validPosts.map((post) => post.createdBy))];
    const userInfo = (
      await Promise.all(userIds.map(async (id) => await getUserinfoCache(id)))
    ).filter((user) => user !== null);
    const userInfoMap = new Map(userInfo.map((user) => [user.id, user]));
    const likeCount = await Like.aggregate([
      { $match: { on: { $in: ids } } },
      { $group: { _id: "$on", count: { $sum: 1 } } },
    ]);
    const dislikeCount = await Dislike.aggregate([
      { $match: { on: { $in: ids } } },
      { $group: { _id: "$on", count: { $sum: 1 } } },
    ]);
    const likeMap = Object.fromEntries(
      likeCount.map((like) => [like.on, like.count])
    );
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
    const likedPosts = new Set(userLikes.map((like) => like.on.toString()));
    const dislikedPosts = new Set(
      userDislikes.map((dislike) => dislike.on.toString())
    );
    const response = validPosts.map(async (post) => ({
      id: post.id,
      title: post.title,
      content: post.content,
      mediaUrl: post.mediaUrl,
      createdBy: userInfoMap.get(post.createdBy),
      createdAt: post.createdAt,
      likeCount: likeMap[post.id] || 0,
      dislikeCount: dislikeMap[post.id] || 0,
      likedByUser: likedPosts.has(post.id),
      dislikedByUser: dislikedPosts.has(post.id),
    }));
    return response;
  } catch (err) {
    return false;
  }
}
