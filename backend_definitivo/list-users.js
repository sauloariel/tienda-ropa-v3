// Script para listar usuarios existentes
const { Sequelize } = require('sequelize');

async function listUsers() {
    try {
        console.log('🔍 Listando usuarios existentes...');
        
        // Crear conexión a la base de datos
        const sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: './database.sqlite',
            logging: false
        });
        
        // Definir modelos
        const Loguin = sequelize.define('Loguin', {
            id_loguin: Sequelize.INTEGER,
            id_empleado: Sequelize.INTEGER,
            id_rol: Sequelize.INTEGER,
            usuario: Sequelize.STRING,
            passwd: Sequelize.STRING
        }, { tableName: 'loguin', timestamps: false });
        
        const Empleados = sequelize.define('Empleados', {
            id_empleado: Sequelize.INTEGER,
            nombre: Sequelize.STRING,
            apellido: Sequelize.STRING,
            estado: Sequelize.STRING
        }, { tableName: 'empleados', timestamps: false });
        
        const Roles = sequelize.define('Roles', {
            id_rol: Sequelize.INTEGER,
            descripcion: Sequelize.STRING
        }, { tableName: 'roles', timestamps: false });
        
        // Listar usuarios básicos
        const usuarios = await Loguin.findAll();
        console.log(`📊 Total de usuarios encontrados: ${usuarios.length}`);
        
        for (const usuario of usuarios) {
            console.log(`\n👤 Usuario ID: ${usuario.id_loguin}`);
            console.log(`   Username: ${usuario.usuario}`);
            console.log(`   ID Empleado: ${usuario.id_empleado}`);
            console.log(`   ID Rol: ${usuario.id_rol}`);
        }
        
        // Listar empleados
        const empleados = await Empleados.findAll();
        console.log(`\n👥 Total de empleados encontrados: ${empleados.length}`);
        
        for (const empleado of empleados) {
            console.log(`\n👤 Empleado ID: ${empleado.id_empleado}`);
            console.log(`   Nombre: ${empleado.nombre} ${empleado.apellido}`);
            console.log(`   Estado: ${empleado.estado}`);
        }
        
        // Listar roles
        const roles = await Roles.findAll();
        console.log(`\n🎭 Total de roles encontrados: ${roles.length}`);
        
        for (const rol of roles) {
            console.log(`\n🎭 Rol ID: ${rol.id_rol}`);
            console.log(`   Descripción: ${rol.descripcion}`);
        }
        
    } catch (error) {
        console.error('❌ Error listando usuarios:', error.message);
    } finally {
        process.exit(0);
    }
}

listUsers();
