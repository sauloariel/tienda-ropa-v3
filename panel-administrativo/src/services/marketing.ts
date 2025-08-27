import axios from 'axios'
import { PromocionCreate, PromocionUpdate, PromocionResponse, PromocionStats } from '../types/marketing.types'

const API_BASE_URL = 'http://localhost:4000/api'

export const marketingAPI = {
    // Obtener todas las promociones
    async getPromociones(): Promise<PromocionResponse[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/promociones`)
            return response.data
        } catch (error: any) {
            console.error('Error obteniendo promociones:', error)
            throw new Error(error.response?.data?.error || 'Error al obtener las promociones')
        }
    },

    // Obtener promoción por ID
    async getPromocionById(id: number): Promise<PromocionResponse> {
        try {
            const response = await axios.get(`${API_BASE_URL}/promociones/${id}`)
            return response.data
        } catch (error: any) {
            console.error('Error obteniendo promoción:', error)
            throw new Error(error.response?.data?.error || 'Error al obtener la promoción')
        }
    },

    // Crear nueva promoción
    async crearPromocion(promocionData: PromocionCreate): Promise<PromocionResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/promociones`, promocionData)
            return response.data
        } catch (error: any) {
            console.error('Error creando promoción:', error)
            throw new Error(error.response?.data?.error || 'Error al crear la promoción')
        }
    },

    // Actualizar promoción
    async actualizarPromocion(id: number, promocionData: PromocionUpdate): Promise<PromocionResponse> {
        try {
            const response = await axios.put(`${API_BASE_URL}/promociones/${id}`, promocionData)
            return response.data
        } catch (error: any) {
            console.error('Error actualizando promoción:', error)
            throw new Error(error.response?.data?.error || 'Error al actualizar la promoción')
        }
    },

    // Eliminar promoción
    async eliminarPromocion(id: number): Promise<void> {
        try {
            await axios.delete(`${API_BASE_URL}/promociones/${id}`)
        } catch (error: any) {
            console.error('Error eliminando promoción:', error)
            throw new Error(error.response?.data?.error || 'Error al eliminar la promoción')
        }
    },

    // Activar/Desactivar promoción
    async cambiarEstadoPromocion(id: number, estado: 'ACTIVA' | 'INACTIVA'): Promise<PromocionResponse> {
        try {
            const response = await axios.patch(`${API_BASE_URL}/promociones/${id}/estado`, { estado })
            return response.data
        } catch (error: any) {
            console.error('Error cambiando estado de promoción:', error)
            throw new Error(error.response?.data?.error || 'Error al cambiar el estado de la promoción')
        }
    },

    // Obtener estadísticas de promociones
    async getPromocionStats(): Promise<PromocionStats> {
        try {
            const response = await axios.get(`${API_BASE_URL}/promociones/stats`)
            return response.data
        } catch (error: any) {
            console.error('Error obteniendo estadísticas:', error)
            throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas')
        }
    },

    // Validar código de descuento
    async validarCodigoDescuento(codigo: string, montoCompra: number): Promise<{
        valido: boolean
        promocion?: PromocionResponse
        descuento?: number
        mensaje?: string
    }> {
        try {
            const response = await axios.post(`${API_BASE_URL}/promociones/validar-codigo`, {
                codigo,
                monto_compra: montoCompra
            })
            return response.data
        } catch (error: any) {
            console.error('Error validando código de descuento:', error)
            throw new Error(error.response?.data?.error || 'Error al validar el código de descuento')
        }
    }
}
