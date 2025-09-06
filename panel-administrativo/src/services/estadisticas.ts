import { api } from './http'

// Tipos para las estadísticas
export interface EstadisticasGenerales {
    ventasTotales: number
    clientesNuevos: number
    productosVendidos: number
    pedidosCompletados: number
    cambioVentas: number
    cambioClientes: number
    cambioProductos: number
    cambioPedidos: number
}

export interface VentasPorMes {
    mes: string
    ventas: number
    pedidos: number
}

export interface ProductoTopVentas {
    id_producto: number
    descripcion: string
    ventas: number
    porcentaje: number
    stock: number
    precio_venta: number
}

export interface CategoriaTopVentas {
    id_categoria: number
    nombre_categoria: string
    ventas: number
    porcentaje: number
    productos: number
}

export interface ClienteTopCompras {
    id_cliente: number
    nombre: string
    email: string
    total_compras: number
    ultima_compra: string
}

export interface ActividadReciente {
    id: number
    accion: string
    tiempo: string
    tipo: 'order' | 'customer' | 'product' | 'sale' | 'stock'
    detalles: string
    monto?: number
}

export interface ResumenFinanciero {
    ingresos: number
    gastos: number
    ganancia: number
    margen: number
    productos_bajo_stock: number
    productos_agotados: number
}

// Servicio de estadísticas
export const estadisticasAPI = {
    // Obtener estadísticas generales del dashboard
    getEstadisticasGenerales: async (periodo: string = '30'): Promise<EstadisticasGenerales> => {
        try {
            const response = await api.get(`/estadisticas/generales?periodo=${periodo}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo estadísticas generales:', error)
            // Retornar datos de ejemplo si falla la API
            return {
                ventasTotales: 45231,
                clientesNuevos: 2350,
                productosVendidos: 1234,
                pedidosCompletados: 456,
                cambioVentas: 20.1,
                cambioClientes: 180.1,
                cambioProductos: 19.0,
                cambioPedidos: 12.0
            }
        }
    },

    // Obtener ventas por mes
    getVentasPorMes: async (meses: number = 12): Promise<VentasPorMes[]> => {
        try {
            const response = await api.get(`/estadisticas/ventas-mensuales?meses=${meses}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo ventas mensuales:', error)
            // Retornar datos de ejemplo
            return [
                { mes: 'Ene', ventas: 15000, pedidos: 45 },
                { mes: 'Feb', ventas: 18000, pedidos: 52 },
                { mes: 'Mar', ventas: 22000, pedidos: 61 },
                { mes: 'Abr', ventas: 19000, pedidos: 55 },
                { mes: 'May', ventas: 25000, pedidos: 68 },
                { mes: 'Jun', ventas: 28000, pedidos: 72 }
            ]
        }
    },

    // Obtener productos más vendidos
    getProductosTopVentas: async (limite: number = 10): Promise<ProductoTopVentas[]> => {
        try {
            const response = await api.get(`/estadisticas/productos-top?limite=${limite}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo productos top:', error)
            // Retornar datos de ejemplo
            return [
                { id_producto: 1, descripcion: 'Camiseta Azul', ventas: 45, porcentaje: 25, stock: 50, precio_venta: 25.99 },
                { id_producto: 2, descripcion: 'Pantalón Negro', ventas: 38, porcentaje: 21, stock: 30, precio_venta: 65.50 },
                { id_producto: 3, descripcion: 'Zapatillas Blancas', ventas: 32, porcentaje: 18, stock: 25, precio_venta: 120.00 },
                { id_producto: 4, descripcion: 'Gorra Roja', ventas: 28, porcentaje: 16, stock: 40, precio_venta: 15.99 }
            ]
        }
    },

    // Obtener categorías más vendidas
    getCategoriasTopVentas: async (limite: number = 5): Promise<CategoriaTopVentas[]> => {
        try {
            const response = await api.get(`/estadisticas/categorias-top?limite=${limite}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo categorías top:', error)
            // Retornar datos de ejemplo
            return [
                { id_categoria: 1, nombre_categoria: 'Ropa de Hombre', ventas: 12000, porcentaje: 35, productos: 45 },
                { id_categoria: 2, nombre_categoria: 'Ropa de Mujer', ventas: 15000, porcentaje: 42, productos: 52 },
                { id_categoria: 3, nombre_categoria: 'Calzado', ventas: 8000, porcentaje: 23, productos: 28 }
            ]
        }
    },

    // Obtener clientes con más compras
    getClientesTopCompras: async (limite: number = 10): Promise<ClienteTopCompras[]> => {
        try {
            const response = await api.get(`/estadisticas/clientes-top?limite=${limite}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo clientes top:', error)
            // Retornar datos de ejemplo
            return [
                { id_cliente: 1, nombre: 'Juan Pérez', email: 'juan@email.com', total_compras: 1250, ultima_compra: '2024-01-15' },
                { id_cliente: 2, nombre: 'María García', email: 'maria@email.com', total_compras: 980, ultima_compra: '2024-01-14' },
                { id_cliente: 3, nombre: 'Carlos López', email: 'carlos@email.com', total_compras: 750, ultima_compra: '2024-01-13' }
            ]
        }
    },

    // Obtener actividad reciente
    getActividadReciente: async (limite: number = 20): Promise<ActividadReciente[]> => {
        try {
            const response = await api.get(`/estadisticas/actividad-reciente?limite=${limite}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo actividad reciente:', error)
            // Retornar datos de ejemplo
            return [
                { id: 1, accion: 'Nuevo pedido #1234', tiempo: 'Hace 2 minutos', tipo: 'order', detalles: 'Cliente: Juan Pérez', monto: 150 },
                { id: 2, accion: 'Cliente registrado', tiempo: 'Hace 15 minutos', tipo: 'customer', detalles: 'María García' },
                { id: 3, accion: 'Producto agregado', tiempo: 'Hace 1 hora', tipo: 'product', detalles: 'Camiseta Azul' },
                { id: 4, accion: 'Venta completada', tiempo: 'Hace 2 horas', tipo: 'sale', detalles: 'Pedido #1233', monto: 89.99 }
            ]
        }
    },

    // Obtener resumen financiero
    getResumenFinanciero: async (periodo: string = '30'): Promise<ResumenFinanciero> => {
        try {
            const response = await api.get(`/estadisticas/resumen-financiero?periodo=${periodo}`)
            return response.data
        } catch (error) {
            console.error('Error obteniendo resumen financiero:', error)
            // Retornar datos de ejemplo
            return {
                ingresos: 45231,
                gastos: 28000,
                ganancia: 17231,
                margen: 38.1,
                productos_bajo_stock: 12,
                productos_agotados: 3
            }
        }
    },

    // Obtener estadísticas de inventario
    getEstadisticasInventario: async () => {
        try {
            const response = await api.get('/estadisticas/inventario')
            return response.data
        } catch (error) {
            console.error('Error obteniendo estadísticas de inventario:', error)
            return {
                total_productos: 150,
                productos_bajo_stock: 12,
                productos_agotados: 3,
                valor_inventario: 45000,
                rotacion_promedio: 2.5
            }
        }
    }
}
