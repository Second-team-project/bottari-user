import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const getStores = createAsyncThunk(
  'store/getStores',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/admin/store`;

      const response = await axiosIns.get(url)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);