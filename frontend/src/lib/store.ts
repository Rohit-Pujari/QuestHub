import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Uses localStorage
import authReducer from "./features/Auth/authSlice";

// Persist Configuration
const persistConfig = {
  key: "auth",
  storage,
  whitelist: ["user"], // Only persist 'user', NOT 'token' for security reasons
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Redux Persist stores non-serializable data
    }),
});

// Persistor to be used in _app.tsx
export const persistor = persistStore(store);

// RootState Type
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
