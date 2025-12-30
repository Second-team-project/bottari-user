import { createSlice } from "@reduxjs/toolkit"
import { guestReservation, guestReservationCancel, userReservation, userReservationCancel } from "../thunks/reserveThunk";

const initialState = {
  deliveryReserve: null,
  storageReserve: null,
  reservationList: [],
  reservation: null,
  loading: false,
  error: null,
}

const slice = createSlice({
  name: 'reserve',
  initialState,
  reducers: {
    setDeliveryReserve(state, action) {
      state.deliveryReserve = action.payload;
    },
    setStorageReserve(state, action) {
      state.storageReserve = action.payload;
    },
    clearDeliveryReserve(state) {
      state.deliveryReserve = null
    },
    clearStorageReserve(state) {
      state.storageReserve = null
    },
    clearAllReserve(state) {
      state.deliveryReserve = null;
      state.storageReserve = null;
    },

    setReservationList(state, action) {
      state.reservationList = action.payload;
    },
    clearReservationList(state) {
      state.reservationList = [];
    },
    setReservation(state, action) {
      state.reservation = action.payload;
    },
    clearReservation(state) {
      state.reservation = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(userReservation.fulfilled, (state, action) => {
        state.reservationList = action.payload.data;
      })
      .addCase(guestReservation.fulfilled, (state, action) => {
        state.reservation = action.payload.data;
      })

      .addCase(userReservationCancel.fulfilled, (state, action) => {
        const cancelledId = action.meta.arg.reservId;
        const item = state.reservationList.find(resev => resev.id === cancelledId);
        if (item) item.state = 'CANCELLED';
      })
      .addCase(guestReservationCancel.fulfilled, (state, action) => {
        const cancelledId = action.meta.arg.reservId;
        state.reservation.state = 'CANCELLED';
      })
  }
})

export const {
  setDeliveryReserve,
  setStorageReserve,
  clearDeliveryReserve,
  clearStorageReserve,
  clearAllReserve,

  setReservationList,
  clearReservationList,
  setReservation,
  clearReservation,
} = slice.actions;

export default slice.reducer;