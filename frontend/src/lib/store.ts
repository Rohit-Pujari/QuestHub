import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/Auth/authSlice";

const createStore = (preloadState: any) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: preloadState,
    },
  });
};

export type RootState = ReturnType<ReturnType<typeof createStore>["getState"]>;
export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
export default createStore;
