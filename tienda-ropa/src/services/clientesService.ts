import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

// Configurar axios para el servicio de clientes
const clientesAPI = axios.create({
    baseURL: `${API_BASE_URL}/api/clientes`,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para manejar errores
clientesAPI.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('Clientes API Error:', error);
        return Promise.reject(error);
    }
);

// Servicios para gestión de clientes
export const clientesService = {
    // Crear un nuevo cliente
    crearCliente: async (clienteData: {
        nombre: string;
        apellido: string;
        mail: string;
        telefono?: string;
        direccion?: string;
    }): Promise<any> => {
        try {
            const response = await clientesAPI.post('/', clienteData);
            return response.data;
        } catch (error: any) {
            console.error('Error creando cliente:', error);
            throw new Error(error.response?.data?.error || 'Error al crear el cliente');
        }
    },

    // Buscar cliente por teléfono
    buscarPorTelefono: async (telefono: string): Promise<any> => {
        try {
            const response = await clientesAPI.get(`/telefono/${telefono}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // Cliente no encontrado
            }
            console.error('Error buscando cliente por teléfono:', error);
            throw new Error(error.response?.data?.error || 'Error al buscar el cliente');
        }
    },

    // Buscar cliente por email
    buscarPorEmail: async (email: string): Promise<any> => {
        try {
            const response = await clientesAPI.get(`/email/${email}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // Cliente no encontrado
            }
            console.error('Error buscando cliente por email:', error);
            throw new Error(error.response?.data?.error || 'Error al buscar el cliente');
        }
    },

    // Obtener cliente por ID
    obtenerPorId: async (id: number): Promise<any> => {
        try {
            const response = await clientesAPI.get(`/${id}`);
            return response.data;
        } catch (error: any) {
            if (error.response?.status === 404) {
                return null; // Cliente no encontrado
            }
            console.error('Error obteniendo cliente por ID:', error);
            throw new Error(error.response?.data?.error || 'Error al obtener el cliente');
        }
    },

    // Actualizar cliente
    actualizarCliente: async (id: number, clienteData: any): Promise<any> => {
        try {
            const response = await clientesAPI.put(`/${id}`, clienteData);
            return response.data;
        } catch (error: any) {
            console.error('Error actualizando cliente:', error);
            throw new Error(error.response?.data?.error || 'Error al actualizar el cliente');
        }
    },

    // Obtener historial de compras del cliente
    obtenerHistorialCompras: async (clienteId: number): Promise<any[]> => {
        try {
            const response = await clientesAPI.get(`/${clienteId}/compras`);
            return response.data;
        } catch (error: any) {
            console.error('Error obteniendo historial de compras:', error);
            return [];
        }
    },

    // Buscar clientes por nombre o apellido
    buscarClientes: async (query: string): Promise<any[]> => {
        try {
            const response = await clientesAPI.get(`/buscar?q=${encodeURIComponent(query)}`);
            return response.data;
        } catch (error: any) {
            console.error('Error buscando clientes:', error);
            return [];
        }
    },

    // Obtener todos los clientes
    obtenerTodos: async (): Promise<any[]> => {
        try {
            const response = await clientesAPI.get('/');
            return response.data;
        } catch (error: any) {
            console.error('Error obteniendo todos los clientes:', error);
            return [];
        }
    }
};

export default clientesService;
