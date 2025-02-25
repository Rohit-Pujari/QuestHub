import Dislike from "../../../../models/Dislike";

export default async function getDislikeCount(on: string): Promise<number> {
  try {
    const dislikeCount = await Dislike.find({ on: on }).countDocuments();
    if (dislikeCount) {
      return dislikeCount;
    }
    return 0;
  } catch (err) {
    console.log(`getDislikeCount failed for on:${on} with error:${err}`);
    return 0;
  }
}
