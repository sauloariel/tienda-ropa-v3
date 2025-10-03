const fs = require('fs');
const path = require('path');

// Tus credenciales de EmailJS
const credentials = {
    SERVICE_ID: 'service_qxnyfzk',
    TEMPLATE_ID: 'template_zmw434n',
    PUBLIC_KEY: 'CIEawmID0xf-Hl2L1'
};

// Contenido del archivo .env.local
const envContent = `# Configuración de EmailJS para Verificación de Emails
VITE_EMAILJS_SERVICE_ID=${credentials.SERVICE_ID}
VITE_EMAILJS_TEMPLATE_ID=${credentials.TEMPLATE_ID}
VITE_EMAILJS_PUBLIC_KEY=${credentials.PUBLIC_KEY}
`;

// Ruta del archivo
const envPath = path.join(__dirname, 'tienda-ropa', '.env.local');

try {
    // Crear el archivo
    fs.writeFileSync(envPath, envContent, 'utf8');

    console.log('');
    console.log('✅ Archivo .env.local creado exitosamente!');
    console.log('');
    console.log('📁 Ubicación:', envPath);
    console.log('');
    console.log('📋 Credenciales configuradas:');
    console.log('   Service ID:', credentials.SERVICE_ID);
    console.log('   Template ID:', credentials.TEMPLATE_ID);
    console.log('   Public Key:', credentials.PUBLIC_KEY);
    console.log('');
    console.log('🎉 ¡Todo listo!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Reinicia el servidor frontend si está corriendo');
    console.log('   2. Ve a tu tienda: http://localhost:5173');
    console.log('   3. Intenta registrar un usuario');
    console.log('   4. ¡Deberías recibir un email de verificación!');
    console.log('');
} catch (error) {
    console.error('❌ Error creando archivo:', error.message);
    console.log('');
    console.log('💡 Alternativa: Crea manualmente el archivo .env.local');
    console.log('   en tienda-ropa/ con este contenido:');
    console.log('');
    console.log(envContent);
}






