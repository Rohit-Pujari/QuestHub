import axios from "axios";
import { IUser } from "../types";

const baseURL = process.env.API_URL
  ? `${process.env.API_URL}/auth/`
  : "http://localhost:3001/auth/";

const authAPI = axios.create({ baseURL });

// Function to fetch user information
export const getUserInfo = async (Id: string): Promise<IUser | null> => {
  try {
    if (Id) {
      const response = await authAPI.get(`user-info/?userId=${Id}`);
      if (response.data?.user) {
        response.data.user.isFollowed = false;
        return response.data.user;
      }
      return null; // User not found in response
    }
    return null;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      console.error(`API Error fetching UserInfo for ID: ${Id}`, {
        status: err.response?.status,
        data: err.response?.data,
      });
    } else {
      console.error(`Unexpected Error fetching UserInfo for ID: ${Id}`, err);
    }
    return null; // Return null on error
  }
};
