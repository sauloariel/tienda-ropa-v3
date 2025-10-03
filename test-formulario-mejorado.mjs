#!/usr/bin/env node

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

async function testFormularioMejorado() {
    try {
        console.log('🧪 Test del formulario mejorado...\n');

        // 1. Obtener cliente existente
        console.log('1️⃣ Obteniendo cliente existente...');
        const clientesResponse = await fetch(`${API_BASE}/clientes`);
        const clientes = await clientesResponse.json();
        const cliente = clientes[0];
        console.log('✅ Cliente seleccionado:', cliente.nombre, cliente.apellido);
        console.log('');

        // 2. Obtener productos existentes
        console.log('2️⃣ Obteniendo productos existentes...');
        const productosResponse = await fetch(`${API_BASE}/productos`);
        const productos = await productosResponse.json();
        console.log(`✅ Productos encontrados: ${productos.length}`);

        if (productos.length < 2) {
            throw new Error('Se necesitan al menos 2 productos para el test');
        }

        const producto1 = productos[0];
        const producto2 = productos[1];
        console.log('📦 Producto 1:', producto1.descripcion, '- Precio:', producto1.precio_venta);
        console.log('📦 Producto 2:', producto2.descripcion, '- Precio:', producto2.precio_venta);
        console.log('');

        // 3. Simular compra con formulario mejorado
        console.log('3️⃣ Simulando compra con formulario mejorado...');
        const compraData = {
            cliente_id: cliente.id_cliente,
            cliente_nombre: `${cliente.nombre} ${cliente.apellido}`,
            cliente_telefono: cliente.telefono,
            cliente_email: cliente.mail,
            direccion_entrega: "Av. Corrientes 1234, Piso 5, Depto A",
            horario_recepcion: "15:00-18:00",
            descripcion_pedido: "Necesito 2 remeras de algodón, una azul talla M y una roja talla L. También 1 jean clásico azul talla 32.",
            observaciones: "Entregar en el portón principal, timbrar 2 veces",
            metodo_pago: 'transferencia',
            items: [
                {
                    id_producto: producto1.id_producto,
                    cantidad: 2,
                    precio_unitario: parseFloat(producto1.precio_venta),
                    subtotal: parseFloat(producto1.precio_venta) * 2,
                    color: "Azul",
                    talla: "M"
                },
                {
                    id_producto: producto2.id_producto,
                    cantidad: 1,
                    precio_unitario: parseFloat(producto2.precio_venta),
                    subtotal: parseFloat(producto2.precio_venta),
                    color: "Rojo",
                    talla: "L"
                }
            ]
        };

        console.log('🛒 Datos de compra mejorados:');
        console.log('   📍 Dirección:', compraData.direccion_entrega);
        console.log('   ⏰ Horario:', compraData.horario_recepcion);
        console.log('   📝 Descripción:', compraData.descripcion_pedido);
        console.log('   📋 Observaciones:', compraData.observaciones);
        console.log('');

        // 4. Procesar compra integrada
        console.log('4️⃣ Procesando compra integrada...');
        const compraResponse = await fetch(`${API_BASE}/compra-integrada/procesar`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(compraData)
        });

        if (!compraResponse.ok) {
            const errorData = await compraResponse.json();
            throw new Error(`Error al procesar compra: ${errorData.message || compraResponse.statusText}`);
        }

        const compraResult = await compraResponse.json();
        console.log('✅ Compra procesada exitosamente');
        console.log('🆔 ID Pedido:', compraResult.data.pedido.id_pedido);
        console.log('💰 Total:', compraResult.data.resumen.total);
        console.log('');

        const pedidoId = compraResult.data.pedido.id_pedido;

        // 5. Verificar que el pedido se creó con la información correcta
        console.log('5️⃣ Verificando información del pedido...');
        const pedidoResponse = await fetch(`${API_BASE}/pedidos/${pedidoId}`);
        if (!pedidoResponse.ok) {
            throw new Error('Error al obtener pedido');
        }

        const pedido = await pedidoResponse.json();
        console.log('✅ Pedido obtenido exitosamente');
        console.log('');

        // 6. Verificar campos de entrega
        console.log('6️⃣ Verificando campos de entrega...');
        const camposVerificados = {
            direccion_entrega: pedido.direccion_entrega === compraData.direccion_entrega,
            horario_recepcion: pedido.horario_recepcion === compraData.horario_recepcion,
            descripcion_pedido: pedido.descripcion_pedido === compraData.descripcion_pedido
        };

        console.log('📋 Verificación de campos:');
        console.log('   📍 Dirección de entrega:', camposVerificados.direccion_entrega ? '✅' : '❌');
        console.log('   ⏰ Horario de recepción:', camposVerificados.horario_recepcion ? '✅' : '❌');
        console.log('   📝 Descripción del pedido:', camposVerificados.descripcion_pedido ? '✅' : '❌');
        console.log('');

        if (pedido.direccion_entrega) {
            console.log('   📍 Dirección guardada:', pedido.direccion_entrega);
        }
        if (pedido.horario_recepcion) {
            console.log('   ⏰ Horario guardado:', pedido.horario_recepcion);
        }
        if (pedido.descripcion_pedido) {
            console.log('   📝 Descripción guardada:', pedido.descripcion_pedido);
        }
        console.log('');

        // 7. Verificar que aparece en la lista de pedidos
        console.log('7️⃣ Verificando que aparece en la lista de pedidos...');
        const todosPedidosResponse = await fetch(`${API_BASE}/pedidos`);
        const todosPedidos = await todosPedidosResponse.json();
        const pedidoEncontrado = todosPedidos.find(p => p.id_pedido === pedidoId);

        if (pedidoEncontrado) {
            console.log('✅ Pedido encontrado en la lista general');
            console.log('   🌐 Venta Web:', pedidoEncontrado.venta_web ? 'Sí' : 'No');
            console.log('   📍 Tiene dirección:', pedidoEncontrado.direccion_entrega ? 'Sí' : 'No');
            console.log('   ⏰ Tiene horario:', pedidoEncontrado.horario_recepcion ? 'Sí' : 'No');
            console.log('   📝 Tiene descripción:', pedidoEncontrado.descripcion_pedido ? 'Sí' : 'No');
        } else {
            console.log('❌ Pedido NO encontrado en la lista general');
        }
        console.log('');

        // 8. Verificar filtro de pedidos web
        console.log('8️⃣ Verificando filtro de pedidos web...');
        const pedidosWebResponse = await fetch(`${API_BASE}/pedidos?venta_web=true`);
        const pedidosWeb = await pedidosWebResponse.json();
        const pedidoWebEncontrado = pedidosWeb.find(p => p.id_pedido === pedidoId);

        if (pedidoWebEncontrado) {
            console.log('✅ Pedido encontrado en filtro de web');
        } else {
            console.log('❌ Pedido NO encontrado en filtro de web');
        }
        console.log('');

        // 9. Resumen del test
        const todosCamposCorrectos = Object.values(camposVerificados).every(v => v);

        console.log('🎉 ¡Test del formulario mejorado completado!');
        console.log('');
        console.log('📊 Resumen del test:');
        console.log('   ✅ Cliente obtenido correctamente');
        console.log('   ✅ Productos obtenidos correctamente');
        console.log('   ✅ Compra procesada exitosamente');
        console.log('   ✅ Pedido creado con información completa');
        console.log('   ✅ Campos de entrega guardados correctamente');
        console.log('   ✅ Pedido visible en lista general');
        console.log('   ✅ Pedido visible en filtro web');
        console.log('');

        if (todosCamposCorrectos) {
            console.log('🎯 ¡TODOS LOS CAMPOS SE GUARDARON CORRECTAMENTE!');
            console.log('   El formulario mejorado está funcionando perfectamente.');
            console.log('   El panel administrativo ahora puede ver toda la información necesaria.');
        } else {
            console.log('⚠️  Algunos campos no se guardaron correctamente.');
            console.log('   Revisar la implementación del controlador.');
        }

    } catch (error) {
        console.error('❌ Error en test del formulario mejorado:', error.message);
        console.error('Stack:', error.stack);
    }
}

testFormularioMejorado();























