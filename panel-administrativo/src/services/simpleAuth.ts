// Servicio de autenticación simplificado basado en roles
export interface SimpleUser {
    id: number;
    usuario: string;
    nombre: string;
    id_empleado: number;
    rol: string;
    rol_id: number;
}

class SimpleAuthService {
    private baseURL = 'http://localhost:4000/api';
    private currentUser: SimpleUser | null = null;

    // Login usando Basic Auth
    async login(usuario: string, password: string): Promise<{ success: boolean; user?: SimpleUser; message?: string }> {
        try {
            console.log('🔐 Iniciando login simplificado...');

            // Crear credenciales Basic Auth
            const credentials = btoa(`${usuario}:${password}`);

            const response = await fetch(`${this.baseURL}/loguin/simple-login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Basic ${credentials}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                this.currentUser = data.user;
                localStorage.setItem('simpleUser', JSON.stringify(data.user));
                console.log('✅ Login exitoso:', data.user);
                return { success: true, user: data.user };
            } else {
                const error = await response.json();
                console.log('❌ Error en login:', error.message);
                return { success: false, message: error.message };
            }
        } catch (error) {
            console.error('❌ Error en login:', error);
            return { success: false, message: 'Error de conexión' };
        }
    }

    // Logout
    logout(): void {
        this.currentUser = null;
        localStorage.removeItem('simpleUser');
        console.log('👋 Logout realizado');
    }

    // Obtener usuario actual
    getCurrentUser(): SimpleUser | null {
        if (this.currentUser) {
            return this.currentUser;
        }

        const storedUser = localStorage.getItem('simpleUser');
        if (storedUser) {
            try {
                this.currentUser = JSON.parse(storedUser);
                return this.currentUser;
            } catch (error) {
                console.error('❌ Error al parsear usuario almacenado:', error);
                localStorage.removeItem('simpleUser');
            }
        }

        return null;
    }

    // Verificar si está autenticado
    isAuthenticated(): boolean {
        return this.getCurrentUser() !== null;
    }

    // Verificar si tiene un rol específico
    hasRole(role: string): boolean {
        const user = this.getCurrentUser();
        return user?.rol === role;
    }

    // Verificar si tiene alguno de los roles permitidos
    hasAnyRole(roles: string[]): boolean {
        const user = this.getCurrentUser();
        return user ? roles.includes(user.rol) : false;
    }

    // Obtener credenciales Basic Auth para las peticiones
    getBasicAuth(): string | null {
        const user = this.getCurrentUser();
        if (!user) return null;

        // Para simplificar, usamos el usuario almacenado
        // En un sistema real, podrías almacenar las credenciales de forma segura
        const storedCredentials = localStorage.getItem('simpleCredentials');
        return storedCredentials;
    }

    // Almacenar credenciales temporalmente (solo para desarrollo)
    storeCredentials(usuario: string, password: string): void {
        const credentials = btoa(`${usuario}:${password}`);
        localStorage.setItem('simpleCredentials', credentials);
    }
}

export const simpleAuthService = new SimpleAuthService();


















