import { configureStore } from "@reduxjs/toolkit";

// slice import
import authReducer from "./slices/authSlice.js";
import reserveReducer from "./slices/reserveSlice.js";
import serviceReducer from "./slices/serviceSlice.js";

export default configureStore({
  reducer: {
    auth: authReducer,
    reserve: reserveReducer,
    service: serviceReducer,
  }
});