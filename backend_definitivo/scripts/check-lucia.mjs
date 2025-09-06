#!/usr/bin/env node

require('dotenv/config');
const { Loguin } = require('../src/models/Loguin.model.ts');
const { Empleados } = require('../src/models/Empleados.model.ts');
const db = require('../src/config/db.ts');

async function checkLucia() {
    try {
        await db.authenticate();
        console.log('✅ Conectado a la base de datos');

        const luciaLogin = await Loguin.findOne({
            where: { usuario: 'lucia' },
            include: [
                {
                    model: Empleados,
                    as: 'empleado',
                    attributes: ['id_empleado', 'nombre', 'apellido', 'mail', 'estado']
                }
            ]
        });

        if (luciaLogin) {
            console.log('👤 Usuario lucia encontrado:');
            console.log('   ID:', luciaLogin.id_loguin);
            console.log('   Usuario:', luciaLogin.usuario);
            console.log('   Empleado:', luciaLogin.empleado?.nombre, luciaLogin.empleado?.apellido);
            console.log('   Estado empleado:', luciaLogin.empleado?.estado);
            console.log('   Activo login:', luciaLogin.activo);
        } else {
            console.log('❌ Usuario lucia no encontrado');
        }

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await db.close();
    }
}

checkLucia().catch(console.error);
