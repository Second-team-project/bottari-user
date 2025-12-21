import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  deliveryReserve: null,
  storageReserve: null,
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
  },
})

export const {
  setDeliveryReserve,
  setStorageReserve,
  clearDeliveryReserve,
  clearStorageReserve,
  clearAllReserve,
} = slice.actions;

export default slice.reducer;