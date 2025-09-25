import simpleApi from './simpleApi';

export interface Categoria {
    id_categoria: number;
    nombre_categoria: string;
    descripcion: string;
    estado?: string;
}

export interface CategoriaCreate {
    nombre_categoria: string;
    descripcion: string;
    estado?: string;
}

export interface CategoriaUpdate {
    nombre_categoria?: string;
    descripcion?: string;
    estado?: string;
}

export const categoriasAPI = {
    // Obtener todas las categorías
    getAll: async () => {
        try {
            const response = await simpleApi.get('/categorias');
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, using offline data:', error.message);
            const categoriasOffline = getCategoriasFromStorage();
            return {
                data: categoriasOffline,
                status: 200,
                statusText: 'OK (Offline Mode)',
                offline: true
            };
        }
    },

    // Obtener categoría por ID
    getById: async (id: number) => {
        try {
            const response = await api.get(`/categorias/${id}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, searching offline data...');
            const categoriasOffline = getCategoriasFromStorage();
            const categoria = categoriasOffline.find(cat => cat.id_categoria === id);

            if (categoria) {
                return {
                    data: categoria,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Categoría no encontrada');
            }
        }
    },

    // Crear nueva categoría
    create: async (data: CategoriaCreate) => {
        try {
            const response = await simpleApi.post('/categorias', data);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, saving categoria offline:', error.message);

            // Crear categoría offline
            const nuevaCategoria: Categoria = {
                ...data,
                id_categoria: generateOfflineId(),
                estado: data.estado || 'ACTIVO'
            };

            // Guardar en localStorage
            const categoriasOffline = getCategoriasFromStorage();
            categoriasOffline.push(nuevaCategoria);
            saveCategoriasToStorage(categoriasOffline);

            return {
                data: nuevaCategoria,
                status: 201,
                statusText: 'Created (Offline Mode)',
                offline: true
            };
        }
    },

    // Actualizar categoría
    update: async (id: number, data: CategoriaUpdate) => {
        try {
            const response = await simpleApi.put(`/categorias/${id}`, data);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, updating offline data...');

            const categoriasOffline = getCategoriasFromStorage();
            const index = categoriasOffline.findIndex(cat => cat.id_categoria === id);

            if (index !== -1) {
                categoriasOffline[index] = { ...categoriasOffline[index], ...data };
                saveCategoriasToStorage(categoriasOffline);

                return {
                    data: categoriasOffline[index],
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Categoría no encontrada');
            }
        }
    },

    // Eliminar categoría
    delete: async (id: number) => {
        try {
            const response = await simpleApi.delete(`/categorias/${id}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, deleting offline data...');

            const categoriasOffline = getCategoriasFromStorage();
            const filteredCategorias = categoriasOffline.filter(cat => cat.id_categoria !== id);
            saveCategoriasToStorage(filteredCategorias);

            return {
                data: null,
                status: 204,
                statusText: 'No Content (Offline Mode)',
                offline: true
            };
        }
    }
};

// Funciones de almacenamiento offline
const getCategoriasFromStorage = (): Categoria[] => {
    try {
        const stored = localStorage.getItem('categorias');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading categorias from localStorage:', error);
        return [];
    }
};

const saveCategoriasToStorage = (categorias: Categoria[]) => {
    try {
        localStorage.setItem('categorias', JSON.stringify(categorias));
    } catch (error) {
        console.error('Error saving categorias to localStorage:', error);
    }
};

const generateOfflineId = (): number => {
    const categorias = getCategoriasFromStorage();
    const maxId = categorias.reduce((max, cat) => Math.max(max, cat.id_categoria), 0);
    return maxId + 1;
};

