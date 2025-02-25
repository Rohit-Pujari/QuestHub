import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    id: string | null;
    username: string | null;
    profilePicture: string | null;
  } | null;
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

const authReducer = authSlice.reducer;

export const { login, logout } = authSlice.actions;
export default authReducer;
