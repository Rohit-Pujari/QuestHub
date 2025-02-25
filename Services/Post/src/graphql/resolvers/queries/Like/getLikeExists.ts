import Like from "../../../../models/Likes";

export default async function getLikeExists(
  on: string,
  by: string
): Promise<boolean> {
  try {
    const like = await Like.find({ on: on, likedBy: by });
    if (like) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(`getLike failed for on:${on} by:${by} with error:${err}`);
    return false;
  }
}
