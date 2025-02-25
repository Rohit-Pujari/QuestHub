import { cacheClient } from "../../config/cache";
import { getUserInfo } from "../../service-comms/auth";

interface UserInfo {
  id: string;
  username: string;
  email: string;
  profile_picture: string;
}

export default async function getUserinfoCache(
  id: string
): Promise<UserInfo | null> {
  try {
    const cachedUserinfo = await cacheClient.get(`user:${id}`);
    if (cachedUserinfo) {
      return JSON.parse(cachedUserinfo) as UserInfo;
    }
    const userInfo = await getUserInfo(id);
    if (userInfo) {
      await cacheClient.set(`user:${userInfo.id}`, JSON.stringify(userInfo), {
        EX: 3600,
      });
      return userInfo;
    }
    return null;
  } catch (err) {
    console.log(`failed to fetch Userinfo for id:${id}`, err);
    return null;
  }
}
