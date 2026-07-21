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

  isUpdatingProfile: false, 
  updateProfileError: null,
  isChangingPassword: false, 
  changePasswordError: null,
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

//update Profile
export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/me", data);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update profile",
      );
    }
  },
);


//Change password
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch("/change-password", data);
      if (response.data?.message === "Current password is incorrect") {
        return rejectWithValue(response.data.message);
      }
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to change password",
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
    clearUpdateProfileError: (state) => { 
      state.updateProfileError = null;
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
        state.user = action.payload.user; //action.payload.user
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

      //  update profile
    builder
      .addCase(updateProfile.pending, (state) => {
        state.isUpdatingProfile = true;
        state.updateProfileError = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isUpdatingProfile = false;
        state.user = { ...state.user, ...action.payload };
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isUpdatingProfile = false;
        state.updateProfileError = action.payload;
      });

      // changed - change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isChangingPassword = true;
        state.changePasswordError = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isChangingPassword = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isChangingPassword = false;
        state.changePasswordError = action.payload;
      });
  },
});

export const { logout, clearUpdateProfileError } = authSlice.actions;
export default authSlice.reducer;
