import axios from "axios";

const baseURL = process.env.API_URL?`${process.env.API_URL}/auth/` : "http://localhost:3001/auth/";

const authAPI = axios.create({baseURL,
    headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    }
})

const loginAPI = async (username: string, password: string) => {
    try {
        const payload = {
            "username": username,
            "password": password
        }
        const response = await authAPI.post("login/", payload);
        return response;
    } catch (error) {
        throw error;
    }
}

const registerAPI = async (username: string,email: string, password: string,confirmPassword: string) => {
    try {
        const payload = {
            "username": username,
            "email": email,
            "password": password,
            "confirm_password": confirmPassword
        }
        const response = await authAPI.post("register/", payload);
        return response;
    } catch (error) {
        throw error;
    }
}

const checkUsernameAPI = async (username: string) => {
    try {  
        const response = await authAPI.get(`check-username/?username=${username}`);
        return response;
    } catch (error) {
        throw error;
    }
}

const checkEmailAPI = async (email: string) => {
    try {  
        const response = await authAPI.get(`check-email/?email=${email}`);
        return response;
    } catch (error) {
        throw error;
    }
}

export { loginAPI, registerAPI, checkUsernameAPI, checkEmailAPI };