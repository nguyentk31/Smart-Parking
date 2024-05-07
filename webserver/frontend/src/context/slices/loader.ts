import { createSlice } from "@reduxjs/toolkit";

interface LOADER {
  isLoading: boolean;
}

const initialLoader: LOADER = {
  isLoading: false,
};

const loaderSlice = createSlice({
  name: "loader",
  initialState: initialLoader,
  reducers: {
    showLoader: (state) => {
      return {
        ...state,
        isLoading: true,
      };
    },
    hideLoader: (state) => {
      return {
        ...state,
        isLoading: false,
      };
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;

export default loaderSlice.reducer;
