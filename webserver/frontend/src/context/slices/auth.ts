import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface userInfo {
  _id: string;
  username: string;
  email: string;
  photo: string;
  birthday: string;
  gender: string;
  role: string;
  createdAt: string;
}

export interface AuthState {
  token: string;
  user: userInfo;
  timeExpire: number;
}
export const initialStateAuth: AuthState = {
  token: localStorage.getItem("token")
    ? JSON.parse(localStorage.getItem("token") || "")
    : "",
  user: localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user") || "")
    : {
        _id: "",
        username: "",
        email: "",
        gender: "",
        photo: "",
        birthday: "",
        role: "",
        createdAt: "",
      },
  timeExpire: localStorage.getItem("timeExpire")
    ? JSON.parse(localStorage.getItem("timeExpire") || "")
    : 0,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: initialStateAuth,
  reducers: {
    login: (
      state,
      action: PayloadAction<{
        token: string;
        user: userInfo;
        timeExpire: number;
      }>
    ) => {
      const newState: AuthState = {
        ...state,
        token: action.payload.token,
        user: action.payload.user,
        timeExpire: action.payload.timeExpire,
      };
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem(
        "timeExpire",
        JSON.stringify(action.payload.timeExpire)
      );

      return newState;
    },
    logout: (state) => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("timeExpire");
      return {
        ...state,
        token: "",
        user: {
          _id: "",
          username: "",
          email: "",
          photo: "",
          birthday: "",
          gender: "",
          role: "",
          createdAt: "",
        },
      };
    },
    updateProfile: (state, action: PayloadAction<{ user: userInfo }>) => {
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload.user,
        },
      };
    },
  },
});

export const { login, logout, updateProfile } = authSlice.actions;

export default authSlice.reducer;
