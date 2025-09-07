import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

// Configurar axios para el servicio de stock
const stockAPI = axios.create({
    baseURL: `${API_BASE_URL}/productos`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores
stockAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Stock API Error:', error);
        return Promise.reject(error);
    }
);

// Servicios para gestión de stock
export const stockService = {
    // Verificar stock disponible
    verificarStock: async (productoId: number, cantidadRequerida: number): Promise<boolean> => {
        try {
            const response = await stockAPI.get(`/${productoId}`);
            const producto = response.data;
            return producto.stock >= cantidadRequerida;
        } catch (error) {
            console.error('Error verificando stock:', error);
            return false;
        }
    },

    // Obtener stock actual de un producto
    obtenerStock: async (productoId: number): Promise<number> => {
        try {
            const response = await stockAPI.get(`/${productoId}`);
            const producto = response.data;
            return producto.stock || 0;
        } catch (error) {
            console.error('Error obteniendo stock:', error);
            return 0;
        }
    },

    // Actualizar stock después de una venta
    actualizarStock: async (productoId: number, cantidadVendida: number): Promise<boolean> => {
        try {
            const response = await stockAPI.put(`/${productoId}/stock`, {
                cantidad_vendida: cantidadVendida
            });
            return response.status === 200;
        } catch (error) {
            console.error('Error actualizando stock:', error);
            return false;
        }
    },

    // Obtener productos con stock bajo
    obtenerProductosStockBajo: async (limiteStock: number = 10): Promise<any[]> => {
        try {
            const response = await stockAPI.get('/');
            const productos = response.data;
            return productos.filter((producto: any) => producto.stock <= limiteStock);
        } catch (error) {
            console.error('Error obteniendo productos con stock bajo:', error);
            return [];
        }
    },

    // Obtener productos sin stock
    obtenerProductosSinStock: async (): Promise<any[]> => {
        try {
            const response = await stockAPI.get('/');
            const productos = response.data;
            return productos.filter((producto: any) => producto.stock === 0);
        } catch (error) {
            console.error('Error obteniendo productos sin stock:', error);
            return [];
        }
    },

    // Validar stock para múltiples productos
    validarStockMultiple: async (items: Array<{ id_producto: number, cantidad: number }>): Promise<{
        valido: boolean;
        productosSinStock: Array<{ id_producto: number, cantidadRequerida: number, stockDisponible: number }>;
    }> => {
        try {
            const productosSinStock = [];
            let valido = true;

            for (const item of items) {
                const stockDisponible = await stockService.obtenerStock(item.id_producto);
                if (stockDisponible < item.cantidad) {
                    valido = false;
                    productosSinStock.push({
                        id_producto: item.id_producto,
                        cantidadRequerida: item.cantidad,
                        stockDisponible: stockDisponible
                    });
                }
            }

            return {
                valido,
                productosSinStock
            };
        } catch (error) {
            console.error('Error validando stock múltiple:', error);
            return {
                valido: false,
                productosSinStock: []
            };
        }
    }
};

export default stockService;
