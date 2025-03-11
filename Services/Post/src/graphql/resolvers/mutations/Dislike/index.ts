import { Comment, Dislike, Post } from "../../../../models";

const addDislike = async (on: string, by: string) => {
  try {
    const check = await Dislike.findOne({ on: on, dislikedBy: by });
    if (check) throw new Error("Error performing dislike operation");
    const dislike = await Dislike.create({
      on: on,
      dislikedBy: by,
    });
    return dislike.save();
  } catch (err) {
    throw new Error("Failed to dislike");
  }
};

const removeDislike = async (on: string, by: string) => {
  try {
    const dislike = await Dislike.findOneAndDelete({
      on: on,
      dislikedBy: by,
    });
    if (!dislike) {
      throw new Error("Dislike not found");
    }
    return "Dislike removed successfully";
  } catch (err) {
    throw new Error("Failed to remove dislike");
  }
};

export { addDislike, removeDislike };
