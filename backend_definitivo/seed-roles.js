const { Roles } = require('./dist/models/Roles.model');

async function seedRoles() {
    try {
        console.log('🌱 Iniciando seed de roles...');

        // Verificar si ya existen roles
        const existingRoles = await Roles.findAll();
        if (existingRoles.length > 0) {
            console.log('✅ Los roles ya existen en la base de datos');
            console.log('Roles existentes:', existingRoles.map(r => r.descripcion));
            return;
        }

        // Crear roles básicos
        const rolesToCreate = [
            { descripcion: 'Admin' },
            { descripcion: 'Vendedor' },
            { descripcion: 'Gerente' },
            { descripcion: 'Cajero' },
            { descripcion: 'Supervisor' }
        ];

        for (const rolData of rolesToCreate) {
            await Roles.create(rolData);
            console.log(`✅ Rol creado: ${rolData.descripcion}`);
        }

        console.log('🎉 Seed de roles completado exitosamente!');
    } catch (error) {
        console.error('❌ Error en seed de roles:', error);
    }
}

// Ejecutar si se llama directamente
if (require.main === module) {
    seedRoles().then(() => {
        console.log('✅ Proceso completado');
        process.exit(0);
    }).catch((error) => {
        console.error('❌ Error:', error);
        process.exit(1);
    });
}

module.exports = { seedRoles };
