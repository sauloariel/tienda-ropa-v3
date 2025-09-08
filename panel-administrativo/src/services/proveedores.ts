import { api } from './http'

export interface Proveedor {
    id_proveedor: number
    nombre: string
    contacto: string
    direccion: string
    telefono: string
}

export interface ProveedorCreate {
    nombre: string
    contacto: string
    direccion: string
    telefono: string
}

export interface ProveedorUpdate {
    nombre?: string
    contacto?: string
    direccion?: string
    telefono?: string
}

export const proveedoresAPI = {
    // Obtener todos los proveedores
    getProveedores: async (): Promise<Proveedor[]> => {
        try {
            const response = await api.get('/proveedores')
            return response.data
        } catch (error) {
            console.error('Error obteniendo proveedores:', error)
            return []
        }
    },

    // Obtener proveedor por ID
    getProveedorById: async (id: number): Promise<Proveedor | null> => {
        try {
            const response = await api.get(`/proveedores/${id}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo proveedor:', error)
            return null
        }
    },

    // Crear nuevo proveedor
    createProveedor: async (proveedor: ProveedorCreate): Promise<Proveedor | null> => {
        try {
            const response = await api.post('/proveedores', proveedor)
            return response.data
        } catch (error) {
            console.error('Error creando proveedor:', error)
            throw error
        }
    },

    // Actualizar proveedor
    updateProveedor: async (id: number, proveedor: ProveedorUpdate): Promise<Proveedor | null> => {
        try {
            const response = await api.put(`/proveedores/${id}`, proveedor)
            return response.data
        } catch (error) {
            console.error('Error actualizando proveedor:', error)
            throw error
        }
    },

    // Eliminar proveedor
    deleteProveedor: async (id: number): Promise<boolean> => {
        try {
            await api.delete(`/proveedores/${id}`)
            return true
        } catch (error) {
            console.error('Error eliminando proveedor:', error)
            throw error
        }
    }
}





