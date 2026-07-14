import { createSlice } from "@reduxjs/toolkit";
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


const orderSlice = createSlice({
    name : "order",
    initialState,
    reducers : {

    },
    extraReducers:(builder)>{

    }
})

export const {} = orderSlice.actions;
export default orderSlice.reducer;