import axios from 'axios'
import { config } from '../config/config'

export const api = axios.create({
    baseURL: config.api.baseURL,
    timeout: config.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Empleados API
export const empleadosAPI = {
    getAll: () => api.get('/empleados'),
    getById: (id: number) => api.get(`/empleados/${id}`),
    create: (data: any) => api.post('/empleados', data),
    update: (id: number, data: any) => api.put(`/empleados/${id}`, data),
    delete: (id: number) => api.delete(`/empleados/${id}`),
}

// Pedidos API
export const pedidosAPI = {
    getAll: () => api.get('/pedidos'),
    getById: (id: number) => api.get(`/pedidos/${id}`),
    create: (data: any) => api.post('/pedidos', data),
    anular: (id: number) => api.put(`/pedidos/anular/${id}`),
    cambiarEstado: (id: number, estado: string) => api.put(`/pedidos/${id}/estado`, { estado }),
    // Pedidos Web
    post: (endpoint: string, data: any) => api.post(endpoint, data),
    get: (endpoint: string) => api.get(endpoint),
}

// Login API
export const authAPI = {
    login: async (credentials: { usuario: string; passwd: string }) => {
        try {
            console.log('Sending login request to:', `${config.api.baseURL}/loguin/login`)
            console.log('Credentials:', { usuario: credentials.usuario, passwd: '***' })

            const response = await api.post('/loguin/login', credentials)
            console.log('Login API response status:', response.status)
            console.log('Login API response headers:', response.headers)

            return response
        } catch (error: any) {
            console.error('Login API error details:')
            console.error('Error message:', error.message)
            console.error('Error response:', error.response)
            console.error('Error status:', error.response?.status)
            console.error('Error data:', error.response?.data)

            // Re-throw the error to be handled by the auth context
            throw error
        }
    },
}

// Request interceptor for debugging and adding auth token
api.interceptors.request.use(
    (config) => {
        // Agregar token de autenticación si existe
        const token = localStorage.getItem('authToken');
        console.log('🔑 Token encontrado en localStorage:', token ? token.substring(0, 20) + '...' : 'No hay token');

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('✅ Token agregado al header Authorization');
        } else {
            console.log('❌ No se encontró token, request sin autenticación');
        }

        console.log('API Request:', {
            method: config.method?.toUpperCase(),
            url: config.url,
            baseURL: config.baseURL,
            headers: config.headers,
        })
        return config
    },
    (error) => {
        console.error('API Request Error:', error)
        return Promise.reject(error)
    }
)

// Response interceptor for debugging and error handling
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            statusText: response.statusText,
            url: response.config.url,
            data: response.data,
        })
        return response
    },
    (error) => {
        console.error('API Response Error:', {
            message: error.message,
            status: error.response?.status,
            statusText: error.response?.statusText,
            url: error.config?.url,
            data: error.response?.data,
        })

        // Solo redirigir al login en casos específicos de autenticación
        // No redirigir en errores de permisos o acceso a módulos
        if (error.response?.status === 401) {
            // Verificar si es un error de autenticación real
            const currentUser = localStorage.getItem('authUser')
            const currentToken = localStorage.getItem('authToken')

            console.log('🔍 Error 401 - Verificando autenticación:', {
                hasUser: !!currentUser,
                hasToken: !!currentToken,
                path: window.location.pathname
            });

            if (currentUser && currentToken) {
                try {
                    const userData = JSON.parse(currentUser)
                    // Solo redirigir si el usuario no tiene datos válidos
                    if (!userData || !userData.id || !userData.rol) {
                        console.log('❌ Invalid user data, redirecting to login...')
                        localStorage.removeItem('authUser')
                        localStorage.removeItem('authToken')
                        if (window.location.pathname !== '/login') {
                            window.location.href = '/login'
                        }
                    } else {
                        console.log('✅ User is authenticated, not redirecting to login')
                    }
                } catch (parseError) {
                    console.log('❌ Error parsing user data, redirecting to login...')
                    localStorage.removeItem('authUser')
                    localStorage.removeItem('authToken')
                    if (window.location.pathname !== '/login') {
                        window.location.href = '/login'
                    }
                }
            } else {
                console.log('❌ No user data or token found, redirecting to login...')
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login'
                }
            }
        }

        return Promise.reject(error)
    }
)
