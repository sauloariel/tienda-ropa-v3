import simpleApi from './simpleApi';

// Tipos para marketing
export interface Promocion {
    id_promocion: number;
    nombre: string;
    descripcion?: string;
    tipo: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL';
    valor: number;
    codigo_descuento?: string;
    fecha_inicio: string;
    fecha_fin: string;
    minimo_compra?: number;
    uso_maximo?: number;
    uso_actual: number;
    estado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA';
    createdAt?: string;
    updatedAt?: string;
}

export interface MarketingStats {
    total_promociones: number;
    promociones_activas: number;
    promociones_inactivas: number;
    promociones_expiradas: number;
    promociones_por_vencer: number;
    total_uso: number;
}

export interface CreatePromocionData {
    nombre: string;
    descripcion?: string;
    tipo: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL';
    valor: number;
    codigo_descuento?: string;
    fecha_inicio: string;
    fecha_fin: string;
    minimo_compra?: number;
    uso_maximo?: number;
    estado?: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA';
}

export interface ValidateCodigoResponse {
    valid: boolean;
    promocion?: {
        id: number;
        nombre: string;
        tipo: string;
        valor: number;
        descuento: number;
    };
    error?: string;
}

// Servicio de marketing
export const marketingAPI = {
    // Obtener todas las promociones
    getPromociones: async (params?: {
        estado?: string;
        tipo?: string;
        search?: string;
    }): Promise<Promocion[]> => {
        try {
            const response = await simpleApi.get('/marketing/promociones', { params });
            return response.data;
        } catch (error) {
            console.error('Error obteniendo promociones:', error);
            // Retornar datos de ejemplo si falla la API
            return [
                {
                    id_promocion: 1,
                    nombre: 'Descuento de Verano',
                    descripcion: 'Descuento especial para la temporada de verano',
                    tipo: 'PORCENTAJE',
                    valor: 20,
                    codigo_descuento: 'VERANO20',
                    fecha_inicio: '2024-01-01',
                    fecha_fin: '2024-12-31',
                    minimo_compra: 100,
                    uso_maximo: 1000,
                    uso_actual: 150,
                    estado: 'ACTIVA'
                },
                {
                    id_promocion: 2,
                    nombre: '2x1 en Ropa',
                    descripcion: 'Lleva 2 y paga 1 en toda la ropa',
                    tipo: '2X1',
                    valor: 0,
                    codigo_descuento: '2X1ROPA',
                    fecha_inicio: '2024-01-01',
                    fecha_fin: '2024-12-31',
                    minimo_compra: 50,
                    uso_maximo: 500,
                    uso_actual: 75,
                    estado: 'ACTIVA'
                }
            ];
        }
    },

    // Obtener promoción por ID
    getPromocionById: async (id: number): Promise<Promocion> => {
        try {
            const response = await simpleApi.get(`/marketing/promociones/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error obteniendo promoción:', error);
            throw new Error('Error al obtener la promoción');
        }
    },

    // Crear nueva promoción
    createPromocion: async (data: CreatePromocionData): Promise<Promocion> => {
        try {
            const response = await simpleApi.post('/marketing/promociones', data);
            return response.data;
        } catch (error: any) {
            console.error('Error creando promoción:', error);
            throw new Error(error.response?.data?.error || 'Error al crear la promoción');
        }
    },

    // Actualizar promoción
    updatePromocion: async (id: number, data: Partial<CreatePromocionData>): Promise<Promocion> => {
        try {
            const response = await simpleApi.put(`/marketing/promociones/${id}`, data);
            return response.data;
        } catch (error: any) {
            console.error('Error actualizando promoción:', error);
            throw new Error(error.response?.data?.error || 'Error al actualizar la promoción');
        }
    },

    // Eliminar promoción
    deletePromocion: async (id: number): Promise<void> => {
        try {
            await simpleApi.delete(`/marketing/promociones/${id}`);
        } catch (error: any) {
            console.error('Error eliminando promoción:', error);
            throw new Error(error.response?.data?.error || 'Error al eliminar la promoción');
        }
    },

    // Cambiar estado de promoción
    togglePromocionEstado: async (id: number, estado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA'): Promise<Promocion> => {
        try {
            const response = await simpleApi.patch(`/marketing/promociones/${id}/estado`, { estado });
            return response.data;
        } catch (error: any) {
            console.error('Error cambiando estado de promoción:', error);
            throw new Error(error.response?.data?.error || 'Error al cambiar el estado de la promoción');
        }
    },

    // Obtener estadísticas de marketing
    getMarketingStats: async (): Promise<MarketingStats> => {
        try {
            const response = await simpleApi.get('/marketing/stats');
            return response.data;
        } catch (error) {
            console.error('Error obteniendo estadísticas de marketing:', error);
            // Retornar datos de ejemplo
            return {
                total_promociones: 15,
                promociones_activas: 8,
                promociones_inactivas: 4,
                promociones_expiradas: 3,
                promociones_por_vencer: 2,
                total_uso: 1250
            };
        }
    },

    // Obtener promociones por vencer
    getPromocionesPorVencer: async (dias: number = 7): Promise<Promocion[]> => {
        try {
            const response = await simpleApi.get(`/marketing/promociones-por-vencer?dias=${dias}`);
            return response.data;
        } catch (error) {
            console.error('Error obteniendo promociones por vencer:', error);
            return [];
        }
    },

    // Obtener promociones expiradas
    getPromocionesExpiradas: async (): Promise<Promocion[]> => {
        try {
            const response = await simpleApi.get('/marketing/promociones-expiradas');
            return response.data;
        } catch (error) {
            console.error('Error obteniendo promociones expiradas:', error);
            return [];
        }
    },

    // Validar código de descuento
    validateCodigoDescuento: async (codigo: string, montoCompra?: number): Promise<ValidateCodigoResponse> => {
        try {
            const response = await simpleApi.post('/marketing/validate-codigo', {
                codigo,
                monto_compra: montoCompra
            });
            return response.data;
        } catch (error: any) {
            console.error('Error validando código de descuento:', error);
            return {
                valid: false,
                error: error.response?.data?.error || 'Error al validar el código'
            };
        }
    },

    // Usar código de descuento
    usarCodigoDescuento: async (codigo: string): Promise<void> => {
        try {
            await simpleApi.post('/marketing/usar-codigo', { codigo });
        } catch (error: any) {
            console.error('Error usando código de descuento:', error);
            throw new Error(error.response?.data?.error || 'Error al usar el código de descuento');
        }
    }
};