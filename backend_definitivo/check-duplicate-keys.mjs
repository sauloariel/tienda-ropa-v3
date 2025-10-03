import { Sequelize } from 'sequelize';

console.log('🔍 Verificando Claves Duplicadas');
console.log('===============================\n');

async function checkDuplicateKeys() {
    try {
        // Configuración para PostgreSQL
        const db = new Sequelize({
            dialect: 'postgres',
            host: 'localhost',
            port: 5432,
            database: 'ecommerce',
            username: 'postgres',
            password: '123',
            logging: false,
            pool: {
                max: 5,
                min: 0,
                acquire: 30000,
                idle: 10000
            }
        });

        console.log('🔍 Conectando a PostgreSQL...');
        await db.authenticate();
        console.log('✅ Conexión exitosa');

        // Verificar DNI duplicados
        console.log('\n🔍 Verificando DNIs duplicados...');
        const [dniDuplicates] = await db.query(`
            SELECT dni, COUNT(*) as count 
            FROM clientes 
            WHERE dni IS NOT NULL 
            GROUP BY dni 
            HAVING COUNT(*) > 1
        `);

        if (dniDuplicates.length > 0) {
            console.log('❌ DNIs duplicados encontrados:');
            dniDuplicates.forEach(dup => {
                console.log(`   - DNI: ${dup.dni}, Cantidad: ${dup.count}`);
            });
        } else {
            console.log('✅ No hay DNIs duplicados');
        }

        // Verificar si 00000000 ya existe
        console.log('\n🔍 Verificando si DNI 00000000 existe...');
        const [dni00000000] = await db.query("SELECT * FROM clientes WHERE dni = '00000000'");

        if (dni00000000.length > 0) {
            console.log('❌ DNI 00000000 ya existe:', dni00000000[0]);
        } else {
            console.log('✅ DNI 00000000 no existe');
        }

        // Verificar si CUIT 00000000000 ya existe
        console.log('\n🔍 Verificando si CUIT 00000000000 existe...');
        const [cuit00000000000] = await db.query("SELECT * FROM clientes WHERE cuit_cuil = '00000000000'");

        if (cuit00000000000.length > 0) {
            console.log('❌ CUIT 00000000000 ya existe:', cuit00000000000[0]);
        } else {
            console.log('✅ CUIT 00000000000 no existe');
        }

        // Verificar estructura de la tabla
        console.log('\n🔍 Verificando estructura de la tabla...');
        const [columns] = await db.query(`
            SELECT column_name, data_type, is_nullable, column_default 
            FROM information_schema.columns 
            WHERE table_name = 'clientes' 
            ORDER BY ordinal_position
        `);

        console.log('📊 Estructura de la tabla:');
        columns.forEach(col => {
            console.log(`   - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : 'NULL'} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
        });

        await db.close();
        console.log('\n🎉 Verificación completada');

    } catch (error) {
        console.error('❌ Error durante la verificación:', error.message);
    }
}

checkDuplicateKeys();

























