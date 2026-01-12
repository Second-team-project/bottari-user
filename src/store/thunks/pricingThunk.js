import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

/**
 * 기본 요금 가져오기
 */
export const getPricing = createAsyncThunk(
  'pricing/getPricingThunk',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/admin/pricing`;

      const response = await axiosIns.get(url);

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * 구간별 추가 요금 가져오기
 */
export const getAdditionalPricing = createAsyncThunk(
  'pricing/getAdditionalPricing',
  async (_, {rejectWithValue}) => {
    try {

      const url = `/api/admin/pricing/additional`;

      const response = await axiosIns.get(url);

      return response.data.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)