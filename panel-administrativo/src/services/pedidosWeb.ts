import { pedidosAPI } from './pedidos'

export interface PedidoWeb {
    id_pedido_web?: string
    id_cliente: number
    fecha_pedido: string
    importe: number
    estado: string
    payment_id: string
    productos: {
        id_producto: number
        cantidad: number
        precio_venta: number
        descuento?: number
    }[]
    cliente_info?: {
        nombre: string
        apellido: string
        mail: string
        telefono: string
        domicilio: string
        dni: string
    }
}

export interface PedidoWebResponse {
    success: boolean
    message: string
    pedido?: any
    resultados?: {
        exitosos: number
        fallidos: number
        errores: string[]
    }
}

export const pedidosWebService = {
    // Crear pedido desde la web
    create: async (pedidoData: PedidoWeb): Promise<PedidoWebResponse> => {
        try {
            console.log('🌐 pedidosWebService.create() - Creando pedido web:', pedidoData);
            const response = await pedidosAPI.post('/pedidos-web', pedidoData);
            return response.data;
        } catch (error: any) {
            console.error('❌ pedidosWebService.create() - Error:', error);
            throw error;
        }
    },

    // Sincronizar múltiples pedidos desde la web
    sync: async (pedidos: PedidoWeb[]): Promise<PedidoWebResponse> => {
        try {
            console.log('🔄 pedidosWebService.sync() - Sincronizando pedidos web:', pedidos.length);
            const response = await pedidosAPI.post('/pedidos-web/sync', { pedidos });
            return response.data;
        } catch (error: any) {
            console.error('❌ pedidosWebService.sync() - Error:', error);
            throw error;
        }
    },

    // Obtener todos los pedidos web
    getAll: async (): Promise<any[]> => {
        try {
            console.log('🌐 pedidosWebService.getAll() - Obteniendo pedidos web');
            const response = await pedidosAPI.get('/pedidos-web');
            return response.data;
        } catch (error: any) {
            console.error('❌ pedidosWebService.getAll() - Error:', error);
            throw error;
        }
    }
}

export default pedidosWebService;

