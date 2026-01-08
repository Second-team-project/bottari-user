import { createSlice } from "@reduxjs/toolkit"
import { getGuideImgThunk } from "../thunks/guideImgThunk";

const initialState = {
  bannerList: [],
  eventList: [],
  serviceList: [],

  usageList: [],
  priceList: [],

  loading: true,
  error: null,
}

const slice = createSlice({
  name: 'guideImg',
  initialState,
  reducers: {
    setLoading(state, action) {
      state.loading = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      // faq
      .addCase(getGuideImgThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(getGuideImgThunk.fulfilled, (state, action) => {
        state.loading = false;

        state.bannerList = action.payload.filter(item => item.type === 'BANNER')
        state.eventList = action.payload.filter(item => item.type === 'EVENT')
        state.serviceList = action.payload.filter(item => item.type === 'SERVICE')
        state.usageList = action.payload.filter(item => item.type === 'USAGE')
        state.priceList = action.payload.filter(item => item.type === 'PRICE')

        // console.log('guide redux: ',state.bannerList, state.eventList, state.serviceList, state.usageList, state.priceList)
      })
      .addCase(getGuideImgThunk.rejected, (state, action) => {
        state.loading = false;

        console.error('faq 불러오기 실패 : ', action.error);
      })
  },
})

export const {
  setLoading,
} = slice.actions;

export default slice.reducer;