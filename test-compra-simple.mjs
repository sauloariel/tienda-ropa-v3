import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Datos de prueba válidos
const compraData = {
    cliente_id: 1,
    cliente_nombre: "Test Cliente",
    cliente_telefono: "1234567890",
    metodo_pago: "efectivo",
    items: [{
        id_producto: 1,
        cantidad: 1,
        precio_unitario: 29.99,
        subtotal: 29.99
    }]
};

async function testCompraIntegrada() {
    console.log('🧪 Probando compra integrada con datos válidos...');
    console.log('Datos enviados:', JSON.stringify(compraData, null, 2));

    try {
        const response = await fetch(`${API_BASE}/compra-integrada/procesar`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(compraData)
        });

        const data = await response.json();

        console.log(`\n📊 Respuesta del servidor:`);
        console.log(`Status: ${response.status}`);
        console.log(`Datos:`, JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('✅ ¡Compra procesada exitosamente!');
            return true;
        } else {
            console.log('❌ Error en la compra');
            return false;
        }

    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        return false;
    }
}

testCompraIntegrada();


















