import Dislike from "../../../../models/Dislike";

export default async function getDislikeExists(
  on: string,
  by: string
): Promise<boolean> {
  try {
    const dislike = await Dislike.find({ on: on, dislikedBy: by });
    if (dislike) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(
      `getDislikeExists failed for on:${on} by:${by} with error:${err}`
    );
    return false;
  }
}
