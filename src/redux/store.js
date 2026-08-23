import { configureStore } from "@reduxjs/toolkit";
import { authReducer } from "./auth/slice";
import { categoriesReducer } from "./categories/slice";
import { ingredientsReducer } from "./ingredients/slice";
import { areasReducer } from "./areas/slice";
import { recipesReducer } from "./recipes/slice";

import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import rawStorage from "redux-persist/lib/storage";

// Перевірка експорту для Vite
const storage = rawStorage.default || rawStorage;

const authPersistConfig = {
  key: "auth",
  storage,
  whitelist: ["token"],
};

export const store = configureStore({
 reducer: {
  auth: persistReducer(authPersistConfig, authReducer),
  categories: categoriesReducer,
  ingredients: ingredientsReducer,
  areas: areasReducer,
  recipes: recipesReducer,
},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: import.meta.env.MODE === "development",
});

export const persistor = persistStore(store);
