// Tipos para el módulo de marketing

export interface PromocionResponse {
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

export interface CreatePromocionRequest {
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

export interface UpdatePromocionRequest extends Partial<CreatePromocionRequest> { }

export interface MarketingStatsResponse {
    total_promociones: number;
    promociones_activas: number;
    promociones_inactivas: number;
    promociones_expiradas: number;
    promociones_por_vencer: number;
    total_uso: number;
}

export interface ValidateCodigoRequest {
    codigo: string;
    monto_compra?: number;
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

export interface UsarCodigoRequest {
    codigo: string;
}

export interface UsarCodigoResponse {
    message: string;
}

// Tipos para filtros
export type EstadoFiltro = 'TODOS' | 'ACTIVA' | 'INACTIVA' | 'EXPIRADA';
export type TipoFiltro = 'TODOS' | 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL';

// Tipos para formularios
export interface PromocionFormData {
    nombre: string;
    descripcion: string;
    tipo: 'PORCENTAJE' | 'MONTO_FIJO' | '2X1' | 'DESCUENTO_ESPECIAL';
    valor: string;
    codigo_descuento: string;
    fecha_inicio: string;
    fecha_fin: string;
    minimo_compra: string;
    uso_maximo: string;
    estado: 'ACTIVA' | 'INACTIVA' | 'EXPIRADA';
}

// Tipos para analytics
export interface PromocionAnalytics {
    id_promocion: number;
    nombre: string;
    uso_actual: number;
    uso_maximo?: number;
    porcentaje_uso: number;
    conversion_rate?: number;
    revenue_generated?: number;
}

export interface MarketingAnalytics {
    promociones_mas_usadas: PromocionAnalytics[];
    promociones_por_tipo: {
        tipo: string;
        cantidad: number;
        uso_total: number;
    }[];
    tendencia_uso: {
        fecha: string;
        uso: number;
    }[];
    revenue_por_promocion: {
        id_promocion: number;
        nombre: string;
        revenue: number;
    }[];
}

// Tipos para campañas (futuro)
export interface Campana {
    id_campana: number;
    nombre: string;
    descripcion?: string;
    tipo: 'EMAIL' | 'SMS' | 'PUSH' | 'SOCIAL' | 'DISPLAY';
    estado: 'BORRADOR' | 'PROGRAMADA' | 'ACTIVA' | 'PAUSADA' | 'COMPLETADA';
    fecha_inicio: string;
    fecha_fin?: string;
    audiencia: string;
    mensaje: string;
    promociones_asociadas: number[];
    metricas: {
        enviados: number;
        entregados: number;
        abiertos: number;
        clicks: number;
        conversiones: number;
    };
    createdAt: string;
    updatedAt: string;
}

// Tipos para segmentación de audiencia
export interface Audiencia {
    id_audiencia: number;
    nombre: string;
    descripcion?: string;
    criterios: {
        tipo: 'EDAD' | 'GENERO' | 'UBICACION' | 'COMPRAS_PREVIAS' | 'VALOR_COMPRA' | 'FRECUENCIA';
        operador: 'IGUAL' | 'MAYOR' | 'MENOR' | 'ENTRE' | 'CONTIENE';
        valor: string | number | [number, number];
    }[];
    tamaño_estimado: number;
    createdAt: string;
    updatedAt: string;
}