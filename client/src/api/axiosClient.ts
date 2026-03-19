import axios from "axios";

const instance = axios.create({
    withCredentials: true,
    baseURL: import.meta.env.VITE_SERVER_URL
});

export default instance;