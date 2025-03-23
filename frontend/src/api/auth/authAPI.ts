import axios from "axios";

const base_url = process.env.NEXT_PUBLIC_API_URL! + "auth/";

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

const getUserInfoAPI = async (id: string) => {
  const response = await authAPI.get(`user-info/?userId=${id}`);
  if (!response.data?.user) throw new Error("User not found");
  return response.data.user;
};

const queryUsersAPI = async (query: string) => {
  const response = await authAPI.get(`/user?username=${query}`);
  if (response.status == 200) return response.data.users;
  return [];
};

const updateUserInfoAPI = async (
  id: string,
  username: string,
  email: string,
  bio: string,
  profile_picture: string
) => {
  try {
    const payload = {
      userId: id,
      username: username,
      email: email,
      bio: bio,
      profile_picture: profile_picture,
    };
    const response = await authAPI.post("update-user-info/", payload);
    console.log(response);
    if (response.status == 200) return response.data.user;
    throw new Error("Error updating user info");
  } catch (err) {
    console.log(err);
    throw new Error("Error updating user info");
  }
};

export {
  loginAPI,
  signUpAPI,
  logoutAPI,
  checkUserNameAPI,
  checkEmailAPI,
  getUserInfoAPI,
  queryUsersAPI,
  updateUserInfoAPI,
};
