import simpleApi from './simpleApi';

export interface Rol {
    id_rol: number;
    descripcion: string;
}

export const rolesAPI = {
    getAll: () => simpleApi.get<Rol[]>('/roles'),
    getById: (id: number) => simpleApi.get<Rol>(`/roles/${id}`),
    create: (data: Omit<Rol, 'id_rol'>) => simpleApi.post<Rol>('/roles', data),
    update: (id: number, data: Partial<Omit<Rol, 'id_rol'>>) => simpleApi.put<Rol>(`/roles/${id}`, data),
    delete: (id: number) => simpleApi.delete(`/roles/${id}`),
};
