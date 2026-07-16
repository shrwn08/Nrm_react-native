import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axiosInstance from "../../utils/api"

const initialState = {
    order : [], 
    isLoadingOrders : false,
    ordersError : null, 

    isCreatingOrder : false,
    createOrderError  : null,
    lastCreatedOrder : null,

    isUpdatingStatus : false,
    updateStatusError : null
};


export const createOrder = createAsyncThunk("order/create", async (data, {rejectWithValue})=>{
    try{
        const response = await axiosInstance.post("/orders", data);
        return response.data;
    }catch(error){
        return rejectWithValue(
            error.response?.data?.message || error.message || "Failed to place order"
        )
    }
});

//fetch all for the user only
export const fetchOrders = createAsyncThunk("order/fetchAll", async(status, {rejectWithValue})=>{
    try {
        const response = await axiosInstance.get("/orders",{
        params: status ? { status } : undefined,
      });
      return response.data;
    } catch (error) {
        return rejectWithValue(
            error.response?.data?.message || error.message || "failed to fetch order"
        )
    }
})

const orderSlice = createSlice({
    name : "order",
    initialState,
    reducers : {
        clearCreateOrderError : state =>{
            state.createOrderError = null;

        },
        clearLastCreateOrder : state =>{
            state.lastCreatedOrder = null;
        }
    },
    extraReducers:(builder)=>{
        //create order

        builder.addCase(createOrder.pending, (state)=>{
            state.isCreatingOrder = true;
            state.createOrderError = null;
        })
        .addCase(createOrder.fulfilled, (state, action)=>{
            state.isCreatingOrder = false;
            state.lastCreatedOrder = action.payload.order;
            state.orders = [action.payload.order, ...state.orders];
        })
        .addCase(createOrder.rejected, (state,action)=>{
            state.isCreatingOrder = false;
            state.createOrderError = action.payload;
        });

        builder
        .addCase(fetchOrders.pending, (state)=>{
            state.isLoadingOrders = true;
            state.ordersError = null;
        })
        .addCase(fetchOrders.fulfilled, (state,action)=>{
            state.isLoadingOrders = false;
            state.orders = action.payload;
        })
        .addCase()



    }
})

export const {clearCreateOrderError, clearLastCreateOrder} = orderSlice.actions;
export default orderSlice.reducer;