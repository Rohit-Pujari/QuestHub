import { Comment, Dislike, Like, Post } from "../../../../models";
import { removeLike } from "../Like";

const addDislike = async (on: string, by: string) => {
  try {
    const dislikeUpdata =
      (await Post.findById(on)) || (await Comment.findById(on));
    if (!dislikeUpdata) throw new Error("Provide a valid ID");
    const liked = await Like.findOne({ on: on, likedBy: by });
    if (liked) {
      await removeLike(on, by);
    }
    const check = await Dislike.findOne({ on: on, dislikedBy: by });
    if (check) {
      return await removeDislike(on, by);
    }
    const dislike = await Dislike.create({
      on: on,
      dislikedBy: by,
    });
    dislikeUpdata.dislikeCount += 1;
    await dislikeUpdata.save();
    return dislike.save();
  } catch (err) {
    throw new Error("Failed to dislike");
  }
};

const removeDislike = async (on: string, by: string) => {
  try {
    const dislikeUpdata =
      (await Post.findById(on)) || (await Comment.findById(on));
    if (!dislikeUpdata) throw new Error("Provide a valid ID");
    const dislike = await Dislike.findOneAndDelete({
      on: on,
      dislikedBy: by,
    });
    if (!dislike) {
      throw new Error("Dislike not found");
    }
    dislikeUpdata.dislikeCount -= 1;
    await dislikeUpdata.save();
    return "Dislike removed successfully";
  } catch (err) {
    throw new Error("Failed to remove dislike");
  }
};

export { addDislike, removeDislike };
