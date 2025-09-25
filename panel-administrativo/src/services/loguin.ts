import simpleApi from './simpleApi';

export interface LoguinUser {
    id_loguin: number;
    usuario: string;
    id_empleado: number;
    id_rol: number;
    password_provisoria: boolean;
    fecha_cambio_pass: string;
    empleado_nombre: string;
    rol_descripcion: string;
    empleado_estado: string;
}

export interface LoguinCreate {
    usuario: string;
    password: string;
    id_empleado: number;
    id_rol: number;
}

export interface LoguinUpdate {
    usuario?: string;
    password?: string;
    id_rol?: number;
}

// API functions for loguin users
export const loguinAPI = {
    // Get all loguin users
    getAll: async () => {
        try {
            console.log('Attempting to fetch loguin users from backend...');
            const response = await simpleApi.get('/loguin');
            console.log('Backend loguin users response:', response);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, using offline data:', error.message);
            const loguinUsersOffline = getLoguinUsersFromStorage();
            return {
                data: loguinUsersOffline,
                status: 200,
                statusText: 'OK (Offline Mode)',
                offline: true
            };
        }
    },

    // Get loguin user by ID
    getById: async (id: number) => {
        try {
            const response = await api.get(`/loguin/${id}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, searching offline data...');
            const loguinUsersOffline = getLoguinUsersFromStorage();
            const loguinUser = loguinUsersOffline.find(user => user.id_loguin === id);

            if (loguinUser) {
                return {
                    data: loguinUser,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Usuario de login no encontrado');
            }
        }
    },

    // Get loguin user by empleado ID
    getByEmpleado: async (id_empleado: number) => {
        try {
            const response = await api.get(`/loguin/empleado/${id_empleado}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, searching offline data...');
            const loguinUsersOffline = getLoguinUsersFromStorage();
            const loguinUser = loguinUsersOffline.find(user => user.id_empleado === id_empleado);

            if (loguinUser) {
                return {
                    data: loguinUser,
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Usuario de login no encontrado para este empleado');
            }
        }
    },

    // Create loguin user
    create: async (data: LoguinCreate) => {
        try {
            console.log('Attempting to create loguin user in backend...');
            const response = await simpleApi.post('/loguin', data);
            console.log('Backend create response:', response);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, saving loguin user offline:', error.message);

            // Create offline loguin user
            const nuevoLoguinUser: LoguinUser = {
                ...data,
                id_loguin: generateOfflineId(),
                password_provisoria: true,
                fecha_cambio_pass: new Date().toISOString(),
                empleado_nombre: 'Empleado Offline',
                rol_descripcion: 'Rol Offline',
                empleado_estado: 'ACTIVO'
            };

            // Save to local storage
            const loguinUsersOffline = getLoguinUsersFromStorage();
            loguinUsersOffline.push(nuevoLoguinUser);
            saveLoguinUsersToStorage(loguinUsersOffline);

            console.log('Loguin user saved offline:', nuevoLoguinUser);

            return {
                data: nuevoLoguinUser,
                status: 201,
                statusText: 'Created (Offline Mode)',
                offline: true
            };
        }
    },

    // Update loguin user
    update: async (id: number, data: LoguinUpdate) => {
        try {
            const response = await simpleApi.put(`/loguin/${id}`, data);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, updating offline data...');

            const loguinUsersOffline = getLoguinUsersFromStorage();
            const index = loguinUsersOffline.findIndex(user => user.id_loguin === id);

            if (index !== -1) {
                loguinUsersOffline[index] = { ...loguinUsersOffline[index], ...data };
                saveLoguinUsersToStorage(loguinUsersOffline);

                return {
                    data: loguinUsersOffline[index],
                    status: 200,
                    statusText: 'OK (Offline Mode)',
                    offline: true
                };
            } else {
                throw new Error('Usuario de login no encontrado');
            }
        }
    },

    // Delete loguin user
    delete: async (id: number) => {
        try {
            const response = await simpleApi.delete(`/loguin/${id}`);
            return response;
        } catch (error: any) {
            console.log('Backend unavailable, deleting offline data...');

            const loguinUsersOffline = getLoguinUsersFromStorage();
            const filteredUsers = loguinUsersOffline.filter(user => user.id_loguin !== id);
            saveLoguinUsersToStorage(filteredUsers);

            return {
                data: null,
                status: 204,
                statusText: 'No Content (Offline Mode)',
                offline: true
            };
        }
    }
};

// Offline storage functions
const getLoguinUsersFromStorage = (): LoguinUser[] => {
    try {
        const stored = localStorage.getItem('loguin_users');
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading loguin users from localStorage:', error);
        return [];
    }
};

const saveLoguinUsersToStorage = (users: LoguinUser[]) => {
    try {
        localStorage.setItem('loguin_users', JSON.stringify(users));
    } catch (error) {
        console.error('Error saving loguin users to localStorage:', error);
    }
};

const generateOfflineId = (): number => {
    const users = getLoguinUsersFromStorage();
    const maxId = users.reduce((max, user) => Math.max(max, user.id_loguin), 0);
    return maxId + 1;
};
