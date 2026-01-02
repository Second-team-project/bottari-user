import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosIns from "../../api/axiosInstance.js";

export const getDriverLocation = createAsyncThunk(
  'driver/getDriverLocation',
  async (id, {rejectWithValue}) => {
  const url = `/api/driver/location/${id}`

  try {
    const response = await axiosIns.get(url);
    
    return response.data;

  } catch (error) {
    return rejectWithValue(error);
  }}
)
