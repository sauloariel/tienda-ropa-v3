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
export interface ModuloPermiso {
    id: string;
    nombre: string;
    icono: string;
    ruta: string;
    descripcion: string;
    color: string;
    bgColor: string;
}

export interface RolPermisos {
    [key: string]: ModuloPermiso[];
}

export const PERMISOS_POR_ROL: RolPermisos = {
    Admin: [
        { id: 'pos', nombre: 'POS', icono: '🛒', ruta: '/pos', descripcion: 'Punto de venta', color: 'text-green-600', bgColor: 'bg-green-100' },
        { id: 'productos', nombre: 'Productos', icono: '📦', ruta: '/productos', descripcion: 'Gestión de productos', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { id: 'pedidos', nombre: 'Pedidos', icono: '📋', ruta: '/pedidos', descripcion: 'Gestión de pedidos', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { id: 'clientes', nombre: 'Clientes', icono: '👥', ruta: '/clientes', descripcion: 'Gestión de clientes', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
        { id: 'empleados', nombre: 'Empleados', icono: '👨‍💼', ruta: '/empleados', descripcion: 'Gestión de empleados', color: 'text-red-600', bgColor: 'bg-red-100' },
        { id: 'ventas', nombre: 'Ventas', icono: '💰', ruta: '/ventas', descripcion: 'Historial de ventas', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
        { id: 'estadisticas', nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Reportes y métricas', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
        { id: 'marketing', nombre: 'Marketing', icono: '🎯', ruta: '/marketing', descripcion: 'Campañas y promociones', color: 'text-pink-600', bgColor: 'bg-pink-100' }
    ],
    Vendedor: [
        { id: 'pos', nombre: 'POS', icono: '🛒', ruta: '/pos', descripcion: 'Punto de venta', color: 'text-green-600', bgColor: 'bg-green-100' },
        { id: 'pedidos', nombre: 'Pedidos', icono: '📋', ruta: '/pedidos', descripcion: 'Gestión de pedidos', color: 'text-orange-600', bgColor: 'bg-orange-100' },
        { id: 'clientes', nombre: 'Clientes', icono: '👥', ruta: '/clientes', descripcion: 'Gestión de clientes', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
        { id: 'ventas', nombre: 'Ventas', icono: '💰', ruta: '/ventas', descripcion: 'Historial de ventas', color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
        { id: 'estadisticas', nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Reportes de ventas', color: 'text-cyan-600', bgColor: 'bg-cyan-100' }
    ],
    Inventario: [
        { id: 'productos', nombre: 'Productos', icono: '📦', ruta: '/productos', descripcion: 'Gestión de productos', color: 'text-purple-600', bgColor: 'bg-purple-100' },
        { id: 'estadisticas', nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Reportes de inventario', color: 'text-cyan-600', bgColor: 'bg-cyan-100' }
    ],
    Marketing: [
        { id: 'marketing', nombre: 'Marketing', icono: '🎯', ruta: '/marketing', descripcion: 'Campañas y promociones', color: 'text-pink-600', bgColor: 'bg-pink-100' },
        { id: 'estadisticas', nombre: 'Estadísticas', icono: '📈', ruta: '/estadisticas', descripcion: 'Métricas de marketing', color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
        { id: 'pedidos', nombre: 'Pedidos', icono: '📋', ruta: '/pedidos', descripcion: 'Análisis de pedidos', color: 'text-orange-600', bgColor: 'bg-orange-100' }
    ]
};

// Función helper para obtener permisos de un rol
export const obtenerPermisosRol = (rol: Rol) => {
    console.log('🔍 Buscando permisos para rol:', rol);
    console.log('📚 Roles disponibles:', Object.keys(PERMISOS_POR_ROL));
    console.log('🎯 Permisos encontrados:', PERMISOS_POR_ROL[rol]);
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
