import { Like } from "../../../../models";

const addLike = async (on: string, by: string) => {
  try {
    const check = await Like.findOne({ on: on, likedBy: by });
    if (check) throw new Error("Unable to perform like operation");
    const like = await Like.create({
      on: on,
      likedBy: by,
    });
    return like.save();
  } catch (err) {
    throw new Error("Failed to like");
  }
};

const removeLike = async (on: string, by: string) => {
  try {
    const like = await Like.findOneAndDelete({
      on: on,
      likedBy: by,
    });
    if (!like) {
      throw new Error("Like not found");
    }
    return "Like removed successfully";
  } catch (err) {
    throw new Error("Failed to remove like");
  }
};

export { addLike, removeLike };
