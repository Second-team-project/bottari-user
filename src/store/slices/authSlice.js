import { createSlice } from "@reduxjs/toolkit"
import { reissueThunk } from "../thunks/authThunk.js";

const initialState = {
  accessToken: null,
  user: null,
  isLoggedIn: false,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth(state) {
      state.accessToken = null,
      state.user = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        state.user = user;  //  user model 객체 (리프레시 제외)
        state.isLoggedIn = true;
      });
  },
})

export const {
  clearAuth,
} = slice.actions;

export default slice.reducer;