import { configureStore } from "@reduxjs/toolkit";
import accountReducer from "./account/accountSlice";

export const store = configureStore({
  reducer: {
    accountSlice: accountReducer,
  },
});