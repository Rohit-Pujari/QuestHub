import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    id: string | null;
    username: string | null;
    profilePicture: string | null;
  } | null;
  token: string | null; // Not persisted for security reasons
}

const initialState: AuthState = {
  user: null,
  token: null, // Tokens should not be persisted
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

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
