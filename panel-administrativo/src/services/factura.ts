import simpleApi from './simpleApi';
import { FacturaRequest, FacturaResponse, FacturaListResponse, FacturaStatsResponse } from '../types/factura.types';

// Crear nueva factura
export const crearFactura = async (facturaData: FacturaRequest): Promise<FacturaResponse> => {
    try {
        const response = await simpleApi.post('/facturas', facturaData);
        return response.data;
    } catch (error: any) {
        console.error('Error al crear factura:', error);
        throw new Error(error.response?.data?.error || 'Error al crear la factura');
    }
};

// Obtener todas las facturas
export const obtenerFacturas = async (fechaInicio?: string, fechaFin?: string, estado?: string): Promise<FacturaListResponse> => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);
        if (estado) params.append('estado', estado);

        const response = await simpleApi.get(`/facturas?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener facturas:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener las facturas');
    }
};

// Obtener factura por ID
export const obtenerFacturaPorId = async (id: number): Promise<FacturaResponse> => {
    try {
        const response = await simpleApi.get(`/facturas/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener factura:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener la factura');
    }
};

// Obtener estadísticas de facturas
export const obtenerEstadisticasFacturas = async (fechaInicio?: string, fechaFin?: string): Promise<FacturaStatsResponse> => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);

        const response = await simpleApi.get(`/facturas/estadisticas?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener estadísticas:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas');
    }
};

// Anular factura
export const anularFactura = async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await simpleApi.put(`/facturas/${id}/anular`);
        return response.data;
    } catch (error: any) {
        console.error('Error al anular factura:', error);
        throw new Error(error.response?.data?.error || 'Error al anular la factura');
    }
};

// Obtener siguiente número de factura
export const obtenerSiguienteNumeroFactura = async (): Promise<{ success: boolean; numero: string }> => {
    try {
        const response = await simpleApi.get('/facturas/next-number');
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener siguiente número de factura:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener el siguiente número de factura');
    }
};










