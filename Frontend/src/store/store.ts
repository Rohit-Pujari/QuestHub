import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice"


const store = configureStore({
    reducer:{
        auth:authReducer,
    },
    preloadedState:{
        auth:{
            user:{username:localStorage.getItem('Auth') ? JSON.parse(localStorage.getItem('Auth')!).user.username : null},
            token:{access_token:localStorage.getItem('Auth') ? JSON.parse(localStorage.getItem('Auth')!).token.access_token : null},
            isAuthenticated: localStorage.getItem('Auth') ? JSON.parse(localStorage.getItem('Auth')!).isAuthenticated : false
        }
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;