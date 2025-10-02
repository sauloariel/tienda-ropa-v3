// Script de prueba de registro y verificación
// Ejecutar con: node test-registration.mjs

import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

async function testRegistrationAndVerification() {
    console.log('🧪 Iniciando prueba de registro y verificación...');

    // Datos de prueba
    const testData = {
        mail: 'saulozamudio22@gmail.com',
        password: 'test123',
        nombre: 'Carlos',
        apellido: 'Zamudio',
        telefono: '11-1234-5678',
        domicilio: 'Calle Admin 123'
    };

    console.log('📋 Datos de prueba:', testData);

    try {
        // 1. Registrar usuario
        console.log('\n1️⃣ Registrando usuario...');
        const registerResponse = await axios.post(`${API_BASE_URL}/api/clientes/auth/register`, testData);

        console.log('✅ Usuario registrado exitosamente');
        console.log('📝 Respuesta:', registerResponse.data);

        if (registerResponse.data.success && registerResponse.data.cliente?.token_verificacion) {
            const token = registerResponse.data.cliente.token_verificacion;
            console.log('🔑 Token de verificación:', token);

            // 2. Generar enlace de verificación
            const verificationLink = `http://localhost:5173/verificar-email?token=${token}`;
            console.log('🔗 Enlace de verificación:', verificationLink);

            // 3. Probar verificación
            console.log('\n2️⃣ Probando verificación...');
            const verifyResponse = await axios.get(`${API_BASE_URL}/api/clientes/auth/verify-email/${token}`);

            console.log('✅ Verificación exitosa');
            console.log('📝 Respuesta:', verifyResponse.data);

            console.log('\n🎉 Prueba completada exitosamente!');
            console.log('📧 Email de prueba:', testData.mail);
            console.log('🔗 Enlace de verificación:', verificationLink);
            console.log('\n📋 Próximos pasos:');
            console.log('1. Configura EmailJS con tus credenciales');
            console.log('2. Reinicia la aplicación');
            console.log('3. Registra un nuevo usuario desde la interfaz');
            console.log('4. Revisa el email para el enlace de verificación');

        } else {
            console.error('❌ Error: No se generó token de verificación');
        }

    } catch (error) {
        console.error('❌ Error en la prueba:', error.response?.data || error.message);

        if (error.response?.status === 400) {
            console.log('\n🔍 Posibles causas:');
            console.log('- El email ya está registrado');
            console.log('- Datos de entrada inválidos');
            console.log('- Error de validación en el backend');
        }
    }
}

// Ejecutar prueba
testRegistrationAndVerification();
