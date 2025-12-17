import { configureStore } from "@reduxjs/toolkit";

// slice import
import menuReducer from "./slices/menuSlice.js";
import authReducer from "./slices/authSlice.js";

export default configureStore({
  reducer: {
    menu: menuReducer,
    auth: authReducer,
  }
});