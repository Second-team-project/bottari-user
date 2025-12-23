import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const tossPaymentsThunk = createAsyncThunk(
  'tossPayments/tossPaymentsThunk',
  async (data, {rejectWithValue}) => {
    try {

      const url = `/api/user/search/location`;

      const response = await axiosIns.post(url, data)

      
      console.log('response: ', response.data)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);