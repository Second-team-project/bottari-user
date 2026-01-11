import { createAsyncThunk } from "@reduxjs/toolkit"
import axiosIns from "../../api/axiosInstance.js";

/**
 * 후기 목록 불러오기
 */
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
    
    return response.data.data;

  } catch (error) {
    return rejectWithValue(error);
  }}
)

/**
 * 후기 작성 가능한 예약 목록 불러오기
*/
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

/**
 * 후기 생성하기
 */
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

/**
 * 후기 삭제하기
 */
export const destroyReview = createAsyncThunk(
  'review/destroyReview',
  async (id, {rejectWithValue}) => {
    try {

    const url = `/api/user/review/${id}`;

    const response = await axiosIns.delete(url);

    return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)