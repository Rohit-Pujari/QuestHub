import { Follow } from "../../../../models";

const getFollowersID = async (
  userId: string,
  limit?: number,
  skip?: number
): Promise<string[]> => {
  // Get followers of a user
  try {
    const followers = (
      await Follow.find({ following: { id: userId } })
        .limit(limit)
        .skip(skip)
    ).map((follow) => follow.follower.id);
    return followers;
  } catch (err) {
    throw new Error("Error getting followers from cache");
  }
};

const getFollowingID = async (
  userId: string,
  limit?: number,
  skip?: number
): Promise<string[]> => {
  // Get following of a user
  try {
    const following = (
      await Follow.find({ follower: { id: userId } })
        .limit(limit)
        .skip(skip)
    ).map((follow) => follow.following.id);
    return following;
  } catch (err) {
    throw new Error("Error getting following from cache");
  }
};

export { getFollowersID, getFollowingID };
