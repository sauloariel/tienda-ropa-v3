import emailjs from '@emailjs/browser';

// Configuración de EmailJS para verificación de email
const EMAILJS_CONFIG = {
    serviceId: 'service_oz3m2jd',
    templateId: 'template_6yo35oc',
    publicKey: 'OCa3jUXBSMKft2FcT'
};

// Inicializar EmailJS
emailjs.init(EMAILJS_CONFIG.publicKey);

// Verificar si EmailJS está configurado
const isEmailJSConfigured = () => {
    return EMAILJS_CONFIG.serviceId.startsWith('service_') &&
        EMAILJS_CONFIG.templateId.startsWith('template_') &&
        EMAILJS_CONFIG.publicKey.length > 10;
};

/**
 * Enviar email de verificación para usuarios
 * @param email - Email del usuario
 * @param nombre - Nombre del usuario
 * @param verificationToken - Token de verificación
 * @returns Promise<boolean> - true si se envió correctamente
 */
export const sendUserVerificationEmail = async (
    email: string,
    nombre: string,
    verificationToken: string
): Promise<boolean> => {
    try {
        console.log('📧 Enviando email de verificación de usuario...');

        if (!isEmailJSConfigured()) {
            console.warn('⚠️ EmailJS no está configurado. Simulando envío de email...');
            console.log(`📧 Email de verificación simulado para ${email}:`);
            console.log(`🔗 Token: ${verificationToken}`);
            console.log(`👤 Usuario: ${nombre}`);
            console.log(`🌐 URL de verificación: ${window.location.origin}/verify-email?token=${verificationToken}`);
            console.log('💡 Para envíos reales, configura EmailJS con credenciales válidas');
            return true; // Simular éxito
        }

        // URL del enlace de verificación
        const verificationUrl = `${window.location.origin}/verify-email?token=${verificationToken}`;

        // Parámetros para el template de verificación
        const templateParams = {
            email: email,  // Para el campo "Para enviar un correo electrónico"
            to_name: nombre,  // Para {{to_name}} en el template
            reset_url: verificationUrl,  // Para {{reset_url}} en el template
            verification_token: verificationToken,
            from_name: 'Tienda de Ropa',
            message: `Hola ${nombre}, verifica tu email para activar tu cuenta.`
        };

        console.log('🔧 Configuración EmailJS:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId,
            publicKey: EMAILJS_CONFIG.publicKey.substring(0, 10) + '...'
        });
        console.log('📝 Parámetros del template:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('✅ Email de verificación enviado exitosamente:', response);
        return true;

    } catch (error: any) {
        console.error('❌ Error enviando email de verificación:', error);
        console.error('🔍 Detalles del error:', {
            message: error.message,
            status: error.status,
            text: error.text,
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId
        });

        if (error.status === 404) {
            console.error('🚨 Error 404: Verifica que el Service ID y Template ID sean correctos en EmailJS');
            console.error('📋 Valores actuales:', {
                serviceId: EMAILJS_CONFIG.serviceId,
                templateId: EMAILJS_CONFIG.templateId
            });
        } else if (error.status === 400) {
            console.error('🚨 Error 400: Parámetros incorrectos');
            console.error('   • Verifica que tu template de EmailJS tenga los parámetros correctos');
            console.error('   • Asegúrate de que {{email}}, {{to_name}} y {{message}} estén definidos en tu template');
        } else if (error.status === 422) {
            console.error('🚨 Error 422 - Validación fallida:');
            console.error('   • Los parámetros del template no coinciden con lo esperado');
            console.error('   • Verifica que tu template use: {{email}}, {{to_name}}, {{reset_url}}, {{verification_token}}');
            console.error('   • Parámetros enviados:', {
                email: email,
                to_name: nombre,
                reset_url: verificationUrl,
                verification_token: verificationToken,
                from_name: 'Tienda de Ropa',
                message: `Hola ${nombre}, verifica tu email para activar tu cuenta.`
            });
        }

        return false;
    }
};

/**
 * Enviar email de verificación para empleados
 * @param email - Email del empleado
 * @param nombre - Nombre del empleado
 * @param verificationToken - Token de verificación
 * @returns Promise<boolean> - true si se envió correctamente
 */
export const sendEmployeeVerificationEmail = async (
    email: string,
    nombre: string,
    verificationToken: string
): Promise<boolean> => {
    try {
        console.log('📧 Enviando email de verificación de empleado...');

        if (!isEmailJSConfigured()) {
            console.warn('⚠️ EmailJS no está configurado. Simulando envío de email...');
            console.log(`📧 Email de verificación de empleado simulado para ${email}:`);
            console.log(`🔗 Token: ${verificationToken}`);
            console.log(`👤 Empleado: ${nombre}`);
            console.log(`🌐 URL de verificación: ${window.location.origin}/admin/verify-email?token=${verificationToken}`);
            console.log('💡 Para envíos reales, configura EmailJS con credenciales válidas');
            return true; // Simular éxito
        }

        // URL del enlace de verificación (para panel administrativo)
        const verificationUrl = `${window.location.origin}/admin/verify-email?token=${verificationToken}`;

        // Parámetros para el template de verificación
        const templateParams = {
            email: email,  // Para el campo "Para enviar un correo electrónico"
            to_name: nombre,  // Para {{to_name}} en el template
            reset_url: verificationUrl,  // Para {{reset_url}} en el template
            verification_token: verificationToken,
            from_name: 'Panel Administrativo - Tienda de Ropa',
            message: `Hola ${nombre}, verifica tu email para activar tu cuenta de empleado.`
        };

        console.log('🔧 Configuración EmailJS:', {
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId,
            publicKey: EMAILJS_CONFIG.publicKey.substring(0, 10) + '...'
        });
        console.log('📝 Parámetros del template:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('✅ Email de verificación de empleado enviado exitosamente:', response);
        return true;

    } catch (error: any) {
        console.error('❌ Error enviando email de verificación de empleado:', error);
        console.error('🔍 Detalles del error:', {
            message: error.message,
            status: error.status,
            text: error.text,
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId
        });

        if (error.status === 404) {
            console.error('🚨 Error 404: Verifica que el Service ID y Template ID sean correctos en EmailJS');
        } else if (error.status === 400) {
            console.error('🚨 Error 400: Parámetros incorrectos');
        }

        return false;
    }
};

/**
 * Función de prueba para verificar que EmailJS funciona
 * @returns Promise<boolean> - true si funciona correctamente
 */
export const testEmailVerification = async (): Promise<boolean> => {
    try {
        console.log('🧪 Iniciando prueba de verificación de email...');

        // Parámetros para el template de verificación
        const templateParams = {
            email: 'saulozamudiotic@gmail.com',  // Para el campo "Para enviar un correo electrónico"
            to_name: 'Saulo Zamudio',  // Para {{to_name}} en el template
            reset_url: 'https://example.com/verify-email?token=test123',  // Para {{reset_url}} en el template
            verification_token: 'test-token-123',
            from_name: 'Tienda de Ropa',
            message: 'Esta es una prueba de verificación de email'
        };

        console.log('📧 Enviando email de prueba...');
        console.log('🔧 Configuración:', EMAILJS_CONFIG);
        console.log('📝 Parámetros:', templateParams);

        const response = await emailjs.send(
            EMAILJS_CONFIG.serviceId,
            EMAILJS_CONFIG.templateId,
            templateParams,
            EMAILJS_CONFIG.publicKey
        );

        console.log('✅ Test de verificación de email exitoso:', response);
        return true;

    } catch (error: any) {
        console.error('❌ Error en prueba de verificación de email:', error);
        console.error('🔍 Detalles del error:', {
            message: error.message,
            status: error.status,
            text: error.text,
            serviceId: EMAILJS_CONFIG.serviceId,
            templateId: EMAILJS_CONFIG.templateId
        });

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
