import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosIns from "../../api/axiosInstance.js";

export const getReviewList = createAsyncThunk(
  'reveiw/getReviewList',
  async (data, {rejectWithValue}) => {
  const url = `/api/user/review`

  try {
    const response = await axiosIns.get(url, {
      params: {
        page: data?.page || 1,
      }
    });
    
    return response.data;

  } catch (error) {
    return rejectWithValue(error);
  }}
)
