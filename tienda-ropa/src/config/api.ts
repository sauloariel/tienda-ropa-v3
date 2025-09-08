// Configuración centralizada de la API
export const API_CONFIG = {
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
    timeout: 10000,
    endpoints: {
        facturas: '/api/facturas',
        productos: '/api/productos',
        categorias: '/api/productos/categorias',
        clientes: '/api/clientes',
        ventas: '/api/ventas'
    }
};

// Helper para formatear moneda en ARS
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
};

// Helper para formatear número
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('es-AR').format(num);
};

// Helper para validar stock
export const validateStock = (producto: any, cantidad: number): { valid: boolean; message?: string } => {
    if (cantidad <= 0) {
        return { valid: false, message: 'La cantidad debe ser mayor a 0' };
    }

    if (producto.stock < cantidad) {
        return {
            valid: false,
            message: `Stock insuficiente. Disponible: ${producto.stock}`
        };
    }

    return { valid: true };
};

