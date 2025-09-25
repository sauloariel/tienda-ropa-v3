import { api } from './api';
import { API_CONFIG } from '../config/api';

// Interfaz para compra integrada
export interface CompraIntegradaRequest {
    cliente_id: number;
    cliente_nombre: string;
    cliente_telefono: string;
    cliente_email?: string;
    direccion_entrega?: string;
    observaciones?: string;
    metodo_pago: string;
    items: {
        id_producto: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        color?: string;
        talla?: string;
    }[];
}

export interface CompraIntegradaResponse {
    success: boolean;
    message: string;
    data: {
        venta: any;
        factura: any;
        pedido: any;
        resumen: {
            total: number;
            numero_factura: string;
            id_venta: number;
            id_pedido: number;
            payment_id: string;
        };
    };
}

// Servicio para compra integrada
export const compraIntegradaService = {
    // Procesar compra completa (venta + factura + pedido)
    procesarCompra: async (compraData: CompraIntegradaRequest): Promise<CompraIntegradaResponse> => {
        try {
            console.log('🛒 CompraIntegradaService.procesarCompra - Enviando compra:', compraData);

            const response = await api.post('/compra-integrada/procesar', compraData);

            console.log('✅ CompraIntegradaService.procesarCompra - Respuesta:', response.data);

            return response.data;
        } catch (error: any) {
            console.error('❌ CompraIntegradaService.procesarCompra - Error:', error);
            throw new Error(error.response?.data?.message || 'Error al procesar la compra');
        }
    },

    // Obtener compras del cliente
    obtenerComprasCliente: async (clienteId: number) => {
        try {
            console.log('🔍 CompraIntegradaService.obtenerComprasCliente - Cliente ID:', clienteId);

            const response = await api.get(`/compra-integrada/cliente/${clienteId}`);

            console.log('✅ CompraIntegradaService.obtenerComprasCliente - Respuesta:', response.data);

            return response.data;
        } catch (error: any) {
            console.error('❌ CompraIntegradaService.obtenerComprasCliente - Error:', error);
            throw new Error(error.response?.data?.message || 'Error al obtener las compras del cliente');
        }
    }
};

export default compraIntegradaService;

