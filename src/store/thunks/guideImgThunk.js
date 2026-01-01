import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const getGuideImgThunk = createAsyncThunk(
  'guideImg/getGuideImgThunk',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/common/guide-img`;

      const response = await axiosIns.get(url)

      console.log('thunk-guideImg: ', response.data.data)

      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);