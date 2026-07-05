import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Api } from "../../utils/api";
import axios from "axios";

const initialState = {
  user: {
    fullname: "",
    email: "",
    phone_no: "",
    company_name: "",
    city: "",
    password: "",
  },
  isLoading: false,
  isError: null,
};

export const userRegister = createAsyncThunk(
  "userRegister",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Api}/register`, data, {
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

export const userlogin = createAsyncThunk(
  "userLogin",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${Api}/login`, data, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Login Failed",
      );
    }
  },
);

const registerSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
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
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
      });
  },
});

export default authSlice.reducer;
