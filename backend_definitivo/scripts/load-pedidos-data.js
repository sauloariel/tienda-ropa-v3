// Script para cargar pedidos usando la configuración existente de la aplicación
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

// Datos de ejemplo para cargar
const pedidosData = [
    {
        id_cliente: 1,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-15T10:30:00').toISOString(),
        importe: 11000.00,
        estado: 'completado',
        anulacion: false,
        venta_web: false,
        payment_id: null,
        detalle: [
            { id_producto: 1, cantidad: 2, precio_venta: 2500.00, descuento: 0 },
            { id_producto: 2, cantidad: 1, precio_venta: 8500.00, descuento: 500.00 }
        ]
    },
    {
        id_cliente: 2,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-16T14:20:00').toISOString(),
        importe: 12000.00,
        estado: 'completado',
        anulacion: false,
        venta_web: false,
        payment_id: null,
        detalle: [
            { id_producto: 3, cantidad: 1, precio_venta: 12000.00, descuento: 0 }
        ]
    },
    {
        id_cliente: 3,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-17T09:15:00').toISOString(),
        importe: 33000.00,
        estado: 'procesando',
        anulacion: false,
        venta_web: false,
        payment_id: null,
        detalle: [
            { id_producto: 4, cantidad: 1, precio_venta: 25000.00, descuento: 0 },
            { id_producto: 5, cantidad: 1, precio_venta: 8000.00, descuento: 0 }
        ]
    },
    {
        id_cliente: 4,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-18T16:45:00').toISOString(),
        importe: 9500.00,
        estado: 'pendiente',
        anulacion: false,
        venta_web: false,
        payment_id: null,
        detalle: [
            { id_producto: 6, cantidad: 2, precio_venta: 3500.00, descuento: 0 },
            { id_producto: 7, cantidad: 1, precio_venta: 6000.00, descuento: 500.00 }
        ]
    },
    {
        id_cliente: 1,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-19T11:30:00').toISOString(),
        importe: 15000.00,
        estado: 'completado',
        anulacion: false,
        venta_web: true,
        payment_id: 'web_123456789',
        detalle: [
            { id_producto: 8, cantidad: 1, precio_venta: 15000.00, descuento: 0 }
        ]
    },
    {
        id_cliente: 2,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-20T13:20:00').toISOString(),
        importe: 17500.00,
        estado: 'completado',
        anulacion: false,
        venta_web: true,
        payment_id: 'web_987654321',
        detalle: [
            { id_producto: 1, cantidad: 3, precio_venta: 2500.00, descuento: 0 },
            { id_producto: 3, cantidad: 1, precio_venta: 12000.00, descuento: 2000.00 }
        ]
    },
    {
        id_cliente: 3,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-21T15:10:00').toISOString(),
        importe: 22000.00,
        estado: 'cancelado',
        anulacion: true,
        venta_web: false,
        payment_id: null,
        detalle: [
            { id_producto: 4, cantidad: 1, precio_venta: 25000.00, descuento: 3000.00 }
        ]
    },
    {
        id_cliente: 4,
        id_empleados: 1,
        fecha_pedido: new Date('2024-01-22T10:00:00').toISOString(),
        importe: 12000.00,
        estado: 'completado',
        anulacion: false,
        venta_web: true,
        payment_id: 'web_456789123',
        detalle: [
            { id_producto: 3, cantidad: 1, precio_venta: 12000.00, descuento: 0 }
        ]
    }
];

async function cargarPedidos() {
    try {
        console.log('🚀 Iniciando carga de pedidos...');
        console.log(`📦 Se van a cargar ${pedidosData.length} pedidos`);

        let exitosos = 0;
        let fallidos = 0;

        for (const pedido of pedidosData) {
            try {
                console.log(`\n📦 Cargando pedido para cliente ${pedido.id_cliente}...`);
                console.log(`   💰 Total: $${pedido.importe}`);
                console.log(`   📅 Fecha: ${pedido.fecha_pedido}`);
                console.log(`   🛒 Productos: ${pedido.detalle.length}`);

                const response = await axios.post(`${API_BASE_URL}/pedidos`, pedido);

                if (response.status === 201) {
                    console.log(`   ✅ Pedido creado exitosamente`);
                    exitosos++;
                } else {
                    console.log(`   ⚠️ Respuesta inesperada: ${response.status}`);
                    fallidos++;
                }

            } catch (error) {
                console.log(`   ❌ Error creando pedido: ${error.response?.data?.error || error.message}`);
                fallidos++;
            }
        }

        console.log('\n📊 RESUMEN DE CARGA:');
        console.log(`✅ Exitosos: ${exitosos}`);
        console.log(`❌ Fallidos: ${fallidos}`);
        console.log(`📦 Total procesados: ${pedidosData.length}`);

        if (exitosos > 0) {
            console.log('\n🎉 ¡Pedidos cargados exitosamente!');
            console.log('💡 Ahora puedes ver los pedidos en el panel administrativo.');
        }

    } catch (error) {
        console.error('❌ Error general:', error.message);
        console.log('\n💡 Asegúrate de que el servidor backend esté corriendo en http://localhost:4000');
    }
}

// Verificar si el servidor está corriendo antes de cargar datos
async function verificarServidor() {
    try {
        console.log('🔍 Verificando conexión con el servidor...');
        const response = await axios.get(`${API_BASE_URL}/health`);
        if (response.status === 200) {
            console.log('✅ Servidor conectado correctamente');
            return true;
        }
    } catch (error) {
        console.log('❌ No se puede conectar con el servidor');
        console.log('💡 Asegúrate de que el servidor backend esté corriendo:');
        console.log('   cd backend_definitivo');
        console.log('   npm run dev');
        return false;
    }
}

// Función principal
async function main() {
    const servidorOk = await verificarServidor();
    if (servidorOk) {
        await cargarPedidos();
    }
}

// Ejecutar
main();
