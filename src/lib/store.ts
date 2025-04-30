import { type Action, configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  Persistor,
  persistReducer,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "./storage";
import { combineReducers } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import nookies from "nookies";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};

const appReducer = combineReducers({
  user: userReducer,
});

const rootReducer = (state: any, action: Action) => {
  if (action.type === "user/logout") return appReducer(undefined, action);
  return appReducer(state, action);
};

export const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: process.env.NODE_ENV !== "production",
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [
            FLUSH,
            REHYDRATE,
            PAUSE,
            PERSIST,
            PURGE,
            REGISTER,
            "user/logout",
          ],
        },
      }),
  });
  return store;
};

export const logoutUser = (persistor: Persistor) => (dispatch: AppDispatch) => {
  nookies.destroy(null, "accessToken", { path: "/" });
  persistor.purge();
  dispatch({ type: "user/logout" });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
