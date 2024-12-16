import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState{
    user:{username:string | null};
    token:{
        access_token:string | null,
    };
    isAuthenticated:boolean;
}

interface LoginPayload{
    user:{username:string | null};
    token:{access_token:string | null};
}

const authState = localStorage.getItem('Auth')

const initialState:AuthState = authState ? JSON.parse(authState) : {
    user:{username:null},
    token:{access_token:null},
    isAuthenticated:false
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login(state,action: PayloadAction<LoginPayload>){
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('Auth',JSON.stringify(state));
        },
        logout(state){
            localStorage.removeItem('Auth');
            state.user = {username:null};
            state.token = {access_token:null};
            state.isAuthenticated = false;
        }
    }
})

export const {login,logout} = authSlice.actions;
export default authSlice.reducer;