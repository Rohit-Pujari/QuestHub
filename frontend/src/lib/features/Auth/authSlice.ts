import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    id: string | null;
    username: string | null;
    profile_picture: string | null;
  } | null;
  token: string | null;
}

// Load initial state from localStorage
const loadAuthState = (): AuthState => {
  if (typeof window !== "undefined") {
    const storedAuth = localStorage.getItem("auth");
    return storedAuth ? JSON.parse(storedAuth) : { user: null, token: null };
  }
  return { user: null, token: null };
};

const initialState: AuthState = loadAuthState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      localStorage.setItem("auth", JSON.stringify(state)); // Save to localStorage
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("auth"); // Remove from localStorage
    },
    update: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem("auth", JSON.stringify(state)); // Update localStorage
    },
  },
});

export const { login, logout, update } = authSlice.actions;
export default authSlice.reducer;
