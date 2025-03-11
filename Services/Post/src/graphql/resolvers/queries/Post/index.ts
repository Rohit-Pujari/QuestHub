import { getPostCache } from "../../../../cache/Post";
import { getUserCache } from "../../../../cache/User";
import { Dislike, Follow, Like } from "../../../../models";
import { IPost, IUser } from "./../../../../types/index";

const getPost = async (id: string): Promise<IPost> => {
  // Get post from cache
  try {
    const post = await getPostCache(id);
    return post;
  } catch (err) {
    throw new Error("Error getting post from cache");
  }
};

const getPosts = async (ids: string[]): Promise<IPost[]> => {
  try {
    const posts = await Promise.all(
      ids.map(async (id) => {
        const post = await getPost(id);
        return post;
      })
    );
    const filteredPosts = posts.filter((post) => post !== null) as IPost[];
    return filteredPosts;
  } catch (err) {
    throw new Error("Error getting posts from cache");
  }
};

const getPostsWithDetails = async (
  postIds: string[],
  userId: string
): Promise<IPost[]> => {
  try {
    const posts = await getPosts(postIds);
    const userIds = [...new Set(posts.map((post) => post.createdBy.id))];
    const follows = await Follow.find({
      follower: userId,
      following: { $in: userIds },
    });
    const followedUsers = follows.map((follow) => follow.following.id);
    const userInfo = await Promise.all(
      userIds.map(async (id) => {
        const user = await getUserCache(id);
        user.isFollowed = followedUsers.includes(user.id);
        return user;
      })
    );
    const userMap = new Map(userInfo.map((user) => [user.id, user])) as Map<
      string,
      IUser
    >;
    const likeCount = await Like.aggregate([
      { $match: { on: { $in: postIds } } },
      { $group: { _id: "$on", count: { $sum: 1 } } },
    ]);
    const dislikeCount = await Dislike.aggregate([
      { $match: { on: { $in: postIds } } },
      { $group: { _id: "$on", count: { $sum: 1 } } },
    ]);
    const likeMap = new Map(
      likeCount.map((like) => [like._id, like.count])
    ) as Map<string, number>;
    const dislikeMap = new Map(
      dislikeCount.map((dislike) => [dislike._id, dislike.count])
    ) as Map<string, number>;
    const userLikes = await Like.find({
      likedBy: userId,
      on: { $in: postIds },
    });
    const userDislikes = await Dislike.find({
      dislikedBy: userId,
      on: { $in: postIds },
    });
    const likedPosts = new Set(userLikes.map((like) => like.on.toString()));
    const dislikedPosts = new Set(
      userDislikes.map((dislike) => dislike.on.toString())
    );
    const response: IPost[] = posts.map((post) => {
      const createdBy = userMap.get(post.createdBy.id);
      if (!createdBy) {
        throw new Error(`User with id ${post.createdBy.id} not found`);
      }
      return {
        id: post.id,
        title: post.title,
        content: post.content,
        mediaUrl: post.mediaUrl,
        createdBy: createdBy,
        createdAt: post.createdAt,
        likeCount: likeMap.get(post.id) || 0,
        dislikeCount: dislikeMap.get(post.id) || 0,
        likedByUser: likedPosts.has(post.id),
        dislikedByUser: dislikedPosts.has(post.id),
      };
    });
    return response;
  } catch (err) {
    throw new Error("Error getting posts");
  }
};

export { getPost, getPosts, getPostsWithDetails };
