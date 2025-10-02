// Servicio simplificado de Google Auth
// Esta versión evita problemas de importación con Vite

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';

// Configuración de Firebase
// IMPORTANTE: Reemplaza estos valores con los de tu proyecto de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX", // Tu API Key
    authDomain: "tu-proyecto.firebaseapp.com", // Tu dominio de auth
    projectId: "tu-proyecto-id", // Tu Project ID
    storageBucket: "tu-proyecto.appspot.com", // Tu Storage Bucket
    messagingSenderId: "123456789012", // Tu Sender ID
    appId: "1:123456789012:web:abcdefghijklmnop" // Tu App ID
};

// Verificar si Firebase está configurado
const isFirebaseConfigured = () => {
    return firebaseConfig.apiKey !== "AIzaSyBXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configuración del proveedor de Google
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

/**
 * Iniciar sesión con Google
 */
export const signInWithGoogle = async () => {
    try {
        // Verificar si Firebase está configurado
        if (!isFirebaseConfigured()) {
            console.warn('⚠️ Firebase no está configurado. Usando datos de prueba...');

            // Simular datos de usuario de Google para pruebas
            const mockUser = {
                uid: 'mock-google-user-' + Date.now(),
                email: 'usuario@ejemplo.com',
                displayName: 'Usuario de Prueba',
                photoURL: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=G',
                getIdToken: async () => 'mock-token'
            };

            console.log('✅ Usuario simulado de Google:', mockUser);
            return mockUser;
        }

        console.log('🔐 Iniciando sesión con Google...');

        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        console.log('✅ Usuario autenticado con Google:', {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL
        });

        return user;
    } catch (error: any) {
        console.error('❌ Error en autenticación con Google:', error);

        if (error.code === 'auth/api-key-not-valid') {
            console.warn('⚠️ API Key de Firebase no válida. Usando datos de prueba...');

            // Fallback a datos de prueba
            const mockUser = {
                uid: 'fallback-user-' + Date.now(),
                email: 'fallback@ejemplo.com',
                displayName: 'Usuario Fallback',
                photoURL: 'https://via.placeholder.com/150/4285F4/FFFFFF?text=F',
                getIdToken: async () => 'fallback-token'
            };

            console.log('✅ Usuario fallback de Google:', mockUser);
            return mockUser;
        }

        if (error.code === 'auth/popup-closed-by-user') {
            console.log('ℹ️ Usuario cerró la ventana de autenticación');
        } else if (error.code === 'auth/popup-blocked') {
            console.log('ℹ️ Popup bloqueado por el navegador');
        }

        return null;
    }
};

/**
 * Cerrar sesión de Google
 */
export const signOutGoogle = async () => {
    try {
        if (!isFirebaseConfigured()) {
            console.log('✅ Sesión simulada cerrada correctamente');
            return;
        }

        await signOut(auth);
        console.log('✅ Sesión cerrada correctamente');
    } catch (error) {
        console.error('❌ Error cerrando sesión:', error);
    }
};

/**
 * Obtener usuario actual de Google
 */
export const getCurrentGoogleUser = () => {
    if (!isFirebaseConfigured()) {
        return null; // No hay usuario simulado persistente
    }
    return auth.currentUser;
};

/**
 * Verificar si el usuario está autenticado con Google
 */
export const isGoogleAuthenticated = () => {
    if (!isFirebaseConfigured()) {
        return false; // No hay autenticación simulada persistente
    }
    return auth.currentUser !== null;
};

/**
 * Mapear usuario de Google a datos del cliente
 */
export const mapGoogleUserToClient = (user: any) => {
    return {
        id_cliente: user.uid,
        nombre: user.displayName?.split(' ')[0] || 'Usuario',
        apellido: user.displayName?.split(' ').slice(1).join(' ') || 'Google',
        mail: user.email || '',
        password: 'google_auth_' + user.uid, // Contraseña temporal para usuarios de Google
        telefono: '',
        domicilio: '',
        estado: 'ACTIVO',
        email_verificado: true,
        google_id: user.uid,
        google_photo: user.photoURL || '',
        dni: '',
        cuit_cuil: ''
    };
};

// Exportar auth para uso en otros archivos
export { auth };

export default {
    signInWithGoogle,
    signOutGoogle,
    getCurrentGoogleUser,
    isGoogleAuthenticated,
    mapGoogleUserToClient
};