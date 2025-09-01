import axios from 'axios';

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
    headers: { 'Content-Type': 'application/json' },
});

// Interceptor para debuggear requests
api.interceptors.request.use(
    (config) => {
        console.log('🚀 Request:', config.method?.toUpperCase(), config.url);
        console.log('📋 Headers:', config.headers);
        if (config.data) {
            console.log('📦 Data:', config.data);
        }
        return config;
    },
    (error) => {
        console.error('❌ Request Error:', error);
        return Promise.reject(error);
    }
);

// Interceptor para debuggear responses
api.interceptors.response.use(
    (response) => {
        console.log('✅ Response:', response.status, response.config.url);
        console.log('📋 Response Data:', response.data);
        return response;
    },
    (error) => {
        console.error('❌ Response Error:', error.response?.status, error.config?.url);
        console.error('❌ Error Data:', error.response?.data);
        return Promise.reject(error);
    }
);
