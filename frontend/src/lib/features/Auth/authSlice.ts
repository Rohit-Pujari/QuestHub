"use client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

interface AuthState {
    user:{
        username:string|null,
        id:string|null
    },
    token:string|null,
    isAuthenticated:boolean,
}

interface LoginPayload{
    user:{username:string,id:string},
    token:string,
}

const initialState: AuthState = {
    user: {username:null,id:null},
    token: null,
    isAuthenticated: false,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        login(state, action: PayloadAction<LoginPayload>){
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
        },
        logout(state){
            state.user = {username:null,id:null}
            state.token = null
            state.isAuthenticated = false
        }
    }
})

const authReducer = authSlice.reducer
export default authReducer
export const { login, logout } = authSlice.actions