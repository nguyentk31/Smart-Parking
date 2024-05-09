import { configureStore } from "@reduxjs/toolkit";

import loader from "../slices/loader";
import auth from "../slices/auth";

export const store = configureStore({
  reducer: {
    loader,
    auth,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
