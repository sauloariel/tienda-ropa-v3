import axios from 'axios';
import { config } from '../config/config';

export const api = axios.create({
    baseURL: config.api.baseURL
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});
