import simpleApi from './simpleApi';

export type EmpleadoCreate = {
  cuil: string;
  nombre: string;
  apellido: string;
  domicilio: string;
  telefono: string;
  mail: string;
  sueldo?: number;
  puesto?: string;
  estado?: string; // máx 8 chars
};

export type Empleado = EmpleadoCreate & {
  id_empleado: number;
  fecha_creacion?: string;
};

// Local storage key for offline employees
const EMPLEADOS_STORAGE_KEY = 'empleados_offline';

// Helper functions for local storage
const getEmpleadosFromStorage = (): Empleado[] => {
  try {
    const stored = localStorage.getItem(EMPLEADOS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error reading empleados from localStorage:', error);
    return [];
  }
};

const saveEmpleadosToStorage = (empleados: Empleado[]): void => {
  try {
    localStorage.setItem(EMPLEADOS_STORAGE_KEY, JSON.stringify(empleados));
  } catch (error) {
    console.error('Error saving empleados to localStorage:', error);
  }
};

// Generate unique ID for offline employees
const generateOfflineId = (): number => {
  const empleados = getEmpleadosFromStorage();
  const maxId = empleados.reduce((max, emp) => Math.max(max, emp.id_empleado), 0);
  return maxId + 1;
};

// Main API functions with offline fallback
export const empleadosAPI = {
  // Get all employees - try backend first, fallback to local storage
  getAll: async () => {
    try {
      console.log('Attempting to fetch empleados from backend...');
      const response = await simpleApi.get('/empleados');
      console.log('Backend empleados response:', response);
      return response;
    } catch (error: any) {
      console.log('Backend unavailable, using offline data:', error.message);
      const empleadosOffline = getEmpleadosFromStorage();
      return {
        data: empleadosOffline,
        status: 200,
        statusText: 'OK (Offline Mode)',
        offline: true
      };
    }
  },

  // Get employee by ID
  getById: async (id: number) => {
    try {
      const response = await simpleApi.get(`/empleados/${id}`);
      return response;
    } catch (error: any) {
      console.log('Backend unavailable, searching offline data...');
      const empleadosOffline = getEmpleadosFromStorage();
      const empleado = empleadosOffline.find(emp => emp.id_empleado === id);

      if (empleado) {
        return {
          data: empleado,
          status: 200,
          statusText: 'OK (Offline Mode)',
          offline: true
        };
      } else {
        throw new Error('Empleado no encontrado');
      }
    }
  },

  // Create employee - try backend first, fallback to local storage
  create: async (data: EmpleadoCreate) => {
    try {
      console.log('Attempting to create empleado in backend...');
      const response = await simpleApi.post('/empleados', data);
      console.log('Backend create response:', response);
      return response;
    } catch (error: any) {
      console.log('Backend unavailable, saving empleado offline:', error.message);

      // Create offline employee
      const nuevoEmpleado: Empleado = {
        ...data,
        id_empleado: generateOfflineId(),
        fecha_creacion: new Date().toISOString()
      };

      // Save to local storage
      const empleadosOffline = getEmpleadosFromStorage();
      empleadosOffline.push(nuevoEmpleado);
      saveEmpleadosToStorage(empleadosOffline);

      console.log('Empleado saved offline:', nuevoEmpleado);

      return {
        data: nuevoEmpleado,
        status: 201,
        statusText: 'Created (Offline Mode)',
        offline: true
      };
    }
  },

  // Update employee
  update: async (id: number, data: Partial<EmpleadoCreate>) => {
    try {
      const response = await simpleApi.put(`/empleados/${id}`, data);
      return response;
    } catch (error: any) {
      console.log('Backend unavailable, updating offline data...');

      const empleadosOffline = getEmpleadosFromStorage();
      const index = empleadosOffline.findIndex(emp => emp.id_empleado === id);

      if (index !== -1) {
        empleadosOffline[index] = { ...empleadosOffline[index], ...data };
        saveEmpleadosToStorage(empleadosOffline);

        return {
          data: empleadosOffline[index],
          status: 200,
          statusText: 'OK (Offline Mode)',
          offline: true
        };
      } else {
        throw new Error('Empleado no encontrado');
      }
    }
  },

  // Delete employee
  delete: async (id: number) => {
    try {
      const response = await simpleApi.delete(`/empleados/${id}`);
      return response;
    } catch (error: any) {
      console.log('Backend unavailable, deleting from offline data...');

      const empleadosOffline = getEmpleadosFromStorage();
      const filteredEmpleados = empleadosOffline.filter(emp => emp.id_empleado !== id);

      if (filteredEmpleados.length < empleadosOffline.length) {
        saveEmpleadosToStorage(filteredEmpleados);

        return {
          data: { message: 'Empleado eliminado (Offline Mode)' },
          status: 200,
          statusText: 'OK (Offline Mode)',
          offline: true
        };
      } else {
        throw new Error('Empleado no encontrado');
      }
    }
  }
};

// Function to create employee (used by the form)
export async function crearEmpleado(data: EmpleadoCreate) {
  try {
    console.log('Creating empleado with data:', data);
    const response = await empleadosAPI.create(data);
    console.log('Empleado created successfully:', response);
    return response.data;
  } catch (error: any) {
    console.error('Error creating empleado:', error);
    throw error;
  }
}

// Utility functions for offline management
export const empleadosOfflineUtils = {
  // Get offline employees count
  getOfflineCount: () => {
    return getEmpleadosFromStorage().length;
  },

  // Check if we have offline data
  hasOfflineData: () => {
    return getEmpleadosFromStorage().length > 0;
  },

  // Clear all offline data
  clearOfflineData: () => {
    localStorage.removeItem(EMPLEADOS_STORAGE_KEY);
    console.log('Offline empleados data cleared');
  },

  // Export offline data
  exportOfflineData: () => {
    const empleados = getEmpleadosFromStorage();
    const dataStr = JSON.stringify(empleados, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `empleados_offline_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }
};
