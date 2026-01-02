import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosIns from "../../api/axiosInstance.js";

export const getReviewList = createAsyncThunk(
  'review/getReviewList',
  async (data, {rejectWithValue}) => {
  const url = `/api/user/review`

  try {
    const response = await axiosIns.get(url, {
      params: {
        page: data?.page || 1,
      }
    });
    
    return response.data;

  } catch (error) {
    return rejectWithValue(error);
  }}
)

export const createReview = createAsyncThunk(
  'review/createReview',
  async (data, {rejectWithValue}) => {
    try {

    const url = `/api/user/review`;
    const headers = {
      'Content-Type': 'multipart/form-data'
    };
    const formData = new FormData();
    formData.append('reservId', data.reservId);
    formData.append('title', data.title);
    formData.append('content', data.content);
    formData.append('img', data.img);

    const response = await axiosIns.post(url, formData, { headers });

    return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

export const getReviewable = createAsyncThunk(
  'review/getReviewable',
  async (_, {rejectWithValue}) => {
    try {
      const url = `/api/user/review/reviewable`;

      const response = await axiosIns.get(url)

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
      
    }
  }
)