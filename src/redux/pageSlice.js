import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentPage: "/home", // Default page
  selectedBrands: [],
};

const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    
    addBrand: (state, action) => {
      if (!state.selectedBrands.includes(action.payload)) {
        state.selectedBrands = action.payload;
      }
    },
    removeBrand: (state, action) => {
      state.selectedBrands = state.selectedBrands.filter(
        (brand) => brand !== action.payload
      );
    },
  },
});

export const { setPage, addBrand, removeBrand } = pageSlice.actions;

export default pageSlice.reducer;
