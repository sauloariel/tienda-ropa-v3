import { api } from './api'

export interface Producto {
    id_producto: number
    descripcion: string
    id_proveedor: number
    id_categoria: number
    stock: number
    precio_venta: number
    precio_compra: number
    stock_seguridad: number
    estado: string
    proveedor?: Proveedor
    categoria?: Categoria
    variantes?: ProductoVariante[]
    imagenes?: Imagen[]
}

export interface Categoria {
    id_categoria: number
    nombre_categoria: string
    descripcion: string
    estado?: string
}

export interface Proveedor {
    id_proveedor: number
    nombre: string
    contacto: string
    direccion: string
    telefono: string
}

export interface Color {
    id_color: number
    nombre: string
}

export interface TipoTalle {
    id_tipo_talle: number
    nombre: string
}

export interface Talla {
    id_talla: number
    nombre: string
    id_tipo_talle: number
    tipoTalle?: TipoTalle
}

export interface ProductoVariante {
    id_variante: number
    id_producto: number
    id_talle: number
    id_color: number
    stock: number
    precio_venta: number
    color?: Color
    talla?: Talla
}

export interface Imagen {
    id_imagen: number
    id_productos: number
    nombre_archivo?: string
    ruta?: string
    descripcion?: string
    imagen_bin?: any
}

export interface ProductoCreate {
    descripcion: string
    id_proveedor: number
    id_categoria: number
    stock: number
    precio_venta: number
    precio_compra: number
    stock_seguridad: number
    estado?: string
    variantes?: ProductoVarianteCreate[]
    imagenes?: ImagenCreate[]
}

export interface ProductoVarianteCreate {
    id_talle: number
    id_color: number
    stock: number
    precio_venta?: number
}

export interface ImagenCreate {
    nombre_archivo?: string
    ruta?: string
    descripcion?: string
    imagen_bin?: any // Cambiado de Buffer a any para evitar problemas de tipos
}

export interface ProductoUpdate {
    descripcion?: string
    id_proveedor?: number
    id_categoria?: number
    stock?: number
    precio_venta?: number
    precio_compra?: number
    stock_seguridad?: number
    estado?: string
    variantes?: ProductoVarianteCreate[]
    imagenes?: ImagenCreate[]
}

export const productosAPI = {
    // Obtener todos los productos con relaciones
    getProductos: async (): Promise<Producto[]> => {
        try {
            const response = await api.get('/productos')
            return response.data
        } catch (error) {
            console.error('Error obteniendo productos:', error)
            return []
        }
    },

    // Obtener producto por ID
    getProductoById: async (id: number): Promise<Producto | null> => {
        try {
            const response = await api.get(`/productos/${id}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo producto:', error)
            return null
        }
    },

    // Crear nuevo producto
    createProducto: async (producto: ProductoCreate): Promise<Producto | null> => {
        try {
            const response = await api.post('/productos', producto)
            return response.data
        } catch (error) {
            console.error('Error creando producto:', error)
            throw error
        }
    },

    // Actualizar producto
    updateProducto: async (id: number, producto: ProductoUpdate): Promise<Producto | null> => {
        try {
            const response = await api.put(`/productos/${id}`, producto)
            return response.data
        } catch (error) {
            console.error('Error actualizando producto:', error)
            throw error
        }
    },

    // Eliminar producto
    deleteProducto: async (id: number): Promise<boolean> => {
        try {
            await api.delete(`/productos/${id}`)
            return true
        } catch (error) {
            console.error('Error eliminando producto:', error)
            throw error
        }
    },

    // Obtener categorías
    getCategorias: async (): Promise<Categoria[]> => {
        try {
            const response = await api.get('/categorias')
            return response.data
        } catch (error) {
            console.error('Error obteniendo categorías:', error)
            return []
        }
    },

    // Obtener proveedores
    getProveedores: async (): Promise<Proveedor[]> => {
        try {
            const response = await api.get('/proveedores')
            return response.data
        } catch (error) {
            console.error('Error obteniendo proveedores:', error)
            return []
        }
    },

    // Obtener colores
    getColores: async (): Promise<Color[]> => {
        try {
            const response = await api.get('/colores')
            return response.data
        } catch (error) {
            console.error('Error obteniendo colores:', error)
            return []
        }
    },

    // Obtener tipos de talla
    getTiposTalle: async (): Promise<TipoTalle[]> => {
        try {
            const response = await api.get('/tipo-talle')
            return response.data
        } catch (error) {
            console.error('Error obteniendo tipos de talla:', error)
            return []
        }
    },

    // Obtener tallas
    getTallas: async (): Promise<Talla[]> => {
        try {
            const response = await api.get('/tallas')
            return response.data
        } catch (error) {
            console.error('Error obteniendo tallas:', error)
            return []
        }
    },

    // Obtener tallas por tipo
    getTallasPorTipo: async (idTipoTalle: number): Promise<Talla[]> => {
        try {
            const tallas = await productosAPI.getTallas()
            return tallas.filter(talla => talla.id_tipo_talle === idTipoTalle)
        } catch (error) {
            console.error('Error obteniendo tallas por tipo:', error)
            return []
        }
    },

    // Obtener imágenes
    getImagenes: async (): Promise<Imagen[]> => {
        try {
            const response = await api.get('/imagenes')
            return response.data
        } catch (error) {
            console.error('Error obteniendo imágenes:', error)
            return []
        }
    }
}
