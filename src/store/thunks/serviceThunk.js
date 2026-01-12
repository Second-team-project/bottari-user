import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

export const getFaqThunk = createAsyncThunk(
  'service/getFaqThunk',
  async (page, {rejectWithValue}) => {
    try {
      const url = `/api/user/faq`;
      const params = { page };

      const response = await axiosIns.get(url, { params })
      
      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const getNoticeThunk = createAsyncThunk(
  'service/getNoticeThunk',
  async (page, {rejectWithValue}) => {
    try {
      const url = `/api/user/notices`;
      const params = { page };

      const response = await axiosIns.get(url, { params })
      
      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)
