import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./slices/authSlice";
import postsReducer from "./slices/postSlice";
import toastReducer from "./slices/toastSlice";
import { FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist"


const persistConfig = {
  key: "root",
  storage,
  blacklist: ["toast"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  posts: postsReducer,
  toast: toastReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),

});

export const persistor = persistStore(store);

// ✅ Tipos auxiliares
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
