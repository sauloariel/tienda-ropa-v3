import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export interface LoginCredentials {
    usuario: string;
    password: string;
}

export interface User {
    id: number;
    usuario: string;
    nombre: string;
    rol: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    user: User;
}

export const authService = {
    // Login
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        return response.data;
    },

    // Verificar token
    verifyToken: async (token: string): Promise<{ success: boolean; user?: User }> => {
        try {
            const response = await axios.get(`${API_URL}/auth/verify`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return response.data;
        } catch (error) {
            return { success: false };
        }
    }
};
