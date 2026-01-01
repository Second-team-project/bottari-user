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

      
      // console.log('response: ', response.data)

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

      return response.data;

    } catch (error) {
      return rejectWithValue(error.response);
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

      return response.data;
      
    } catch (error) {
      return rejectWithValue(error);
      
    }
  }
)

/**
 * 예약이 완료된 후, 정보 조회용
 * 클라이언트 -> 백엔드
 */
export const reserveComplete = createAsyncThunk(
  'reserve/reserveComplete',
  async (reserveCode, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/complete/${reserveCode}`;
      const response = await axiosIns.get(url);

      // console.log('reserveCompletethunk-response: ', response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    } 
  }
)

// =====================================================

/**
 * 회원 예약 정보 조회
 */
export const userReservation = createAsyncThunk(
  'reserve/userReservation',
  async (_, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve`;
      const response = await axiosIns.get(url);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

/**
 * 게스트 예약 정보 조회
 */
export const guestReservation = createAsyncThunk(
  'reserve/guestReservation',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/guest`;
      const response = await axiosIns.post(url, data);

      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

// =====================================================

/**
 * 회원 예약 취소
 */
export const userReservationCancel = createAsyncThunk(
  'reserve/userReservationCancel',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/cancel/${data.reservId}`;
      const response = await axiosIns.post(url, data);

      // console.log('reserveCompletethunk-response: ', response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)

/**
 * 비회원 예약 취소
 */
export const guestReservationCancel = createAsyncThunk(
  'reserve/guestReservationCancel',
  async (data, {rejectWithValue}) => {
    try {
      const url = `/api/user/reserve/guest/cancel/${data.reservId}`;
      const response = await axiosIns.post(url, data);

      // console.log('reserveCompletethunk-response: ', response);

      return response.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
)