import simpleApi from './simpleApi';

export interface SeguimientoPedido {
    id_pedido: number;
    numero_pedido: string;
    fecha_pedido: string;
    estado: string;
    total: number;
    cliente_nombre: string;
    cliente_telefono?: string;
    cliente_email?: string;
    direccion_entrega?: string;
    observaciones?: string;
    items: ItemSeguimiento[];
    historial_estados: HistorialEstado[];
}

export interface ItemSeguimiento {
    id_detalle: number;
    producto_descripcion: string;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    color?: string;
    talla?: string;
}

export interface HistorialEstado {
    id_historial: number;
    estado: string;
    fecha_cambio: string;
    observaciones?: string;
    usuario?: string;
}

export interface BusquedaSeguimiento {
    numero_pedido?: string;
    telefono_cliente?: string;
    email_cliente?: string;
}

export const seguimientoAPI = {
    // Buscar pedido por número
    buscarPorNumero: async (numeroPedido: string) => {
        try {
            const response = await simpleApi.get(`/pedidos/seguimiento/${numeroPedido}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, using offline data:', error.message);
            const pedidosOffline = getPedidosFromStorage();
            const pedido = pedidosOffline.find(p => p.numero_pedido === numeroPedido);

            if (pedido) {
                return {
                    data: pedido,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Pedido no encontrado');
            }
        }
    },

    // Buscar pedido por teléfono
    buscarPorTelefono: async (telefono: string) => {
        try {
            const response = await api.get(`/pedidos/seguimiento/telefono/${telefono}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, using offline data:', error.message);
            const pedidosOffline = getPedidosFromStorage();
            const pedido = pedidosOffline.find(p => p.cliente_telefono === telefono);

            if (pedido) {
                return {
                    data: pedido,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('No se encontraron pedidos para este teléfono');
            }
        }
    },

    // Buscar pedido por email
    buscarPorEmail: async (email: string) => {
        try {
            const response = await api.get(`/pedidos/seguimiento/email/${email}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, using offline data:', error.message);
            const pedidosOffline = getPedidosFromStorage();
            const pedido = pedidosOffline.find(p => p.cliente_email === email);

            if (pedido) {
                return {
                    data: pedido,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('No se encontraron pedidos para este email');
            }
        }
    },

    // Obtener historial de estados de un pedido
    obtenerHistorial: async (idPedido: number) => {
        try {
            const response = await api.get(`/pedidos/${idPedido}/historial`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, using offline data:', error.message);
            const pedidosOffline = getPedidosFromStorage();
            const pedido = pedidosOffline.find(p => p.id_pedido === idPedido);

            if (pedido) {
                return {
                    data: pedido.historial_estados || [],
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Pedido no encontrado');
            }
        }
    }
};

// Funciones de almacenamiento offline
const getPedidosFromStorage = (): SeguimientoPedido[] => {
    try {
        const stored = localStorage.getItem('pedidos_seguimiento');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading pedidos from localStorage:', error);
        return [];
    }
};

const savePedidosToStorage = (pedidos: SeguimientoPedido[]) => {
    try {
        localStorage.setItem('pedidos_seguimiento', JSON.stringify(pedidos));
    } catch (error) {
        console.error('Error saving pedidos to localStorage:', error);
    }
};

