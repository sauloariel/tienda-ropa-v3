// Tipos que coinciden con la estructura real de la base de datos
export interface Producto {
    id_producto: number;
    descripcion: string;
    id_proveedor: number;
    id_categoria: number;
    stock: number;
    precio_venta: number;
    precio_compra: number;
    stock_seguridad: number;
    estado: string;
    categoria?: Categoria;
    imagenes?: Imagen[];
    variantes?: ProductoVariante[];
}

export interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
    descripcion: string;
    estado?: string;
}

export interface Imagen {
    id_imagen: number;
    url: string;
    descripcion?: string;
}

export interface ProductoVariante {
    id_variante: number;
    id_producto: number;
    color?: string;
    talle?: string;
    stock_variante: number;
}

// Tipos para la respuesta de la API
export interface ApiResponse<T> {
    data: T;
    message?: string;
    error?: string;
}
