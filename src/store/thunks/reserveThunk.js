import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

export const createDraftReservation = createAsyncThunk(
  'reserve/reserveThunk',
  async ({reserveData, password}, {rejectWithValue}) => {
    try {
      const response = await axiosIns.post(
        '/api/user/reserve/draft',
      )
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);