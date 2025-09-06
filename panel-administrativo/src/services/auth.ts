import { api } from './http';

export type Rol = 'Admin' | 'Vendedor' | 'Inventario' | 'Marketing';

export interface User {
    id: number;
    usuario: string;
    nombre: string;
    rol: Rol;
}

export interface LoginResp {
    token: string;
    user: User;
}

export interface LoginRequest {
    usuario: string;
    password: string;
}

export const authApi = {
    login: (usuario: string, password: string) =>
        api.post<LoginResp>('/loguin/auth/login', { usuario, password }).then(r => r.data),
    me: (token: string) =>
        api.get<{ success: boolean; usuario: User }>('/loguin/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
    verify: (token: string) =>
        api.get<{ success: boolean; usuario: User }>('/loguin/auth/verify', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
    changePassword: (password_actual: string, password_nuevo: string, token: string) =>
        api.put('/loguin/auth/change-password', { password_actual, password_nuevo }, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
    logout: () =>
        api.post('/loguin/auth/logout').then(r => r.data),
};
