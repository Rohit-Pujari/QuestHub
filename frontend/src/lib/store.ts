"use client";

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/Auth/authSlice";

const createStore = (preloadedAuthState: any) =>
  configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: preloadedAuthState,
    },
  });

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];

export { createStore };
