import simpleApi from './simpleApi'

export interface Pedido {
    id_pedido: number
    id_cliente: number
    id_empleados: number
    fecha_pedido: string
    importe: number
    estado: string
    anulacion: boolean
    venta_web: boolean
    payment_id?: string
    direccion_entrega?: string
    horario_recepcion?: string
    descripcion_pedido?: string
    cliente?: {
        id_cliente: number
        nombre: string
        apellido: string
        mail: string
        telefono: string
        domicilio: string
        dni: string
    }
    detalle?: PedidoDetalle[]
}

export interface PedidoDetalle {
    id_detalle: number
    id_pedido: number
    id_producto: number
    cantidad: number
    precio_venta: number
    producto?: {
        id_producto: number
        nombre: string
        descripcion: string
        precio: number
        imagen_principal: string
    }
}

export interface PedidoCreate {
    id_cliente: number
    id_empleados: number
    payment_id?: string
    detalle: {
        id_producto: number
        cantidad: number
        precio_venta: number
    }[]
}

// API de pedidos usando simpleApi
export const pedidosAPI = {
    // Obtener todos los pedidos
    getAll: async () => {
        try {
            const response = await simpleApi.get('/pedidos');
            return response;
        } catch (error) {
            console.error('Error obteniendo pedidos:', error);
            throw error;
        }
    },

    // Obtener pedido por ID
    getById: async (id: number) => {
        try {
            const response = await simpleApi.get(`/pedidos/${id}`);
            return response;
        } catch (error) {
            console.error('Error obteniendo pedido:', error);
            throw error;
        }
    },

    // Crear nuevo pedido
    create: async (pedidoData: PedidoCreate) => {
        try {
            const response = await simpleApi.post('/pedidos', pedidoData);
            return response;
        } catch (error) {
            console.error('Error creando pedido:', error);
            throw error;
        }
    },

    // Anular pedido
    anular: async (id: number) => {
        try {
            const response = await simpleApi.put(`/pedidos/${id}/anular`);
            return response;
        } catch (error) {
            console.error('Error anulando pedido:', error);
            throw error;
        }
    },

    // Cambiar estado del pedido
    cambiarEstado: async (id: number, estado: string) => {
        try {
            const response = await simpleApi.put(`/pedidos/${id}/estado`, { estado });
            return response;
        } catch (error) {
            console.error('Error cambiando estado del pedido:', error);
            throw error;
        }
    }
};

export const pedidosService = {
    // Obtener todos los pedidos
    getAll: async (): Promise<Pedido[]> => {
        try {
            console.log('🔍 pedidosService.getAll() - Iniciando petición...');
            const response = await pedidosAPI.getAll();
            console.log('✅ pedidosService.getAll() - Respuesta recibida:', response);
            console.log('📊 pedidosService.getAll() - response.data:', response.data);
            console.log('🔢 pedidosService.getAll() - Tipo de response.data:', typeof response.data);
            console.log('📋 pedidosService.getAll() - Es array?', Array.isArray(response.data));

            if (Array.isArray(response.data)) {
                console.log('🎯 pedidosService.getAll() - Cantidad de pedidos:', response.data.length);
                if (response.data.length > 0) {
                    console.log('📋 pedidosService.getAll() - Primer pedido:', response.data[0]);
                }
            }

            return response.data;
        } catch (error) {
            console.error('❌ pedidosService.getAll() - Error:', error);
            throw error;
        }
    },

    // Obtener pedido por ID
    getById: async (id: number): Promise<Pedido> => {
        try {
            const response = await pedidosAPI.getById(id)
            return response.data
        } catch (error) {
            console.error('Error fetching pedido:', error)
            throw error
        }
    },

    // Crear nuevo pedido
    create: async (pedidoData: PedidoCreate): Promise<Pedido> => {
        try {
            const response = await pedidosAPI.create(pedidoData)
            return response.data
        } catch (error) {
            console.error('Error creating pedido:', error)
            throw error
        }
    },

    // Anular pedido
    anular: async (id: number): Promise<any> => {
        try {
            const response = await pedidosAPI.anular(id)
            return response.data
        } catch (error) {
            console.error('Error anulando pedido:', error)
            throw error
        }
    },

    // Cambiar estado del pedido
    cambiarEstado: async (id: number, estado: string): Promise<any> => {
        try {
            const response = await pedidosAPI.cambiarEstado(id, estado)
            return response.data
        } catch (error) {
            console.error('Error cambiando estado del pedido:', error)
            throw error
        }
    }
}
