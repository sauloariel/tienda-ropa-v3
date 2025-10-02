// Test directo del sistema de notificaciones de pedidos
import axios from 'axios';

async function testOrderEmailSystem() {
    try {
        console.log('🧪 Test del Sistema de Notificaciones de Pedidos');
        console.log('='.repeat(50));

        // 1. Verificar que el backend esté funcionando
        console.log('1️⃣ Verificando backend...');
        const healthResponse = await axios.get('http://localhost:4000/api/health');
        console.log('✅ Backend funcionando:', healthResponse.data);

        // 2. Obtener pedido específico (ID 40)
        console.log('\n2️⃣ Obteniendo pedido #40...');
        const pedidoResponse = await axios.get('http://localhost:4000/api/pedidos/40');
        const pedido = pedidoResponse.data;
        console.log('✅ Pedido encontrado:');
        console.log('   ID:', pedido.id_pedido);
        console.log('   Cliente:', pedido.cliente.nombre, pedido.cliente.apellido);
        console.log('   Email:', pedido.cliente.mail);
        console.log('   Estado actual:', pedido.estado);
        console.log('   Importe:', pedido.importe);

        // 3. Test directo de EmailJS
        console.log('\n3️⃣ Test directo de EmailJS...');
        const emailjsUrl = 'https://api.emailjs.com/api/v1.0/email/send';
        const emailjsData = {
            service_id: 'service_qxnyfzk',
            template_id: 'template_zmw434n',
            user_id: 'CIEawmID0xf-Hl2L1',
            template_params: {
                to_email: pedido.cliente.mail,
                to_name: `${pedido.cliente.nombre} ${pedido.cliente.apellido}`,
                order_id: pedido.id_pedido.toString(),
                order_status: 'Test',
                order_date: new Date(pedido.fecha_pedido).toLocaleDateString('es-ES'),
                order_total: `$${pedido.importe}`,
                company_name: 'Tu Tienda Online',
                from_name: 'Equipo de Pedidos',
                from_email: 'noreply@tienda.com',
                message: `Test de notificación para pedido #${pedido.id_pedido}`,
                reply_to: 'noreply@tienda.com'
            }
        };

        console.log('📧 Enviando email de prueba...');
        const emailResponse = await axios.post(emailjsUrl, emailjsData, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        console.log('✅ Email enviado exitosamente:', emailResponse.status);
        console.log('📧 Revisa el email:', pedido.cliente.mail);

        // 4. Test del endpoint de cambio de estado
        console.log('\n4️⃣ Test del endpoint de cambio de estado...');
        const estadoAnterior = pedido.estado;
        const nuevoEstado = estadoAnterior === 'pendiente' ? 'procesando' : 'pendiente';

        console.log(`🔄 Cambiando estado de "${estadoAnterior}" a "${nuevoEstado}"...`);
        const updateResponse = await axios.put(
            `http://localhost:4000/api/pedidos/${pedido.id_pedido}/estado`,
            { estado: nuevoEstado }
        );

        console.log('✅ Estado actualizado:', updateResponse.data.message);
        console.log('📧 Email enviado:', updateResponse.data.email_enviado ? 'SÍ' : 'NO');

        if (updateResponse.data.email_enviado) {
            console.log('\n🎉 ¡Sistema funcionando correctamente!');
            console.log('📧 Revisa el email del cliente para ver la notificación');
        } else {
            console.log('\n⚠️ Email no enviado. Revisando logs del backend...');
        }

    } catch (error) {
        console.error('❌ Error en el test:', error.response?.data || error.message);

        if (error.response?.status === 404) {
            console.log('💡 Sugerencia: El pedido #40 puede no existir. Crear uno nuevo.');
        }
    }
}

// Ejecutar test
testOrderEmailSystem();
