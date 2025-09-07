import { api } from './api';

// Usar la instancia compartida de axios
const facturaAPI = api;

// Crear nueva factura
export const crearFactura = async (facturaData: any): Promise<any> => {
    try {
        const response = await facturaAPI.post('/facturas', facturaData);
        return response.data;
    } catch (error: any) {
        console.error('Error al crear factura:', error);
        throw new Error(error.response?.data?.error || 'Error al crear la factura');
    }
};

// Obtener todas las facturas
export const obtenerFacturas = async (fechaInicio?: string, fechaFin?: string, estado?: string): Promise<any> => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);
        if (estado) params.append('estado', estado);

        const response = await facturaAPI.get(`/facturas?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener facturas:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener las facturas');
    }
};

// Obtener factura por ID
export const obtenerFacturaPorId = async (id: number): Promise<any> => {
    try {
        const response = await facturaAPI.get(`/facturas/${id}`);
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener factura:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener la factura');
    }
};

// Obtener estadísticas de facturas
export const obtenerEstadisticasFacturas = async (fechaInicio?: string, fechaFin?: string): Promise<any> => {
    try {
        const params = new URLSearchParams();
        if (fechaInicio) params.append('fecha_inicio', fechaInicio);
        if (fechaFin) params.append('fecha_fin', fechaFin);

        const response = await facturaAPI.get(`/facturas/estadisticas?${params.toString()}`);
        return response.data;
    } catch (error: any) {
        console.error('Error al obtener estadísticas:', error);
        throw new Error(error.response?.data?.error || 'Error al obtener las estadísticas');
    }
};

// Anular factura
export const anularFactura = async (id: number): Promise<{ success: boolean; message: string }> => {
    try {
        const response = await facturaAPI.put(`/facturas/${id}/anular`);
        return response.data;
    } catch (error: any) {
        console.error('Error al anular factura:', error);
        throw new Error(error.response?.data?.error || 'Error al anular la factura');
    }
};

// Función para generar PDF de factura (usando html2pdf.js)
export const generarPDFFactura = async (factura: any): Promise<void> => {
    try {
        // Importar html2pdf.js dinámicamente
        const html2pdf = (await import('html2pdf.js')).default;

        // Crear el contenido HTML de la factura
        const contenidoHTML = `
            <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <div style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px;">
                    <h1 style="color: #333; margin: 0;">FACTURA</h1>
                    <h2 style="color: #666; margin: 10px 0;">${factura.numeroFactura}</h2>
                    <p style="color: #666; margin: 5px 0;">Fecha: ${new Date(factura.fecha).toLocaleDateString('es-ES')}</p>
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Información del Cliente</h3>
                    ${factura.cliente ? `
                        <p><strong>Nombre:</strong> ${factura.cliente.nombre}</p>
                        <p><strong>Email:</strong> ${factura.cliente.email || 'N/A'}</p>
                        <p><strong>Teléfono:</strong> ${factura.cliente.telefono || 'N/A'}</p>
                    ` : '<p><strong>Cliente:</strong> Consumidor Final</p>'}
                </div>
                
                <div style="margin-bottom: 30px;">
                    <h3 style="color: #333; border-bottom: 1px solid #ccc; padding-bottom: 10px;">Detalle de Productos</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                        <thead>
                            <tr style="background-color: #f5f5f5;">
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: left;">Producto</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: center;">Cantidad</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Precio Unit.</th>
                                <th style="border: 1px solid #ddd; padding: 12px; text-align: right;">Subtotal</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${factura.detalles.map((detalle: any) => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 12px;">${detalle.producto?.nombre || 'Producto'}</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: center;">${detalle.cantidad}</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${detalle.precio_unitario.toFixed(2)}</td>
                                    <td style="border: 1px solid #ddd; padding: 12px; text-align: right;">$${detalle.subtotal.toFixed(2)}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                
                <div style="text-align: right; border-top: 2px solid #333; padding-top: 20px;">
                    <h2 style="color: #333; margin: 0;">Total: $${factura.total.toFixed(2)}</h2>
                    <p style="color: #666; margin: 5px 0;">Método de Pago: ${factura.metodo_pago}</p>
                    <p style="color: #666; margin: 5px 0;">Estado: ${factura.estado}</p>
                </div>
                
                <div style="margin-top: 40px; text-align: center; color: #666; font-size: 12px;">
                    <p>Gracias por su compra</p>
                    <p>Esta factura fue generada automáticamente por el sistema POS</p>
                </div>
            </div>
        `;

        // Configuración para la generación del PDF
        const opt = {
            margin: 1,
            filename: `factura-${factura.numeroFactura}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
        };

        // Generar y descargar el PDF
        html2pdf().from(contenidoHTML).set(opt).save();

    } catch (error) {
        console.error('Error al generar PDF:', error);
        throw new Error('Error al generar el PDF de la factura');
    }
};
