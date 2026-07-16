import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api";

const initialState = {
  addresses: [],
  isLoadingAddresses: false,
  addressesError: null,

  isCreatingAddress: false,
  createAddressError: null,
  lastCreateAddress: null,

  isDeletingAddress: false,
  daleteAddressError: null,
};

export const fetchAddresses = createAsyncThunk(
  "address/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/address");
      return response.data.address;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failded to fetch addresses",
      );
    }
  },
);


export const createAddress = createAsyncThunk("address/create", async (data, {rejectWithValue})=>{
    try {
        const response = await axiosInstance.post("/address", data);
        return response.data.address;
    } catch (error) {
        rejectWithValue(
            error.response?.data?.message || error.message || "Failed to save address" 
        )
    }
})


export const deleteAddress = createAsyncThunk("address/delete", async (addressId, {rejectWithValue})=>{
    try {
         await axiosInstance.delete(`/address/${addressId}`);
        return addressId;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || error.message || "Failed to delete address")
    }
});

const addressSlice = createSlice({
  name: "address",
  initialState,
  reducers: {
    clearCreateAddressError: (state) => {
      state.createAddressError = null;
    },
    clearLastCreatedAddress: (state) => {
      state.lastCreatedAddress = null;
    },
  },
  extraReducers: (builder) => {
    //fetch all address
    builder
      .addCase(fetchAddresses.pending, (state) => {
        state.isLoadingAddresses = true;
        state.addressesError = null;
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.isLoadingAddresses = false;
        state.addresses = action.payload;
      })
      .addCase(fetchAddresses.rejected, (state, action) => {
        state.isLoadingAddresses = false;
        state.addressesError = action.payload;
      });

      //create Address
      builder
      .addCase(createAddress.pending, (state)=>{
        state.isLoadingAddresses = true;
        state.createAddressError = null;
      })
      .addCase(createAddress.fulfilled, (state, action)=>{
        state.isCreatingAddress = false;
        state.lastCreatedAddress = action.payload;
      })
      .addCase(createAddress.rejected, (state, action)=>{
        state.isCreatingAddress = false;
        state.createAddressError = action.payload;
      });


      //delete address
      builder
      .addCase(deleteAddress.pending, (state)=>{
        state.isDeletingAddress = false;
        state.deleteAddressError = action.payload;
      });
  },
});

export const { clearCreateAddressError, clearLastCreatedAddress } =
  addressSlice.actions;

export default addressSlice.reducer;
