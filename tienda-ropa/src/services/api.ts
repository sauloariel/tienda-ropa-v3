import axios from 'axios';
import type { Producto, Categoria } from '../types/productos.types';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:4000/api'; // Puerto del backend con prefijo /api

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
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
        const response = await api.get('/productos');
        return response.data;
    },

    // Obtener productos por categoría
    getByCategory: async (categoriaId: number): Promise<Producto[]> => {
        const response = await api.get(`/productos?categoria=${categoriaId}`);
        return response.data;
    },

    // Obtener un producto específico
    getById: async (id: number): Promise<Producto> => {
        const response = await api.get(`/productos/${id}`);
        return response.data;
    },

    // Buscar productos
    search: async (query: string): Promise<Producto[]> => {
        const response = await api.get(`/productos?buscar=${encodeURIComponent(query)}`);
        return response.data;
    },
};

export const categoriasAPI = {
    // Obtener todas las categorías
    getAll: async (): Promise<Categoria[]> => {
        const response = await api.get('/categorias');
        return response.data;
    },

    // Obtener categoría por ID
    getById: async (id: number): Promise<Categoria> => {
        const response = await api.get(`/categorias/${id}`);
        return response.data;
    },
};

export default api;
