#!/usr/bin/env node

/**
 * Script de ayuda para configurar EmailJS
 * Ejecutar: node configure-emailjs.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('');
console.log('='.repeat(60));
console.log('  📧 Configurador de EmailJS - Verificación de Email');
console.log('='.repeat(60));
console.log('');

function question(prompt) {
    return new Promise((resolve) => {
        rl.question(prompt, resolve);
    });
}

async function configure() {
    console.log('Este asistente te ayudará a configurar EmailJS paso a paso.\n');

    console.log('📋 Paso 1: ¿Ya tienes una cuenta en EmailJS?');
    console.log('   Si no, créala aquí: https://www.emailjs.com/\n');

    const hasAccount = await question('¿Tienes cuenta en EmailJS? (s/n): ');

    if (hasAccount.toLowerCase() !== 's') {
        console.log('\n✋ Por favor, crea una cuenta en EmailJS primero:');
        console.log('   1. Ve a: https://www.emailjs.com/');
        console.log('   2. Haz clic en "Sign Up"');
        console.log('   3. Verifica tu email');
        console.log('   4. Vuelve a ejecutar este script\n');
        rl.close();
        return;
    }

    console.log('\n📋 Paso 2: Ingresa tus credenciales de EmailJS\n');

    const serviceId = await question('Service ID (ejemplo: service_abc123): ');
    const templateId = await question('Template ID (ejemplo: template_xyz456): ');
    const publicKey = await question('Public Key (ejemplo: AbCdEfGhIjKlMnOp): ');

    // Validar que no estén vacías
    if (!serviceId || !templateId || !publicKey) {
        console.log('\n❌ Error: Todas las credenciales son requeridas');
        rl.close();
        return;
    }

    // Crear contenido del archivo .env.local
    const envContent = `# Configuración de EmailJS
VITE_EMAILJS_SERVICE_ID=${serviceId}
VITE_EMAILJS_TEMPLATE_ID=${templateId}
VITE_EMAILJS_PUBLIC_KEY=${publicKey}
`;

    // Guardar archivo
    const envPath = path.join(__dirname, 'tienda-ropa', '.env.local');

    try {
        fs.writeFileSync(envPath, envContent, 'utf8');
        console.log('\n✅ Archivo .env.local creado exitosamente!\n');
        console.log('📁 Ubicación:', envPath);
        console.log('');
        console.log('🎉 ¡Configuración completada!');
        console.log('');
        console.log('📋 Próximos pasos:');
        console.log('   1. Reinicia el servidor frontend:');
        console.log('      cd tienda-ropa && npm run dev');
        console.log('   2. Abre tu tienda: http://localhost:5173');
        console.log('   3. Intenta registrar un usuario');
        console.log('   4. ¡Deberías recibir un email!');
        console.log('');
    } catch (error) {
        console.log('\n❌ Error guardando archivo:', error.message);
        console.log('');
        console.log('💡 Alternativa: Crea manualmente el archivo .env.local con:');
        console.log('');
        console.log(envContent);
        console.log('');
    }

    rl.close();
}

configure().catch(error => {
    console.error('Error:', error);
    rl.close();
    process.exit(1);
});





