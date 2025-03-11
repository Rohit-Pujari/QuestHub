import { cacheClient } from "../../config/cache";
import { getUserInfo } from "../../service-comms/auth";
import { IUser } from "../../types";

const addUserCache = async (user: IUser): Promise<IUser> => {
  try {
    const cacheUser: IUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
    };
    const success = await cacheClient.set(user.id, JSON.stringify(cacheUser));
    if (!success) {
      throw new Error("Error adding user to cache");
    }
    return cacheUser;
  } catch (err) {
    throw new Error("Error adding user to cache");
  }
};

const getUserCache = async (userId: string): Promise<IUser> => {
  try {
    const user = await cacheClient.get(userId);
    if (!user) {
      const user = await getUserInfo(userId);
      if (!user) {
        throw new Error("Error getting user from service");
      }
      const response = await addUserCache(user);
      return response;
    }
    const parsedUser: IUser = JSON.parse(user);
    const response: IUser = {
      id: parsedUser.id,
      username: parsedUser.username,
      email: parsedUser.email,
      profile_picture: parsedUser.profile_picture,
    };
    return response;
  } catch (err) {
    throw new Error("Error getting user from cache");
  }
};

export { addUserCache, getUserCache };
