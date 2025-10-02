import simpleApi from './simpleApi'

export interface Temporada {
    id_temporada: number
    nombre: string
    descripcion?: string
    estado: string
    fecha_creacion?: Date
}

export interface TemporadaCreate {
    nombre: string
    descripcion?: string
    estado?: string
}

export interface TemporadaUpdate {
    nombre?: string
    descripcion?: string
    estado?: string
}

export const temporadasAPI = {
    // Obtener todas las temporadas
    getAll: async () => {
        try {
            const response = await simpleApi.get('/temporadas')
            return response
        } catch (error: any) {
            console.log('Backend unavailable, loading temporadas offline:', error.message)

            // Cargar temporadas offline desde localStorage
            const temporadasOffline = getTemporadasFromStorage()
            return {
                data: temporadasOffline,
                status: 200,
                statusText: 'OK (Offline Mode)',
                offline: true
            }
        }
    },

    // Obtener temporada por ID
    getById: async (id: number) => {
        try {
            const response = await simpleApi.get(`/temporadas/${id}`)
            return response
        } catch (error: any) {
            console.log('Backend unavailable, loading temporada offline:', error.message)

            const temporadasOffline = getTemporadasFromStorage()
            const temporada = temporadasOffline.find(t => t.id_temporada === id)

            if (temporada) {
                return {
                    data: temporada,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                }
            } else {
                throw new Error('Temporada no encontrada')
            }
        }
    },

    // Crear nueva temporada
    create: async (data: TemporadaCreate) => {
        try {
            const response = await simpleApi.post('/temporadas', data)
            return response
        } catch (error: any) {
            console.log('Backend unavailable, saving temporada offline:', error.message)

            // Crear temporada offline
            const nuevaTemporada: Temporada = {
                ...data,
                id_temporada: generateOfflineId(),
                estado: data.estado || 'ACTIVO',
                fecha_creacion: new Date()
            }

            // Guardar en localStorage
            const temporadasOffline = getTemporadasFromStorage()
            temporadasOffline.push(nuevaTemporada)
            saveTemporadasToStorage(temporadasOffline)

            return {
                data: nuevaTemporada,
                status: 201,
                statusText: 'Created (Offline Mode)',
                offline: true
            }
        }
    },

    // Actualizar temporada
    update: async (id: number, data: TemporadaUpdate) => {
        try {
            const response = await simpleApi.put(`/temporadas/${id}`, data)
            return response
        } catch (error: any) {
            console.log('Backend unavailable, updating offline data...')

            const temporadasOffline = getTemporadasFromStorage()
            const index = temporadasOffline.findIndex(t => t.id_temporada === id)

            if (index !== -1) {
                temporadasOffline[index] = { ...temporadasOffline[index], ...data }
                saveTemporadasToStorage(temporadasOffline)

                return {
                    data: temporadasOffline[index],
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                }
            } else {
                throw new Error('Temporada no encontrada')
            }
        }
    },

    // Eliminar temporada
    delete: async (id: number) => {
        try {
            const response = await simpleApi.delete(`/temporadas/${id}`)
            return response
        } catch (error: any) {
            console.log('Backend unavailable, deleting offline data...')

            const temporadasOffline = getTemporadasFromStorage()
            const filteredTemporadas = temporadasOffline.filter(t => t.id_temporada !== id)
            saveTemporadasToStorage(filteredTemporadas)

            return {
                data: null,
                status: 204,
                statusText: 'No Content (Offline Mode)',
                offline: true
            }
        }
    }
}

// Funciones auxiliares para manejo offline
function generateOfflineId(): number {
    return Date.now() + Math.floor(Math.random() * 1000)
}

function getTemporadasFromStorage(): Temporada[] {
    try {
        const stored = localStorage.getItem('temporadas_offline')
        if (stored) {
            return JSON.parse(stored)
        }
    } catch (error) {
        console.error('Error loading temporadas from storage:', error)
    }

    // Retornar temporadas por defecto si no hay datos
    return [
        {
            id_temporada: 1,
            nombre: 'Verano',
            descripcion: 'Colección de verano con ropa fresca y cómoda',
            estado: 'ACTIVO',
            fecha_creacion: new Date()
        },
        {
            id_temporada: 2,
            nombre: 'Invierno',
            descripcion: 'Colección de invierno con abrigos y ropa de abrigo',
            estado: 'ACTIVO',
            fecha_creacion: new Date()
        },
        {
            id_temporada: 3,
            nombre: 'Otoño',
            descripcion: 'Colección de otoño con jerseys y ropa de transición',
            estado: 'ACTIVO',
            fecha_creacion: new Date()
        },
        {
            id_temporada: 4,
            nombre: 'Primavera',
            descripcion: 'Colección de primavera con ropa fresca y liviana',
            estado: 'ACTIVO',
            fecha_creacion: new Date()
        },
        {
            id_temporada: 5,
            nombre: 'Todas las temporadas',
            descripcion: 'Ropa básica que se vende durante todo el año',
            estado: 'ACTIVO',
            fecha_creacion: new Date()
        }
    ]
}

function saveTemporadasToStorage(temporadas: Temporada[]): void {
    try {
        localStorage.setItem('temporadas_offline', JSON.stringify(temporadas))
    } catch (error) {
        console.error('Error saving temporadas to storage:', error)
    }
}







