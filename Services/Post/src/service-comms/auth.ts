import axios from "axios";

const baseURL = process.env.API_URL?`${process.env.API_URL}/auth/` : "http://localhost:3001/auth/";
const authAPI = axios.create({baseURL})

const getUserInfo = async(Id:String)=>{
    try{
        const response = await authAPI.get(`user-info/?userId=${Id}`)
        return response
    }catch(error){
        throw error;
    }
}

export {getUserInfo};