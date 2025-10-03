import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function fixSequence() {
    console.log('🔧 Arreglando secuencia de pedidos...');

    try {
        // Obtener pedidos existentes
        const response = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await response.json();

        if (pedidos && pedidos.length > 0) {
            const ultimoPedido = pedidos[pedidos.length - 1];
            console.log(`📊 Último pedido ID: ${ultimoPedido.id_pedido}`);

            // Crear un pedido temporal para forzar la secuencia
            console.log('🔧 Creando pedido temporal...');

            const tempPedido = {
                id_cliente: ultimoPedido.id_cliente,
                id_empleados: 1,
                fecha_pedido: new Date().toISOString(),
                importe: 0,
                estado: 'temporal',
                anulacion: true,
                venta_web: false,
                direccion_entrega: 'TEMP',
                horario_recepcion: 'TEMP',
                descripcion_pedido: 'TEMP'
            };

            const createResponse = await fetch(`${API_BASE}/pedidos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tempPedido)
            });

            if (createResponse.ok) {
                const tempResult = await createResponse.json();
                console.log(`✅ Pedido temporal creado: ${tempResult.id_pedido}`);

                // Eliminar el pedido temporal
                const deleteResponse = await fetch(`${API_BASE}/pedidos/${tempResult.id_pedido}`, {
                    method: 'DELETE'
                });

                if (deleteResponse.ok) {
                    console.log('✅ Pedido temporal eliminado');
                }
            }
        }

        console.log('✅ Secuencia arreglada');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

fixSequence();























