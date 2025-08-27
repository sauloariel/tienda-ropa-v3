import { api } from './api'

export interface Cliente {
    id_cliente: number
    dni: string
    cuit_cuil: string
    nombre: string
    apellido: string
    domicilio: string
    telefono: string
    mail: string
    estado?: string
    password?: string
}

export interface ClienteCreate {
    dni: string
    cuit_cuil: string
    nombre: string
    apellido: string
    domicilio: string
    telefono: string
    mail: string
    estado?: string
    password?: string
}

export interface ClienteUpdate {
    dni?: string
    cuit_cuil?: string
    nombre?: string
    apellido?: string
    domicilio?: string
    telefono?: string
    mail?: string
    estado?: string
    password?: string
}

export const clientesAPI = {
    // Obtener todos los clientes
    getClientes: async (): Promise<Cliente[]> => {
        try {
            const response = await api.get('/clientes')
            return response.data
        } catch (error) {
            console.error('Error obteniendo clientes:', error)
            return []
        }
    },

    // Obtener cliente por ID
    getClienteById: async (id: number): Promise<Cliente | null> => {
        try {
            const response = await api.get(`/clientes/${id}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo cliente:', error)
            return null
        }
    },

    // Crear nuevo cliente
    createCliente: async (cliente: ClienteCreate): Promise<Cliente | null> => {
        try {
            const response = await api.post('/clientes', cliente)
            return response.data
        } catch (error) {
            console.error('Error creando cliente:', error)
            throw error
        }
    },

    // Actualizar cliente
    updateCliente: async (id: number, cliente: ClienteUpdate): Promise<Cliente | null> => {
        try {
            const response = await api.put(`/clientes/${id}`, cliente)
            return response.data
        } catch (error) {
            console.error('Error actualizando cliente:', error)
            throw error
        }
    },

    // Eliminar cliente
    deleteCliente: async (id: number): Promise<boolean> => {
        try {
            await api.delete(`/clientes/${id}`)
            return true
        } catch (error) {
            console.error('Error eliminando cliente:', error)
            throw error
        }
    }
}
