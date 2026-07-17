import axios from "axios";
import * as secureStore from "expo-secure-store";

export const Api = "http://192.168.29.134:3000/api";

const axiosInstance = axios.create({baseURL : Api, timeout: 10000});


//attach the token to every out going request automatically


axiosInstance.interceptors.request.use(async (config)=>{
    const token = await secureStore.getItemAsync("accessToken"); 

    if(token)
        config.headers.Authorization = `Bearer ${token}`;
    
    
    return config;
})

export default axiosInstance;