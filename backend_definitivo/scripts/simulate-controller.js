const { Sequelize } = require('sequelize');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
require('dotenv').config();

// Usar la misma configuración que el proyecto
const sequelize = new Sequelize({
    dialect: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'ecommerce',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || '123',
    logging: console.log
});

async function simularControladorRegistro() {
    try {
        console.log('🔄 Simulando controlador de registro...');

        const clienteData = {
            mail: 'test-controlador@example.com',
            password: 'password123',
            nombre: 'Usuario',
            apellido: 'Prueba'
        };

        console.log('📝 Datos recibidos:', clienteData);

        // Validar campos requeridos
        if (!clienteData.mail || !clienteData.password || !clienteData.nombre || !clienteData.apellido) {
            throw new Error('Email, contraseña, nombre y apellido son requeridos');
        }

        // Verificar si el cliente ya existe
        console.log('🔍 Verificando si el cliente ya existe...');
        const clienteExistente = await sequelize.query(`
            SELECT * FROM clientes WHERE mail = :mail
        `, {
            replacements: { mail: clienteData.mail.toLowerCase() },
            type: Sequelize.QueryTypes.SELECT
        });

        if (clienteExistente.length > 0) {
            throw new Error('Ya existe un cliente con este email');
        }

        // Hash de la contraseña
        console.log('🔐 Generando hash de contraseña...');
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(clienteData.password, saltRounds);

        // Generar DNI y CUIT únicos
        console.log('🆔 Generando DNI y CUIT únicos...');
        const timestamp = Date.now();
        const dniUnico = timestamp.toString().slice(-8);
        const cuitUnico = `20${dniUnico}9`;

        // Generar token de verificación
        console.log('🎫 Generando token de verificación...');
        const verificationToken = crypto.randomBytes(32).toString('hex');
        const tokenExpiry = new Date();
        tokenExpiry.setHours(tokenExpiry.getHours() + 24);

        console.log('📝 Datos a insertar:');
        console.log('  - DNI:', dniUnico);
        console.log('  - CUIT:', cuitUnico);
        console.log('  - Email:', clienteData.mail.toLowerCase());
        console.log('  - Token:', verificationToken.substring(0, 10) + '...');

        // Crear nuevo cliente
        console.log('💾 Creando cliente en la base de datos...');
        const nuevoCliente = await sequelize.query(`
            INSERT INTO clientes (
                dni, cuit_cuil, nombre, apellido, domicilio, telefono, 
                mail, password, estado, email_verificado, token_verificacion, fecha_token_verificacion
            ) VALUES (
                :dni, :cuit, :nombre, :apellido, 'Sin especificar', '1234567890', 
                :mail, :password, 'activo', false, :token, :tokenExpiry
            ) RETURNING id_cliente, nombre, apellido, mail, email_verificado
        `, {
            replacements: {
                dni: dniUnico,
                cuit: cuitUnico,
                nombre: clienteData.nombre,
                apellido: clienteData.apellido,
                mail: clienteData.mail.toLowerCase(),
                password: hashedPassword,
                token: verificationToken,
                tokenExpiry: tokenExpiry
            },
            type: Sequelize.QueryTypes.INSERT
        });

        console.log('✅ Cliente creado exitosamente:', nuevoCliente[0][0]);

        // Simular respuesta del controlador
        const clienteDataResponse = {
            id_cliente: nuevoCliente[0][0].id_cliente,
            dni: dniUnico,
            cuit_cuil: cuitUnico,
            nombre: clienteData.nombre,
            apellido: clienteData.apellido,
            domicilio: 'Sin especificar',
            telefono: '1234567890',
            mail: clienteData.mail.toLowerCase(),
            estado: 'activo',
            email_verificado: false
        };

        const response = {
            success: true,
            message: 'Cliente registrado exitosamente. Revisa tu email para verificar tu cuenta.',
            cliente: clienteDataResponse,
            email_enviado: false, // Simulamos que no se envió por ahora
            requiere_verificacion: true
        };

        console.log('📤 Respuesta del controlador:', JSON.stringify(response, null, 2));

        // Limpiar el cliente de prueba
        await sequelize.query(`
            DELETE FROM clientes WHERE mail = :mail
        `, {
            replacements: { mail: clienteData.mail.toLowerCase() },
            type: Sequelize.QueryTypes.DELETE
        });
        console.log('✅ Cliente de prueba eliminado');

        console.log('\n🎉 Simulación del controlador completada exitosamente');

    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error('Stack:', error.stack);
    } finally {
        await sequelize.close();
    }
}

// Ejecutar la función
simularControladorRegistro();





