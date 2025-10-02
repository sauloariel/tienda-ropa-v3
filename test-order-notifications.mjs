// Script para probar notificaciones de pedidos
import axios from 'axios';

async function testOrderNotifications() {
    try {
        console.log('🧪 Probando sistema de notificaciones de pedidos...\n');

        // 1. Obtener lista de pedidos
        console.log('1️⃣ Obteniendo lista de pedidos...');
        const pedidosResponse = await axios.get('http://localhost:4000/api/pedidos');
        const pedidos = pedidosResponse.data;
        
        if (!pedidos || pedidos.length === 0) {
            console.log('❌ No hay pedidos para probar');
            return;
        }

        const primerPedido = pedidos[0];
        console.log(`✅ Pedido encontrado: #${primerPedido.id_pedido}`);
        console.log(`   Cliente: ${primerPedido.cliente?.nombre || 'N/A'}`);
        console.log(`   Estado actual: ${primerPedido.estado}`);
        console.log(`   Email: ${primerPedido.cliente?.mail || 'N/A'}\n`);

        // 2. Cambiar estado del pedido
        const estados = ['procesando', 'completado', 'entregado'];
        const nuevoEstado = estados[Math.floor(Math.random() * estados.length)];
        
        console.log(`2️⃣ Cambiando estado a: ${nuevoEstado}`);
        const updateResponse = await axios.put(
            `http://localhost:4000/api/pedidos/${primerPedido.id_pedido}/estado`,
            { estado: nuevoEstado }
        );

        console.log('✅ Estado actualizado:', updateResponse.data.message);
        console.log('📧 Email enviado:', updateResponse.data.email_enviado ? 'SÍ' : 'NO');

        // 3. Verificar respuesta
        if (updateResponse.data.email_enviado) {
            console.log('\n🎉 ¡Notificación enviada exitosamente!');
            console.log('📧 Revisa el email del cliente para ver la notificación');
        } else {
            console.log('\n⚠️ Email no enviado. Verifica la configuración de EmailJS');
        }

    } catch (error) {
        console.error('❌ Error en la prueba:', error.response?.data || error.message);
    }
}

// Ejecutar prueba
testOrderNotifications();
