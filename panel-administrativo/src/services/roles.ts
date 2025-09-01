import { api } from './api';

export interface Rol {
    id_rol: number;
    descripcion: string;
}

export const rolesAPI = {
    getAll: () => api.get<Rol[]>('/roles'),
    getById: (id: number) => api.get<Rol>(`/roles/${id}`),
    create: (data: Omit<Rol, 'id_rol'>) => api.post<Rol>('/roles', data),
    update: (id: number, data: Partial<Omit<Rol, 'id_rol'>>) => api.put<Rol>(`/roles/${id}`, data),
    delete: (id: number) => api.delete(`/roles/${id}`),
};
