import axios from "axios";
import { useStateContext } from "./context/contextProvider.jsx";

const axiosClient = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}/api`
})

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    config.headers.Authorization = `Bearer ${token}`
    return config;
})

axiosClient.interceptors.response.use((response) => {
    console.log("response")

    return response
}, (error) => {
    console.log(error)

    const { response } = error;
    if (response.status === 401) {//unauthorized
        console.log("unauthorized")
    } else if (response.status === 404) { //notfound
        console.log("notfound")

    }
    throw error;
})

export default axiosClient