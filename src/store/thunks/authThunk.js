import { createAsyncThunk  } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance.js";

/**
 * 로그아웃
 */
export const logoutThunk = createAsyncThunk(
  'auth/logoutThunk',
  async (_, {rejectWithValue}) => {
    try {
      const url = '/api/user/auth/logout';

      const response = await axiosIns.post(url);

      return response.data;
    } catch(error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * 토큰 재발급
 */
export const reissueThunk = createAsyncThunk(
  'auth/reissueThunk',
  async(_, { rejectWithValue }) => {
    try {
      const url = '/api/user/auth/reissue';

      const response = await axiosIns.post(url);

      return response.data;
      
    } catch(error) {
      return rejectWithValue(error);
    }
  }
)