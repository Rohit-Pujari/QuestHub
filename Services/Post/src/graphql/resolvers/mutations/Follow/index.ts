import { Follow } from "../../../../models";

const addFollow = async (follower: string, following: string) => {
  try {
    if (follower === following)
      throw new Error("Error performing follow operation");
    const check = await Follow.findOne({
      follower: { id: follower },
      following: { id: following },
    });
    if (check) throw new Error("Error performing follow operation");
    const follow = await Follow.create({
      follower: { id: follower },
      following: { id: following },
    });
    return follow.save();
  } catch (err) {
    throw new Error("Failed to follow user");
  }
};

const removeFollow = async (follower: string, following: string) => {
  try {
    const follow = await Follow.findOneAndDelete({
      follower: { id: follower },
      following: { id: following },
    });
    if (!follow) {
      throw new Error("Follow not found");
    }
    return "Unfollowed successfully";
  } catch (err) {
    throw new Error("Failed to unfollow user");
  }
};

export { addFollow, removeFollow };
