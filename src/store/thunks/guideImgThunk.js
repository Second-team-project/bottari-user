import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const getGuideImgThunk = createAsyncThunk(
  'guideImg/getGuideImgThunk',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/user/guide-img`;

      const response = await axiosIns.get(url)

      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);