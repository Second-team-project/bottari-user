/**
 * @file client/src/store/slices/menuSlice.js
 * @description 메뉴 redux slice
 * 251213 v1.0.0 N init
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  menuFlg: false,
}

const slice = createSlice({
  name: 'menuSlice',
  initialState,
  reducers: {
    setMenuFlg(state, action) {
      state.menuFlg = action.payload;
    }
  },
});

export const {
  setMenuFlg,
} = slice.actions;

export default slice.reducer;