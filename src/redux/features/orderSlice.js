import {
  createAsyncThunk,
  createSlice,
  isRejectedWithValue,
} from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api";

const initialState = {
  order: [],
  isLoadingOrders: false,
  ordersError: null,

  isCreatingOrder: false,
  createOrderError: null,
  lastCreatedOrder: null,

  isUpdatingStatus: false,
  updateStatusError: null,
};

export const createOrder = createAsyncThunk(
  "order/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/orders", data);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to place order",
      );
    }
  },
);

//fetch all for the user only
export const fetchOrders = createAsyncThunk(
  "order/fetchAll",
  async (status, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/orders", {
        params: status ? { status } : undefined,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "failed to fetch order",
      );
    }
  },
);

//order fetch by id

export const fetchOrderById = createAsyncThunk(
  "order/fetchOne",
  async (OrderId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`/orders/${orderId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to fetch order",
      );
    }
  },
);

//update Order status

export const updateOrderStatus = createAsyncThunk(
  "order/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.patch(`/orders/${orderId}/status`, {
        status,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          error.message ||
          "Failed to update order status",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearCreateOrderError: (state) => {
      state.createOrderError = null;
    },
    clearLastCreateOrder: (state) => {
      state.lastCreatedOrder = null;
    },
  },
  extraReducers: (builder) => {
    //create order

    builder
      .addCase(createOrder.pending, (state) => {
        state.isCreatingOrder = true;
        state.createOrderError = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isCreatingOrder = false;
        state.lastCreatedOrder = action.payload.order;
        state.orders = [action.payload.order, ...state.orders];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isCreatingOrder = false;
        state.createOrderError = action.payload;
      });

    //fetch order
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.isLoadingOrders = true;
        state.ordersError = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.ordersError = action.payload;
      });

    //order fetched by id
    builder
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoadingOrders = true;
        state.ordersError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        const index = state.orders.findIndex(
          (o) => o._id === action.payload._id,
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoadingOrders = false;
        state.ordersError = action.payload;
      });

        //update order status
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.isUpdatingStatus = true;
        state.updateStatusError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isUpdatingStatus = false;
        const index = state.orders.findIndex((o) => o._id === action.payload._id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isUpdatingStatus = false;
        state.updateStatusError = action.payload;
      });

  },
});

export const { clearCreateOrderError, clearLastCreateOrder } =
  orderSlice.actions;
export default orderSlice.reducer;
