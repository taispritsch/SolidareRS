import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

// Create an axios instance
const axiosInstance = axios.create({
    baseURL: 'https://solidarers.com/api',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        timeout: 5000,
    },
});

axiosInstance.interceptors.request.use(async req => {
    const token = await SecureStore.getItemAsync('token');

    req.headers.Authorization = token ? `Bearer ${token}` : '';
    if (!req.url.includes('community')) {
        const token = await SecureStore.getItemAsync('token');
        if (token) {
            req.headers.Authorization = `Bearer ${token}`;
        }
    }

    return req;
});

// Add interceptors for handling global errors
axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    error => {
        return Promise.reject(error);
    },
);

export default axiosInstance;