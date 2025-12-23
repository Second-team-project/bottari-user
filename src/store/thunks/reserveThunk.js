import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosIns from "../../api/axiosInstance";

/**
 * 배송용 예약 정보 : '결제 대기' 상태 생성 요청 
 * 클라이언트 -> 백엔드
 */
export const createDeliveryDraft = createAsyncThunk(
  'reserve/reserveDraftDeliveryThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/draft/delivery`;

      const response = await axiosIns.post(url, data)

      
      console.log('response: ', response.data)

      return response.data;

    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * 보관용 예약 정보 : '결제 대기' 상태 생성 요청 
 * 클라이언트 -> 백엔드
 */
export const createStorageDraft = createAsyncThunk(
  'reserve/reserveDraftStorageThunk',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/draft/storage`;

      const response = await axiosIns.post(url, data)

      
      console.log('response: ', response.data)

      return response.data;

    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

/**
 * 결제 완료 후, 결제 승인 요청
 * 클라이언트 -> 백엔드
 */
export const tossPaymentsConfirm = createAsyncThunk(
  'reserve/tossPaymentsConfirm',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/confirm/payment`;
      const response = await axiosIns.post(url, data);

      console.log('response-결제승인요청 결과 : ', response.data)

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
      
    }
  }
)
