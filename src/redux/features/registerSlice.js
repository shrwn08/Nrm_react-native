import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    phone_no : '',
    password : '',
    re_password : '',
    isLoading : false,
    isError : null
}

const registerSlice = createSlice({
    name : "register",
    initialState,
    reducers : {},
    extraReducers : {
        
    }
})


export default  registerSlice.reducer;