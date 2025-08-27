// Tipos para el sistema de ventas
export interface ProductoVenta {
    id_producto: number
    descripcion: string
    precio_venta: number
    stock: number
    variantes: VarianteVenta[]
    imagenes?: string[]
}

export interface VarianteVenta {
    id_variante: number
    id_color: number
    id_talla: number
    stock: number
    precio_venta: number
    color: {
        id_color: number
        nombre: string
    }
    talla: {
        id_talla: number
        nombre: string
        id_tipo_talle: number
    }
}

export interface ItemCarrito {
    id_producto: number
    id_variante: number
    descripcion: string
    color: string
    talla: string
    precio_unitario: number
    cantidad: number
    subtotal: number
    stock_disponible: number
}

export interface VentaData {
    id_cliente?: number
    items: Omit<ItemCarrito, 'stock_disponible'>[]
    total: number
    fecha_venta: string
    estado: 'PENDIENTE' | 'COMPLETADA' | 'CANCELADA'
    metodo_pago: 'EFECTIVO' | 'TARJETA' | 'TRANSFERENCIA'
}

export interface VentaResponse {
    id_venta: number
    total: number
    fecha_venta: string
    estado: string
    items: any[]
}
