import { Follow } from "../../../../models";

const getFollowers = async (userId: string) => {
  // Get followers of a user
  try {
    const followers = await Follow.find({ following: userId });
    return followers;
  } catch (err) {
    throw new Error("Error getting followers from cache");
  }
};

const getFollowing = async (userId: string) => {
  // Get following of a user
  try {
    const following = await Follow.find({ follower: userId });
    return following;
  } catch (err) {
    throw new Error("Error getting following from cache");
  }
};
