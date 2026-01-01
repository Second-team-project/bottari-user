import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const getPricing = createAsyncThunk(
  'pricing/getPricingThunk',
  async (data, {rejectWithValue}) => {
    try {

      const url = `/api/common/pricing`;

      const response = await axiosIns.get(url, data)

      
      // console.log('pricing: ', response.data)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);