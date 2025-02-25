import getPostCache from "../../../../cache/Post/getPostCache";
import { IPost } from "../../../../types";

export default async function getPostMain(id: string): Promise<IPost | null> {
  try {
    const post = await getPostCache(id);
    if (post) {
      return post;
    }
    return null;
  } catch (err) {
    console.log(`getPost method failed with error:${err}`);
    return null;
  }
}
