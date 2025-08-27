import api from './api';
import type { Producto } from '../types/productos.types';

export interface CartItem {
    producto: Producto;
    cantidad: number;
    precioUnitario: number;
}

export interface Venta {
    id_venta?: number;
    fecha_venta: Date;
    total: number;
    metodo_pago: string;
    items: VentaItem[];
    cliente_id?: number;
    empleado_id?: number;
}

export interface VentaItem {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface VentaResponse {
    success: boolean;
    message: string;
    venta_id?: number;
    error?: string;
}

// Servicio para el sistema POS
export const posService = {
    // Registrar una nueva venta
    registrarVenta: async (venta: Venta): Promise<VentaResponse> => {
        try {
            console.log('🔄 Registrando venta en el backend:', venta);

            const response = await api.post('/ventas', {
                fecha_venta: venta.fecha_venta.toISOString(),
                total: venta.total,
                metodo_pago: venta.metodo_pago,
                cliente_id: venta.cliente_id || null,
                empleado_id: venta.empleado_id || null,
                items: venta.items.map(item => ({
                    id_producto: item.id_producto,
                    cantidad: item.cantidad,
                    precio_unitario: item.precio_unitario,
                    subtotal: item.subtotal
                }))
            });

            console.log('✅ Venta registrada exitosamente:', response.data);

            return {
                success: true,
                message: 'Venta registrada exitosamente',
                venta_id: response.data.id_venta
            };
        } catch (error: any) {
            console.error('❌ Error al registrar venta:', error);

            return {
                success: false,
                message: 'Error al registrar la venta',
                error: error.response?.data?.error || error.message
            };
        }
    },

    // Obtener historial de ventas
    obtenerHistorialVentas: async (fechaInicio?: Date, fechaFin?: Date): Promise<any[]> => {
        try {
            let url = '/ventas';
            const params = new URLSearchParams();

            if (fechaInicio) {
                params.append('fecha_inicio', fechaInicio.toISOString());
            }
            if (fechaFin) {
                params.append('fecha_fin', fechaFin.toISOString());
            }

            if (params.toString()) {
                url += `?${params.toString()}`;
            }

            const response = await api.get(url);
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener historial de ventas:', error);
            throw error;
        }
    },

    // Obtener estadísticas de ventas
    obtenerEstadisticasVentas: async (): Promise<any> => {
        try {
            const response = await api.get('/ventas/estadisticas');
            return response.data;
        } catch (error: any) {
            console.error('Error al obtener estadísticas de ventas:', error);
            throw error;
        }
    },

    // Actualizar stock después de una venta
    actualizarStock: async (productoId: number, cantidadVendida: number): Promise<boolean> => {
        try {
            const response = await api.put(`/productos/${productoId}/stock`, {
                cantidad_vendida: cantidadVendida
            });

            console.log('✅ Stock actualizado:', response.data);
            return true;
        } catch (error: any) {
            console.error('❌ Error al actualizar stock:', error);
            return false;
        }
    },

    // Verificar disponibilidad de stock
    verificarStock: async (productoId: number, cantidadSolicitada: number): Promise<boolean> => {
        try {
            const response = await api.get(`/productos/${productoId}`);
            const producto = response.data;

            return producto.stock >= cantidadSolicitada;
        } catch (error: any) {
            console.error('Error al verificar stock:', error);
            return false;
        }
    },

    // Generar ticket de venta
    generarTicket: (venta: Venta): string => {
        const fecha = new Date().toLocaleString();
        const ticket = `
╔══════════════════════════════════════════════════════════════╗
║                    SUPERMERCADO                             ║
║                    TICKET DE VENTA                          ║
╠══════════════════════════════════════════════════════════════╣
║ Fecha: ${fecha.padEnd(50)} ║
║ Método de Pago: ${venta.metodo_pago.padEnd(40)} ║
╠══════════════════════════════════════════════════════════════╣
║ PRODUCTO                    CANT.  PRECIO    SUBTOTAL      ║
╠══════════════════════════════════════════════════════════════╣
${venta.items.map(item => {
            const nombre = item.producto?.descripcion || `Producto ${item.id_producto}`;
            const nombreTruncado = nombre.length > 25 ? nombre.substring(0, 22) + '...' : nombre.padEnd(25);
            const cantidad = item.cantidad.toString().padStart(5);
            const precio = item.precio_unitario.toFixed(2).padStart(8);
            const subtotal = item.subtotal.toFixed(2).padStart(10);
            return `║ ${nombreTruncado} ${cantidad} ${precio} ${subtotal}      ║`;
        }).join('\n')}
╠══════════════════════════════════════════════════════════════╣
║ TOTAL: ${venta.total.toFixed(2).padStart(50)} ║
║ IVA (21%): ${(venta.total * 0.21).toFixed(2).padStart(45)} ║
║ TOTAL CON IVA: ${(venta.total * 1.21).toFixed(2).padStart(40)} ║
╠══════════════════════════════════════════════════════════════╣
║                    ¡GRACIAS POR SU COMPRA!                  ║
║                    VUELVA PRONTO                            ║
╚══════════════════════════════════════════════════════════════╝
    `;

        return ticket;
    }
};

export default posService;

