import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function fixSequence() {
    console.log('🔧 Arreglando secuencia de pedidos...');

    try {
        // Obtener el último pedido
        const response = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await response.json();

        if (pedidos && pedidos.length > 0) {
            const ultimoPedido = pedidos[pedidos.length - 1];
            console.log(`Último pedido ID: ${ultimoPedido.id_pedido}`);

            // Hacer una llamada para resetear la secuencia
            const resetResponse = await fetch(`${API_BASE}/pedidos/reset-sequence`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ lastId: ultimoPedido.id_pedido })
            });

            if (resetResponse.ok) {
                console.log('✅ Secuencia reseteada');
            } else {
                console.log('⚠️ No hay endpoint para resetear secuencia, continuando...');
            }
        } else {
            console.log('No hay pedidos existentes');
        }

    } catch (error) {
        console.log('⚠️ Error al resetear secuencia:', error.message);
    }
}

fixSequence();























