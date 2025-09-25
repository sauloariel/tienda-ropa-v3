import axios from 'axios';
import type { Producto, Categoria } from '../types/productos.types';
import { API_CONFIG } from '../config/api';

// Configuración base de la API unificada
const api = axios.create({
    baseURL: API_CONFIG.baseURL,
    timeout: API_CONFIG.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
    }
);

// Servicios de la API
export const productosAPI = {
    // Obtener todos los productos con información de categoría e imágenes
    getAll: async (): Promise<Producto[]> => {
        const response = await api.get(API_CONFIG.endpoints.productos);
        return response.data;
    },

    // Obtener productos por categoría
    getByCategory: async (categoriaId: number): Promise<Producto[]> => {
        const response = await api.get(`${API_CONFIG.endpoints.productos}?categoria=${categoriaId}`);
        return response.data;
    },

    // Obtener un producto específico
    getById: async (id: number): Promise<Producto> => {
        const response = await api.get(`${API_CONFIG.endpoints.productos}/${id}`);
        return response.data;
    },

    // Buscar productos
    search: async (query: string): Promise<Producto[]> => {
        const response = await api.get(`${API_CONFIG.endpoints.productos}?buscar=${encodeURIComponent(query)}`);
        return response.data;
    },
};

export const categoriasAPI = {
    // Obtener todas las categorías
    getAll: async (): Promise<Categoria[]> => {
        const response = await api.get(API_CONFIG.endpoints.categorias);
        return response.data;
    },

    // Obtener categoría por ID
    getById: async (id: number): Promise<Categoria> => {
        const response = await api.get(`${API_CONFIG.endpoints.categorias}/${id}`);
        return response.data;
    },
};

// Servicios para pedidos
export const pedidosAPI = {
    // Crear un nuevo pedido
    create: async (pedidoData: any) => {
        const response = await api.post('/pedidos', pedidoData);
        return response.data;
    },

    // Obtener pedido por número
    getByNumber: async (numeroPedido: string) => {
        const response = await api.get(`/pedidos/seguimiento/${numeroPedido}`);
        return response.data;
    },

    // Obtener pedido por teléfono
    getByPhone: async (telefono: string) => {
        const response = await api.get(`/pedidos/seguimiento/telefono/${telefono}`);
        return response.data;
    },

    // Obtener pedido por email
    getByEmail: async (email: string) => {
        const response = await api.get(`/pedidos/seguimiento/email/${email}`);
        return response.data;
    },

    // Obtener pedidos de un cliente específico
    getByCliente: async (clienteId: number) => {
        const response = await api.get(`/pedidos/cliente/${clienteId}`);
        return response.data;
    },

    // Obtener historial de estados
    getHistorial: async (idPedido: number) => {
        const response = await api.get(`/pedidos/${idPedido}/historial`);
        return response.data;
    }
};

// Servicio de facturas
export const facturasAPI = {
    // Obtener facturas de un cliente específico
    getByCliente: async (clienteId: number) => {
        const response = await api.get(`/facturas/cliente/${clienteId}`);
        return response.data;
    },

    // Obtener factura por ID
    getById: async (facturaId: number) => {
        const response = await api.get(`/facturas/${facturaId}`);
        return response.data;
    },

    // Obtener todas las facturas
    getAll: async () => {
        const response = await api.get('/facturas');
        return response.data;
    }
};

// Servicios para clientes
export const clientesAPI = {
    // Crear un nuevo cliente
    create: async (clienteData: any) => {
        const response = await api.post('/clientes', clienteData);
        return response.data;
    },

    // Buscar cliente por teléfono
    getByPhone: async (telefono: string) => {
        const response = await api.get(`/clientes/telefono/${telefono}`);
        return response.data;
    },

    // Buscar cliente por email
    getByEmail: async (email: string) => {
        const response = await api.get(`/clientes/email/${email}`);
        return response.data;
    }
};

export { api };
export default api;
