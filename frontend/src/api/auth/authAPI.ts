import { IUser } from "@/types";
import axios from "axios";
import { isFollowedAPI } from "../post/postAPI";

const base_url = process.env.API_URL
  ? `${process.env.API_URL}auth`
  : "http://localhost:3001/auth";

const authAPI = axios.create({ baseURL: base_url, withCredentials: true });

const loginAPI = async (username: string, password: string) => {
  const payload = {
    username: username,
    password: password,
  };
  return await authAPI.post("/login/", payload);
};

const signUpAPI = async (
  username: string,
  email: string,
  password: string,
  confirm_password: string
) => {
  const payload = {
    username: username,
    email: email,
    password: password,
    confirm_password: confirm_password,
  };
  return await authAPI.post("/register/", payload);
};

const logoutAPI = async () => {
  return await authAPI.post("/logout/");
};

const checkUserNameAPI = async (username: string) => {
  return await authAPI.get(`/check-username/?username=${username}`);
};

const checkEmailAPI = async (email: string) => {
  return await authAPI.get(`/check-email/?email=${email}`);
};

const getUserInfoAPI = async (id: string): Promise<IUser | null> => {
  const response = await authAPI.get(`user-info/?userId=${id}`);
  if (!response.data?.user) throw new Error("User not found");
  return response.data.user;
};

export {
  loginAPI,
  signUpAPI,
  logoutAPI,
  checkUserNameAPI,
  checkEmailAPI,
  getUserInfoAPI,
};
