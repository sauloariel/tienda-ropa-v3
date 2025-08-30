// Tipos para el sistema de autenticación y control de acceso

export type Rol = 'Admin' | 'Vendedor' | 'Inventario' | 'Marketing';

export interface Usuario {
    id: number;
    nombre: string;
    usuario: string; // Campo de usuario para login
    email?: string; // Email opcional del empleado
    rol: Rol;
    activo: boolean;
    empleado_id?: number;
    rol_id?: number;
    fecha_creacion?: Date;
    ultimo_acceso?: Date;
}

export interface LoginRequest {
    usuario: string; // Campo de usuario para login
    password: string;
}

export interface LoginResponse {
    success: boolean;
    message: string;
    token: string;
    usuario: Usuario;
    expires_in?: number;
}

export interface AuthState {
    usuario: Usuario | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    checkAuth: () => Promise<void>;
    canAccessModule: (moduleName: string) => boolean;
}

// Configuración de permisos por rol
export interface RolPermisos {
    [key: string]: {
        nombre: string;
        icono: string;
        ruta: string;
        descripcion: string;
    }[];
}

export const PERMISOS_POR_ROL: RolPermisos = {
    Admin: [
        { nombre: 'Dashboard', icono: '📊', ruta: '/dashboard', descripcion: 'Vista general del sistema' },
        { nombre: 'POS', icono: '🛒', ruta: '/pos', descripcion: 'Punto de venta' },
        { nombre: 'Productos', icono: '📦', ruta: '/productos', descripcion: 'Gestión de productos' },
        { nombre: 'Pedidos', icono: '📋', ruta: '/pedidos', descripcion: 'Gestión de pedidos' },
        { nombre: 'Clientes', icono: '👥', ruta: '/clientes', descripcion: 'Gestión de clientes' },
        { nombre: 'Empleados', icono: '👨‍💼', ruta: '/empleados', descripcion: 'Gestión de empleados' },
        { nombre: 'Ventas', icono: '💰', ruta: '/ventas', descripcion: 'Historial de ventas' },
        { nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Reportes y métricas' },
        { nombre: 'Marketing', icono: '🎯', ruta: '/marketing', descripcion: 'Campañas y promociones' },
        { nombre: 'Roles', icono: '🔐', ruta: '/roles', descripcion: 'Gestión de roles y permisos' }
    ],
    Vendedor: [
        { nombre: 'Dashboard', icono: '📊', ruta: '/dashboard', descripcion: 'Vista general del sistema' },
        { nombre: 'POS', icono: '🛒', ruta: '/pos', descripcion: 'Punto de venta' },
        { nombre: 'Pedidos', icono: '📋', ruta: '/pedidos', descripcion: 'Gestión de pedidos' },
        { nombre: 'Clientes', icono: '👥', ruta: '/clientes', descripcion: 'Gestión de clientes' },
        { nombre: 'Ventas', icono: '💰', ruta: '/ventas', descripcion: 'Historial de ventas' },
        { nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Reportes de ventas' }
    ],
    Inventario: [
        { nombre: 'Dashboard', icono: '📊', ruta: '/dashboard', descripcion: 'Vista general del sistema' },
        { nombre: 'Productos', icono: '📦', ruta: '/productos', descripcion: 'Gestión de productos' },
        { nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Reportes de inventario' }
    ],
    Marketing: [
        { nombre: 'Dashboard', icono: '📊', ruta: '/dashboard', descripcion: 'Vista general del sistema' },
        { nombre: 'Marketing', icono: '🎯', ruta: '/marketing', descripcion: 'Campañas y promociones' },
        { nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Métricas de marketing' }
    ]
};

// Función helper para obtener permisos de un rol
export const obtenerPermisosRol = (rol: Rol) => {
    return PERMISOS_POR_ROL[rol] || [];
};

// Función helper para verificar si un rol tiene acceso a una ruta
export const tieneAccesoRuta = (rol: Rol, ruta: string): boolean => {
    const permisos = obtenerPermisosRol(rol);
    return permisos.some(permiso => permiso.ruta === ruta);
};

// Función helper para verificar si un rol tiene acceso a un módulo
export const tieneAccesoModulo = (rol: Rol, moduleName: string): boolean => {
    const permisos = obtenerPermisosRol(rol);
    return permisos.some(permiso =>
        permiso.ruta.includes(moduleName) ||
        permiso.nombre.toLowerCase().includes(moduleName.toLowerCase())
    );
};
