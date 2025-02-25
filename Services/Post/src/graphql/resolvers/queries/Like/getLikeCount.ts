import Like from "../../../../models/Likes";

export default async function getLikeCount(on: string): Promise<number> {
  try {
    const likeCount = await Like.find({ on: on }).countDocuments();
    if (likeCount) {
      return likeCount;
    }
    return 0;
  } catch (err) {
    console.log(`getLikeCount failed for on:${on} with error:${err}`);
    return 0;
  }
}
