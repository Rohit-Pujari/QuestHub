import axios from "axios";

const baseURL = import .meta.env.VITE_AUTH_API_URL
import { ICheckEmailAPI, ICheckUsernameAPI, ILoginAPI, IRegisterAPI } from './IAPI';

const authAPI = axios.create({
    baseURL: baseURL? baseURL: "http://localhost:8000/auth/",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
})


export const loginAPI = async (data:ILoginAPI) => {
    const response = await authAPI.post("login/", data);
    return response;
}

export const registerAPI = async (data:IRegisterAPI) => {
    const response = await authAPI.post("register/", data);
    return response;
}

export const logoutAPI = async () => {
    const response = await authAPI.post("logout/",{
        withCredentials: true
    });
    return response;
}

export const checkUsernameAPI = async (data:ICheckUsernameAPI) => {
    const response = await authAPI.get(`check-username/?username=${data.username}`);
    return response;
}

export const checkEmailAPI = async (data:ICheckEmailAPI) => {
    const response = await authAPI.get(`check-email/?email=${data.email}`);
    return response;
}

export default authAPI;