// Script para simular pedidos desde la web
const axios = require('axios');

const API_BASE_URL = 'http://localhost:4000/api';

// Datos de ejemplo para pedidos web
const pedidosEjemplo = [
    {
        id_cliente: 1,
        fecha_pedido: new Date().toISOString(),
        importe: 150.00,
        estado: 'pendiente',
        payment_id: `web_${Date.now()}_1`,
        productos: [
            { id_producto: 1, cantidad: 2, precio_venta: 75.00, descuento: 0 },
            { id_producto: 2, cantidad: 1, precio_venta: 25.00, descuento: 0 }
        ]
    },
    {
        id_cliente: 2,
        fecha_pedido: new Date().toISOString(),
        importe: 89.99,
        estado: 'completado',
        payment_id: `web_${Date.now()}_2`,
        productos: [
            { id_producto: 3, cantidad: 1, precio_venta: 89.99, descuento: 0 }
        ]
    },
    {
        id_cliente: 1,
        fecha_pedido: new Date().toISOString(),
        importe: 200.50,
        estado: 'procesando',
        payment_id: `web_${Date.now()}_3`,
        productos: [
            { id_producto: 4, cantidad: 1, precio_venta: 150.00, descuento: 10.00 },
            { id_producto: 5, cantidad: 2, precio_venta: 30.25, descuento: 0 }
        ]
    }
];

async function simularPedidosWeb() {
    try {
        console.log('🌐 Simulando pedidos desde la web...');

        // Crear pedidos individuales
        for (const pedido of pedidosEjemplo) {
            try {
                const response = await axios.post(`${API_BASE_URL}/pedidos-web`, pedido);
                console.log(`✅ Pedido ${pedido.payment_id} creado exitosamente:`, response.data.message);
            } catch (error) {
                console.error(`❌ Error creando pedido ${pedido.payment_id}:`, error.response?.data || error.message);
            }
        }

        // Sincronizar múltiples pedidos
        console.log('\n🔄 Sincronizando múltiples pedidos...');
        const syncResponse = await axios.post(`${API_BASE_URL}/pedidos-web/sync`, {
            pedidos: pedidosEjemplo
        });

        console.log('✅ Sincronización completada:', syncResponse.data);

        // Obtener todos los pedidos web
        console.log('\n📋 Obteniendo pedidos web...');
        const pedidosResponse = await axios.get(`${API_BASE_URL}/pedidos-web`);
        console.log(`✅ Se encontraron ${pedidosResponse.data.length} pedidos web`);

    } catch (error) {
        console.error('❌ Error en la simulación:', error.response?.data || error.message);
    }
}

// Ejecutar simulación
simularPedidosWeb();

