import axios from 'axios'
import { VentaData, VentaResponse } from '../types/ventas.types'

const API_BASE_URL = 'http://localhost:4000/api'

export const ventasAPI = {
    // Crear una nueva venta
    async crearVenta(ventaData: VentaData): Promise<VentaResponse> {
        try {
            const response = await axios.post(`${API_BASE_URL}/ventas`, ventaData)
            return response.data
        } catch (error: any) {
            console.error('Error creando venta:', error)
            throw new Error(error.response?.data?.error || 'Error al crear la venta')
        }
    },

    // Obtener todas las ventas
    async getVentas(): Promise<VentaResponse[]> {
        try {
            const response = await axios.get(`${API_BASE_URL}/ventas`)
            return response.data
        } catch (error: any) {
            console.error('Error obteniendo ventas:', error)
            throw new Error(error.response?.data?.error || 'Error al obtener las ventas')
        }
    },

    // Obtener venta por ID
    async getVentaById(id: number): Promise<VentaResponse> {
        try {
            const response = await axios.get(`${API_BASE_URL}/ventas/${id}`)
            return response.data
        } catch (error: any) {
            console.error('Error obteniendo venta:', error)
            throw new Error(error.response?.data?.error || 'Error al obtener la venta')
        }
    },

    // Actualizar estado de venta
    async actualizarEstadoVenta(id: number, estado: string): Promise<VentaResponse> {
        try {
            const response = await axios.patch(`${API_BASE_URL}/ventas/${id}/estado`, { estado })
            return response.data
        } catch (error: any) {
            console.error('Error actualizando estado de venta:', error)
            throw new Error(error.response?.data?.error || 'Error al actualizar el estado de la venta')
        }
    },

    // Cancelar venta
    async cancelarVenta(id: number): Promise<VentaResponse> {
        try {
            const response = await axios.patch(`${API_BASE_URL}/ventas/${id}/cancelar`)
            return response.data
        } catch (error: any) {
            console.error('Error cancelando venta:', error)
            throw new Error(error.response?.data?.error || 'Error al cancelar la venta')
        }
    }
}
