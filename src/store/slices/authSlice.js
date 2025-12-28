import { createSlice } from "@reduxjs/toolkit"
import { logoutThunk, reissueThunk } from "../thunks/authThunk.js";

const initialState = {
  accessToken: null,
  user: null,
  isLoggedIn: false,
  loading: true,
  error: null,
}

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading(state) {
      state.loading = true;
    },
    clearAuth(state) {
      state.accessToken = null,
      state.user = null;
      state.isLoggedIn = false;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(reissueThunk.pending, (state, action) => {
        state.loading = true;
      })
      .addCase(reissueThunk.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload.data;
        state.accessToken = accessToken;
        console.log('thunk-accessToken: ', accessToken);

        state.user = user;  //  user model 객체 (리프레시 제외)
        console.log('thunk-user: ', user);

        state.isLoggedIn = true;
        console.log('thunk-isLoggedIn: ', state.isLoggedIn);

        state.loading = false;
      })
      .addCase(reissueThunk.rejected, (state, action) => {
        state.loading = false;

        state.accessToken = null;
        state.user = null;
        state.isLoggedIn = false;

        console.error('로그인 실패 : ', action.error);
      })
      
      .addCase(logoutThunk.fulfilled, (state) => {
        state.accessToken = null;
        state.user = null;
        state.isLoggedIn = false;
      })
      .addCase(logoutThunk.rejected, state => {
        state.accessToken = null;
        state.user = null;
        state.isLoggedIn = false;
      })
      // .addCase(loginThunk.fulfilled, (state, action) => {
      //   const { accessToken, user } = action.payload.data;
      //   state.accessToken = accessToken;
      //   state.user = user;
      //   state.isLoggedIn = true;
      // })
  },
})

export const {
  setLoading,
  clearAuth,
} = slice.actions;

export default slice.reducer;