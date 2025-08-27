// Configuration file for the application
export const config = {
    // API Configuration
    api: {
        baseURL: 'http://localhost:4000/api',
        timeout: 10000,
    },

    // App Configuration
    app: {
        name: 'Panel Administrativo',
        version: '1.0.0',
    },

    // Features Configuration
    features: {
        employees: {
            enabled: true,
            requireAdmin: true,
        },
        products: {
            enabled: true,
            requireAdmin: false,
        },
        clients: {
            enabled: true,
            requireAdmin: false,
        },
        orders: {
            enabled: true,
            requireAdmin: false,
        },
        pos: {
            enabled: true,
            requireAdmin: false,
        },
    }
}

