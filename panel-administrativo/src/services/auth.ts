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

export const authApi = {
    login: (usuario: string, password: string) =>
        api.post<LoginResp>('/auth/login', { usuario, password }).then(r => r.data),
    me: (token: string) =>
        api.get<{ success: boolean; user: User }>('/auth/me', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.data),
};
