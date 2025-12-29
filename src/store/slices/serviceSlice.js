import { createSlice } from "@reduxjs/toolkit"
import { getFaqThunk, getNoticeThunk } from "../thunks/serviceThunk.js";

const initialState = {
  faqList: [],
  noticeList: [],
  loading: true,
  error: null,
}

const slice = createSlice({
  name: 'service',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
    clearFaqList(state) {
      state.faqList = [];
    },
    clearNoticeList(state) {
      state.noticeList = [];
    },
  },
  extraReducers: builder => {
    builder
      // faq
      .addCase(getFaqThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFaqThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.faqList = action.payload.data.posts;
        console.log('slice-faqList: ', state.faqList);
      })
      .addCase(getFaqThunk.rejected, (state, action) => {
        state.loading = false;

        console.error('로그인 실패 : ', action.error);
      })
      
      // notice
      .addCase(getNoticeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNoticeThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.noticeList = action.payload.data.posts;
        console.log('slice-noticeList: ', state.noticeList);
      })
      .addCase(getNoticeThunk.rejected, (state, action) => {
        state.loading = false;

        console.error('로그인 실패 : ', action.error);
      })
  },
})

export const {
  clearFaqList,
  clearNoticeList,
} = slice.actions;

export default slice.reducer;