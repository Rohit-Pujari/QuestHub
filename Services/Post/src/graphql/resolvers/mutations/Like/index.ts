import { Comment, Dislike, Like, Post } from "../../../../models";
import { removeDislike } from "../Dislike";

const addLike = async (on: string, by: string) => {
  try {
    const likeUpdate =
      (await Post.findById(on)) || (await Comment.findById(on));
    if (!likeUpdate) throw new Error("Provide a valid ID");
    const check = await Like.findOne({ on: on, likedBy: by });
    const disliked = await Dislike.findOne({ on: on, dislikedBy: by });
    if (disliked) {
      await removeDislike(on, by);
    }
    if (check) {
      return await removeLike(on, by);
    }
    const like = await Like.create({
      on: on,
      likedBy: by,
    });
    likeUpdate.likeCount += 1;
    await likeUpdate.save();
    return like.save();
  } catch (err) {
    throw new Error("Failed to like");
  }
};

const removeLike = async (on: string, by: string) => {
  try {
    const likeUpdate =
      (await Post.findById(on)) || (await Comment.findById(on));
    if (!likeUpdate) throw new Error("Provide a valid ID");
    const like = await Like.findOneAndDelete({
      on: on,
      likedBy: by,
    });
    if (!like) {
      throw new Error("Like not found");
    }
    likeUpdate.likeCount -= 1;
    await likeUpdate.save();
    return "Like removed successfully";
  } catch (err) {
    throw new Error("Failed to remove like");
  }
};

export { addLike, removeLike };
