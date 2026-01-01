import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const searchLocationThunk = createAsyncThunk(
  'search/searchLocationThunk',
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
      
      // console.log('thunk-search1: ', response)
      // console.log('thunk-search2: ', response.data.data)

      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);