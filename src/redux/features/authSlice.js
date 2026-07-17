import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api";
import * as SecureStore from "expo-secure-store";
("");
import axios from "axios";

const initialState = {
  user: null,
  isLoading: false,
  isError: null,
  isLoggedIn: false,
  isBootstrapping: true,
};

export const userRegister = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/register`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration Failed",
      );
    }
  },
);

export const userLogin = createAsyncThunk(
  "auth/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      //persist the token securely on the device

      await SecureStore.setItemAsync("accessToken", response.data.token);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login Failed",
      );
    }
  },
);

export const restoreSession = createAsyncThunk(
  "auth/restoreSession",
  async (__BUNDLE_START_TIME__, { rejectWithValue }) => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (!token) {
        return rejectWithValue("No stored session");
      }

      const response = await axiosInstance.get("/me");
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        // only clear the token on an actual auth rejection
        await SecureStore.deleteItemAsync("accessToken");
      }
      return rejectWithValue(
        error.response?.data?.message || error.message || "Session expired",
      );
    }
  },
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    //register
    builder
      .addCase(userRegister.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(userRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = action.payload;
      })
      .addCase(userRegister.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    //login
    builder
      .addCase(userLogin.pending, (state) => {
        state.isLoading = true;
        state.isError = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = null;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });

    //restore session
    builder
      .addCase(restoreSession.pending, (state) => {
        state.isBootstrapping = true;
      })
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.isBootstrapping = false;
        state.user = action.payload;
        state.isLoggedIn = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.isBootstrapping = false;
        state.user = null;
        state.isLoggedIn = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
