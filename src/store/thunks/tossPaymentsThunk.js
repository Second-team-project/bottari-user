import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const tossPaymentsThunk = createAsyncThunk(
  'tossPayments/tossPaymentsThunk',
  async ({keyword, page}, {rejectWithValue}) => {
    try {
      const response = await axiosIns.get(
        '/api/user/search/location', 
        {
          params: { 
            keyword: keyword,
            page: page
          }
        }
      )
      
      console.log('response: ', response.data)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);