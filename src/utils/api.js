import axios from "axios";
import * as secureStore from "expo-secure-store";

export const Api =  process.env.EXPO_PUBLIC_API_URL;

const axiosInstance = axios.create({baseURL : Api, timeout: 10000});


//attach the token to every out going request automatically


axiosInstance.interceptors.request.use(async (config)=>{
    const token = await secureStore.getItemAsync("accessToken"); 

    if(token)
        config.headers.Authorization = `Bearer ${token}`;
    
    
    return config;
})

export default axiosInstance;