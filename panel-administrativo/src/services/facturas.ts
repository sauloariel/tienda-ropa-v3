import simpleApi from './simpleApi'

export interface Cliente {
    id: number
    nombre: string
    apellido: string
}

export interface Empleado {
    id: number
    nombre: string
    apellido: string
    usuario: string
}

export interface Factura {
    id: number
    numeroFactura: string
    fecha: string
    total: number
    cliente_id?: number
    cliente?: Cliente
    empleado_id?: number
    empleado?: Empleado
    estado: string
    metodo_pago: string
    created_at?: string
    updated_at?: string
}

export interface FacturaCreate {
    numeroFactura: string
    fecha: string
    total: number
    cliente_id?: number | null
    empleado_id?: number | null
    metodo_pago: string
    estado?: string
}

export interface FacturaUpdate {
    numeroFactura?: string
    fecha?: string
    total?: number
    cliente_id?: number | null
    empleado_id?: number | null
    metodo_pago?: string
    estado?: string
}

export const facturasAPI = {
    // Obtener todas las facturas
    getFacturas: async (): Promise<Factura[]> => {
        try {
            const response = await simpleApi.get('/facturas')
            console.log('📋 Facturas API Response:', response.data)

            // La API devuelve { success: true, facturas: [...] }
            if (response.data && response.data.success && Array.isArray(response.data.facturas)) {
                return response.data.facturas
            } else if (Array.isArray(response.data)) {
                return response.data
            } else if (response.data && Array.isArray(response.data.data)) {
                return response.data.data
            } else {
                console.warn('⚠️ Formato de respuesta inesperado:', response.data)
                return []
            }
        } catch (error) {
            console.error('Error obteniendo facturas:', error)
            return []
        }
    },

    // Obtener factura por ID
    getFacturaById: async (id: number): Promise<Factura | null> => {
        try {
            const response = await simpleApi.get(`/facturas/${id}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo factura:', error)
            return null
        }
    },

    // Crear nueva factura
    createFactura: async (factura: FacturaCreate): Promise<Factura | null> => {
        try {
            const response = await simpleApi.post('/facturas', factura)
            return response.data
        } catch (error) {
            console.error('Error creando factura:', error)
            throw error
        }
    },

    // Actualizar factura
    updateFactura: async (id: number, factura: FacturaUpdate): Promise<Factura | null> => {
        try {
            const response = await simpleApi.put(`/facturas/${id}`, factura)
            return response.data
        } catch (error) {
            console.error('Error actualizando factura:', error)
            throw error
        }
    },

    // Eliminar factura
    deleteFactura: async (id: number): Promise<boolean> => {
        try {
            await simpleApi.delete(`/facturas/${id}`)
            return true
        } catch (error) {
            console.error('Error eliminando factura:', error)
            throw error
        }
    },

    // Descargar factura en PDF
    downloadFactura: async (id: number): Promise<void> => {
        try {
            const response = await simpleApi.get(`/facturas/${id}/download`, {
                responseType: 'blob'
            })

            // Crear URL para descarga
            const url = window.URL.createObjectURL(new Blob([response.data]))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', `factura-${id}.pdf`)
            document.body.appendChild(link)
            link.click()
            link.remove()
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Error descargando factura:', error)
            throw error
        }
    }
}
