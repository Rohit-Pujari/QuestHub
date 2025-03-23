import { Message } from "@/types";
import axios from "axios";

const baseurl = process.env.NEXT_PUBLIC_API_URL! + "ws";

const messageAPI = axios.create({ baseURL: baseurl, withCredentials: true });

const getMessagesAPI = async (
  userId: string,
  recieverId: string,
  limit: number,
  skip: number
): Promise<Message[]> => {
  try {
    const response = await messageAPI.get(
      `/messages/${userId}/${recieverId}/${limit}/${skip}`
    );
    return response.data;
  } catch (err) {
    throw new Error("Error getting messages");
  }
};

const getMessagedUsersListAPI = async (userId: string): Promise<string[]> => {
  try {
    const response = await messageAPI.get(`/conversations/${userId}`);
    return response.data;
  } catch (err) {
    throw new Error("Error getting messaged users list");
  }
};

export { getMessagesAPI, getMessagedUsersListAPI };

export default messageAPI;
