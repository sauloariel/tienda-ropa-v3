// Tipos para pedidos y seguimiento
export interface Pedido {
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
    items: ItemPedido[];
    historial_estados: HistorialEstado[];
}

export interface ItemPedido {
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

export interface Cliente {
    id_cliente: number;
    nombre: string;
    apellido: string;
    telefono?: string;
    email?: string;
    direccion?: string;
    fecha_registro: string;
}

export interface PedidoCreate {
    cliente_id?: number;
    cliente_nombre: string;
    cliente_telefono?: string;
    cliente_email?: string;
    direccion_entrega?: string;
    observaciones?: string;
    items: ItemPedidoCreate[];
}

export interface ItemPedidoCreate {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    color?: string;
    talla?: string;
}

export interface BusquedaSeguimiento {
    numero_pedido?: string;
    telefono_cliente?: string;
    email_cliente?: string;
}

// Estados de pedido
export const ESTADOS_PEDIDO = {
    PENDIENTE: 'PENDIENTE',
    CONFIRMADO: 'CONFIRMADO',
    EN_PREPARACION: 'EN_PREPARACION',
    LISTO: 'LISTO',
    EN_CAMINO: 'EN_CAMINO',
    ENTREGADO: 'ENTREGADO',
    CANCELADO: 'CANCELADO'
} as const;

export type EstadoPedido = typeof ESTADOS_PEDIDO[keyof typeof ESTADOS_PEDIDO];

// Colores para estados
export const COLORES_ESTADO = {
    [ESTADOS_PEDIDO.PENDIENTE]: 'bg-yellow-100 text-yellow-800',
    [ESTADOS_PEDIDO.CONFIRMADO]: 'bg-blue-100 text-blue-800',
    [ESTADOS_PEDIDO.EN_PREPARACION]: 'bg-orange-100 text-orange-800',
    [ESTADOS_PEDIDO.LISTO]: 'bg-purple-100 text-purple-800',
    [ESTADOS_PEDIDO.EN_CAMINO]: 'bg-indigo-100 text-indigo-800',
    [ESTADOS_PEDIDO.ENTREGADO]: 'bg-green-100 text-green-800',
    [ESTADOS_PEDIDO.CANCELADO]: 'bg-red-100 text-red-800'
} as const;

// Iconos para estados
export const ICONOS_ESTADO = {
    [ESTADOS_PEDIDO.PENDIENTE]: '⏳',
    [ESTADOS_PEDIDO.CONFIRMADO]: '✅',
    [ESTADOS_PEDIDO.EN_PREPARACION]: '👨‍🍳',
    [ESTADOS_PEDIDO.LISTO]: '📦',
    [ESTADOS_PEDIDO.EN_CAMINO]: '🚚',
    [ESTADOS_PEDIDO.ENTREGADO]: '🎉',
    [ESTADOS_PEDIDO.CANCELADO]: '❌'
} as const;

