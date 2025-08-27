// Tipos para el módulo de Pedidos

export interface Pedido {
    id_pedido: number;
    id_cliente: number;
    id_empleados: number;
    fecha_pedido: Date;
    importe: number;
    estado: PedidoEstado;
    anulacion: boolean;
    venta_web: boolean;
    payment_id?: string;
    cliente_nombre?: string;
    cliente_mail?: string;
    items?: number;
}

export type PedidoEstado = 'Completado' | 'Procesando' | 'Pendiente' | 'Cancelado';

export interface PedidoCreate {
    id_cliente: number;
    id_empleados: number;
    payment_id?: string;
    detalle: PedidoDetalle[];
    importe?: number;
    estado?: PedidoEstado;
}

export interface PedidoUpdate {
    estado?: PedidoEstado;
    importe?: number;
    anulacion?: boolean;
    venta_web?: boolean;
}

export interface PedidoDetalle {
    id_producto: number;
    cantidad: number;
    precio_venta: number;
}

export interface PedidosFilters {
    page?: number;
    limit?: number;
    search?: string;
    estado?: PedidoEstado;
    fechaDesde?: string;
    fechaHasta?: string;
}

export interface PedidosResponse {
    success: boolean;
    data: Pedido[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PedidoResponse {
    success: boolean;
    data?: Pedido;
    message?: string;
    error?: string;
}

export interface PedidosStats {
    total_pedidos: number;
    completados: number;
    procesando: number;
    pendientes: number;
    cancelados: number;
    total_ventas: number;
}

