import simpleApi from './simpleApi';

export interface ProductoFactura {
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
}

export interface FacturaData {
    productos: ProductoFactura[];
    total: number;
    metodo_pago: string;
    cliente_id?: number;
}

export interface Factura {
    id: number;
    numeroFactura: string;
    fecha: string;
    total: number;
    cliente_id?: number;
    id_empleado: number;
    estado: string;
    metodo_pago: string;
    cliente?: {
        id_cliente: number;
        nombre: string;
        apellido: string;
        mail: string;
        telefono: string;
    };
    empleado?: {
        id_empleado: number;
        nombre: string;
        apellido: string;
    };
    detalles: Array<{
        id: number;
        cantidad: number;
        precio_unitario: number;
        subtotal: number;
        producto: {
            id_producto: number;
            descripcion: string;
            precio_venta: number;
        };
    }>;
}

export const facturasAPI = {
    // Crear nueva factura
    create: async (data: FacturaData): Promise<{ success: boolean; factura?: Factura; message?: string }> => {
        try {
            console.log('📝 Creando factura con datos:', data);

            const response = await simpleApi.post('/facturas', data);

            console.log('✅ Factura creada exitosamente:', response.data);
            return {
                success: true,
                factura: response.data.factura
            };
        } catch (error: any) {
            console.error('❌ Error al crear factura:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al crear la factura'
            };
        }
    },

    // Obtener todas las facturas
    getAll: async (): Promise<{ success: boolean; facturas?: Factura[]; message?: string }> => {
        try {
            const response = await simpleApi.get('/facturas');
            return {
                success: true,
                facturas: response.data.facturas
            };
        } catch (error: any) {
            console.error('❌ Error al obtener facturas:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener las facturas'
            };
        }
    },

    // Obtener factura por ID
    getById: async (id: number): Promise<{ success: boolean; factura?: Factura; message?: string }> => {
        try {
            const response = await simpleApi.get(`/facturas/${id}`);
            return {
                success: true,
                factura: response.data.factura
            };
        } catch (error: any) {
            console.error('❌ Error al obtener factura:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener la factura'
            };
        }
    },

    // Obtener siguiente número de factura
    getNextNumber: async (): Promise<{ success: boolean; numero?: string; message?: string }> => {
        try {
            const response = await simpleApi.get('/facturas/next-number');
            return {
                success: true,
                numero: response.data.numero
            };
        } catch (error: any) {
            console.error('❌ Error al obtener siguiente número:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al obtener el siguiente número'
            };
        }
    },

    // Anular factura
    anular: async (id: number): Promise<{ success: boolean; message?: string }> => {
        try {
            await simpleApi.put(`/facturas/${id}/anular`);
            return { success: true };
        } catch (error: any) {
            console.error('❌ Error al anular factura:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Error al anular la factura'
            };
        }
    }
};














