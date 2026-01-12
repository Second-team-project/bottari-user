import { createSlice } from "@reduxjs/toolkit"
import { getFaqThunk, getNoticeThunk } from "../thunks/serviceThunk.js";

const initialState = {
  faqList: [],
  faqListCount: 0,

  noticeList: [],
  noticeListCount: 0,

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

        const page = action.meta.arg || 1;
        if(page === 1) {
          state.faqList = action.payload.faqs
        } else {
          state.faqList = [...state.faqList, ...action.payload.faqs];
        }
        state.faqListCount = action.payload.count;
      })
      .addCase(getFaqThunk.rejected, (state, action) => {
        state.loading = false;

        console.error('faq 불러오기 실패 : ', action.error);
      })
      
      // notice
      .addCase(getNoticeThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getNoticeThunk.fulfilled, (state, action) => {
        state.loading = false;

        const page = action.meta.arg || 1;
        if(page === 1) {
          state.noticeList = action.payload.notices;
        } else {
          state.noticeList = [...state.noticeList, ...action.payload.notices]; 
        }
        state.noticeListCount = action.payload.count;
      })
      .addCase(getNoticeThunk.rejected, (state, action) => {
        state.loading = false;

        console.error('notice 불러오기 실패 : ', action.error);
      })
  },
})

export const {
  clearFaqList,
  clearNoticeList,
} = slice.actions;

export default slice.reducer;