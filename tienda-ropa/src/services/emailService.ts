// Servicio de EmailJS para envío de emails
// 
// CONFIGURACIÓN REQUERIDA:
// 1. Crea una cuenta gratuita en https://www.emailjs.com/
// 2. Conecta tu email (Gmail recomendado)
// 3. Crea un template de email con los parámetros: to_email, to_name, message
// 4. Copia tus credenciales desde el dashboard
// 5. Crea un archivo .env.local en tienda-ropa/ con:
//    VITE_EMAILJS_SERVICE_ID=tu_service_id
//    VITE_EMAILJS_TEMPLATE_ID=tu_template_id
//    VITE_EMAILJS_PUBLIC_KEY=tu_public_key

import emailjs from '@emailjs/browser';

// Configuración de EmailJS con credenciales reales
// IMPORTANTE: Usando la misma configuración que funciona en orderEmailService
const EMAILJS_CONFIG = {
    serviceId: 'service_qxnyfzk',
    templateId: 'template_8iekr2x', // Template Password Reset existente
    publicKey: 'CIEawmID0xf-Hl2L1'
};

// Verificar si EmailJS está configurado
const isEmailJSConfigured = () => {
    return EMAILJS_CONFIG.serviceId.startsWith('service_') &&
        EMAILJS_CONFIG.templateId.startsWith('template_') &&
        EMAILJS_CONFIG.publicKey.length > 10;
};

// Inicializar EmailJS
if (isEmailJSConfigured()) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log('✅ EmailJS inicializado correctamente');
} else {
    console.warn('⚠️ EmailJS no está configurado - usando modo simulación');
}

/**
 * Enviar email de recuperación de contraseña
 */
export const sendPasswordResetEmail = async (
    email: string,
    resetToken: string,
    cliente: { nombre?: string; apellido?: string }
): Promise<boolean> => {
    try {
        console.log('🔍 Verificando configuración de EmailJS...');
        console.log('📋 Configuración actual:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId,
            publicKey: EMAILJS_CONFIG.publicKey.substring(0, 10) + '...',
            isConfigured: isEmailJSConfigured()
        });

        if (!isEmailJSConfigured()) {
            console.warn('⚠️ EmailJS no está configurado. Simulando envío de email...');
            console.log(`📧 Email de recuperación simulado para ${email}:`);
            console.log(`🔗 Token: ${resetToken}`);
            console.log(`👤 Cliente: ${cliente.nombre} ${cliente.apellido}`);
            console.log(`🌐 URL de recuperación: ${window.location.origin}/reset-password?token=${resetToken}`);
            console.log('💡 Para envíos reales, configura EmailJS con credenciales válidas');
            return true; // Simular éxito
        }

        // Verificar que los IDs no sean los valores por defecto
        if (!EMAILJS_CONFIG.serviceId.startsWith('service_')) {
            console.error('❌ Service ID parece incorrecto:', EMAILJS_CONFIG.serviceId);
            return false;
        }

        if (!EMAILJS_CONFIG.templateId.startsWith('template_')) {
            console.error('❌ Template ID parece incorrecto:', EMAILJS_CONFIG.templateId);
            return false;
        }

        // URL del enlace de recuperación (ajusta según tu dominio)
        const resetUrl = `${window.location.origin}/reset-password?token=${resetToken}`;

        // Parámetros para el template Password Reset
        const templateParams = {
            to_email: email,
            to_name: `${cliente.nombre} ${cliente.apellido}`,
            reset_url: resetUrl,
            reset_token: resetToken,
            from_name: 'Tienda de Ropa',
            message: `Hola ${cliente.nombre}, has solicitado recuperar tu contraseña.`
        };

        console.log('📧 Enviando email de recuperación de contraseña...');
        console.log('🔧 Configuración EmailJS:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId,
            publicKey: EMAILJS_CONFIG.publicKey.substring(0, 10) + '...'
        });
        console.log('📝 Parámetros del template:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('✅ Email de recuperación enviado exitosamente:', response);
        return true;

    } catch (error: any) {
        console.error('❌ Error enviando email de recuperación:', error);
        console.error('🔍 Detalles del error:', {
            message: error.message,
            status: error.status,
            text: error.text,
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId
        });

        // Si es error 404, probablemente el Service ID o Template ID son incorrectos
        if (error.status === 404) {
            console.error('🚨 Error 404: Verifica que el Service ID y Template ID sean correctos en EmailJS');
            console.error('📋 Valores actuales:', {
                serviceId: EMAILJS_CONFIG.serviceId,
                templateId: EMAILJS_CONFIG.templateId
            });
        }

        return false;
    }
};

/**
 * Enviar email de verificación de cuenta
 */
export const sendVerificationEmail = async (
    email: string,
    verificationToken: string,
    cliente: { nombre?: string; apellido?: string }
): Promise<boolean> => {
    try {
        if (!isEmailJSConfigured()) {
            console.warn('⚠️ EmailJS no está configurado. Simulando envío de email...');
            console.log(`📧 Email de verificación simulado para ${email}:`);
            console.log(`🔗 Token: ${verificationToken}`);
            console.log(`👤 Cliente: ${cliente.nombre} ${cliente.apellido}`);
            return true; // Simular éxito
        }

        // URL del enlace de verificación (ajusta según tu dominio)
        const verificationUrl = `${window.location.origin}/verify-email/${verificationToken}`;

        // Parámetros del template de EmailJS
        const templateParams = {
            to_email: email,
            to_name: `${cliente.nombre} ${cliente.apellido}`,
            verification_url: verificationUrl,
            verification_token: verificationToken,
            from_name: 'Tienda de Ropa',
            message: `Hola ${cliente.nombre}, bienvenido a nuestra tienda. Por favor verifica tu email para activar tu cuenta.`
        };

        console.log('📧 Enviando email de verificación...');

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('✅ Email de verificación enviado exitosamente:', response);
        return true;

    } catch (error) {
        console.error('❌ Error enviando email de verificación:', error);
        return false;
    }
};

/**
 * Enviar email de bienvenida
 */
export const sendWelcomeEmail = async (
    email: string,
    cliente: { nombre?: string; apellido?: string }
): Promise<boolean> => {
    try {
        if (!isEmailJSConfigured()) {
            console.warn('⚠️ EmailJS no está configurado. Simulando envío de email...');
            console.log(`📧 Email de bienvenida simulado para ${email}:`);
            console.log(`👤 Cliente: ${cliente.nombre} ${cliente.apellido}`);
            return true; // Simular éxito
        }

        // Parámetros del template de EmailJS
        const templateParams = {
            to_email: email,
            to_name: `${cliente.nombre} ${cliente.apellido}`,
            from_name: 'Tienda de Ropa',
            message: `¡Hola ${cliente.nombre}! Bienvenido a nuestra tienda. Gracias por registrarte.`
        };

        console.log('📧 Enviando email de bienvenida...');

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('✅ Email de bienvenida enviado exitosamente:', response);
        return true;

    } catch (error) {
        console.error('❌ Error enviando email de bienvenida:', error);
        return false;
    }
};

/**
 * Función de prueba simple para EmailJS
 */
export const testEmailJS = async (): Promise<boolean> => {
    try {
        console.log('🧪 Iniciando prueba simple de EmailJS...');

        // Parámetros para el template Password Reset
        const templateParams = {
            to_email: 'saulozamudiotic@gmail.com',
            to_name: 'Saulo Zamudio',
            reset_url: 'https://example.com/reset-password?token=test123',
            reset_token: 'test-token-123',
            from_name: 'Tienda de Ropa',
            message: 'Esta es una prueba de EmailJS usando el template Password Reset'
        };

        console.log('📧 Enviando email de prueba...');
        console.log('🔧 Configuración:', EMAILJS_CONFIG);
        console.log('📝 Parámetros:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams
        );

        console.log('✅ Email de prueba enviado exitosamente:', response);
        return true;

    } catch (error: any) {
        console.error('❌ Error en prueba de EmailJS:', error);
        console.error('🔍 Detalles del error:', {
            message: error.message,
            status: error.status,
            text: error.text,
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId,
            publicKey: EMAILJS_CONFIG.publicKey.substring(0, 10) + '...'
        });

        // Proporcionar ayuda específica según el tipo de error
        if (error.status === 404) {
            console.error('🚨 Error 404 - Cuenta no encontrada:');
            console.error('   • Verifica que tus credenciales de EmailJS sean correctas');
            console.error('   • Asegúrate de que tu cuenta de EmailJS esté activa');
            console.error('   • Crea un archivo .env.local en tienda-ropa/ con tus credenciales');
            console.error('   • Formato del .env.local:');
            console.error('     VITE_EMAILJS_SERVICE_ID=tu_service_id');
            console.error('     VITE_EMAILJS_TEMPLATE_ID=tu_template_id');
            console.error('     VITE_EMAILJS_PUBLIC_KEY=tu_public_key');
        } else if (error.status === 400) {
            console.error('🚨 Error 400 - Parámetros incorrectos:');
            console.error('   • Verifica que tu template de EmailJS tenga los parámetros correctos');
            console.error('   • Asegúrate de que to_email, to_name y message estén definidos en tu template');
        }

        return false;
    }
};

export default {
    sendPasswordResetEmail,
    sendVerificationEmail,
    sendWelcomeEmail,
    testEmailJS,
    isEmailJSConfigured
};
