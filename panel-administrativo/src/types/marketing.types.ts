// Tipos para el sistema de marketing y promociones
export interface Promocion {
    id_promocion: number
    nombre: string
    descripcion: string
    tipo: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL'
    valor: number // Porcentaje, monto fijo, etc.
    fecha_inicio: string
    fecha_fin: string
    estado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA'
    aplica_a: 'TODOS' | 'CATEGORIA' | 'PRODUCTO_ESPECIFICO'
    id_categoria?: number
    id_producto?: number
    codigo_descuento?: string
    uso_maximo?: number
    uso_actual: number
    minimo_compra?: number
    maximo_descuento?: number
    fecha_creacion: string
    fecha_actualizacion: string
}

export interface PromocionCreate {
    nombre: string
    descripcion: string
    tipo: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL'
    valor: number
    fecha_inicio: string
    fecha_fin: string
    aplica_a: 'TODOS' | 'CATEGORIA' | 'PRODUCTO_ESPECIFICO'
    id_categoria?: number
    id_producto?: number
    codigo_descuento?: string
    uso_maximo?: number
    minimo_compra?: number
    maximo_descuento?: number
}

export interface PromocionUpdate extends Partial<PromocionCreate> {
    estado?: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA'
}

export interface PromocionResponse {
    id_promocion: number
    nombre: string
    descripcion: string
    tipo: string
    valor: number
    fecha_inicio: string
    fecha_fin: string
    estado: string
    aplica_a: string
    id_categoria?: number
    id_producto?: number
    codigo_descuento?: string
    uso_maximo?: number
    uso_actual: number
    minimo_compra?: number
    maximo_descuento?: number
    fecha_creacion: string
    fecha_actualizacion: string
}

export interface PromocionStats {
    total_promociones: number
    promociones_activas: number
    promociones_expiradas: number
    promociones_inactivas: number
    total_uso: number
    promocion_mas_usada?: {
        nombre: string
        uso: number
    }
}
