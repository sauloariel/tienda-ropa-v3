// Tipos para el sistema de facturación

export interface DetalleFactura {
    id?: number;
    factura_id?: number;
    producto_id: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto?: {
        id: number;
        nombre: string;
        descripcion?: string;
        imagen?: string;
    };
}

export interface Factura {
    id?: number;
    numeroFactura: string; // Siempre viene del backend
    fecha: Date;
    total: number;
    cliente_id?: number;
    estado: 'activa' | 'anulada' | 'borrador';
    metodo_pago: string;
    detalles: DetalleFactura[];
    cliente?: {
        id: number;
        nombre: string;
        email?: string;
        telefono?: string;
    };
}

export interface FacturaRequest {
    productos: Array<{
        id_producto: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
    }>;
    total: number;
    metodo_pago: string;
    cliente_id?: number;
    // NO incluir numeroFactura - se asigna en el backend
}

export interface FacturaResponse {
    success: boolean;
    message: string;
    factura: Factura;
}

export interface FacturaListResponse {
    success: boolean;
    facturas: Factura[];
}

export interface FacturaStatsResponse {
    success: boolean;
    estadisticas: {
        total_facturas: number;
        total_ingresos: number;
        promedio_factura: number;
        metodos_pago: Array<{
            metodo_pago: string;
            cantidad: number;
            total: number;
        }>;
        productos_mas_facturados: Array<{
            producto_id: number;
            cantidad_facturada: number;
            total_facturado: number;
        }>;
    };
}
