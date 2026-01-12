import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const tossPaymentsThunk = createAsyncThunk(
  'tossPayments/tossPaymentsThunk',
  async (data, {rejectWithValue}) => {
    try {

      const url = `/api/user/reserve/confirm/payment`;

      const response = await axiosIns.post(url, data)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);