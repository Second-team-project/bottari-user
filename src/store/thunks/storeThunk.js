import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const getStores = createAsyncThunk(
  'store/getStores',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/common/store`;

      const response = await axiosIns.get(url)

      
      console.log('thunk-store: ', response.data)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);