import { useState, useCallback } from 'react';

interface FacturaSession {
    numeroFactura: string | null;
    items: any[];
    cliente: any | null;
    descuento: any | null;
    metodoPago: string | null;
    total: number;
    subtotal: number;
    iva: number;
}

export const useFacturaSession = () => {
    const [session, setSession] = useState<FacturaSession>({
        numeroFactura: null,
        items: [],
        cliente: null,
        descuento: null,
        metodoPago: null,
        total: 0,
        subtotal: 0,
        iva: 0
    });

    // Iniciar nueva sesión de factura
    const iniciarSesion = useCallback(() => {
        const numeroFactura = `TEMP-${Date.now()}`;
        setSession({
            numeroFactura,
            items: [],
            cliente: null,
            descuento: null,
            metodoPago: null,
            total: 0,
            subtotal: 0,
            iva: 0
        });
        return numeroFactura;
    }, []);

    // Agregar item a la sesión
    const agregarItem = useCallback((item: any) => {
        setSession(prev => {
            const existingItem = prev.items.find(i => i.producto.id_producto === item.producto.id_producto);

            let newItems;
            if (existingItem) {
                newItems = prev.items.map(i =>
                    i.producto.id_producto === item.producto.id_producto
                        ? { ...i, cantidad: i.cantidad + item.cantidad }
                        : i
                );
            } else {
                newItems = [...prev.items, item];
            }

            const subtotal = newItems.reduce((sum, i) => sum + (i.precioUnitario * i.cantidad), 0);
            const descuento = prev.descuento ? calcularDescuento(prev.descuento, subtotal) : 0;
            const subtotalConDescuento = subtotal - descuento;
            const iva = subtotalConDescuento * 0.21;
            const total = subtotalConDescuento + iva;

            return {
                ...prev,
                items: newItems,
                subtotal,
                iva,
                total
            };
        });
    }, []);

    // Actualizar cantidad de item
    const actualizarCantidad = useCallback((productoId: number, cantidad: number) => {
        setSession(prev => {
            if (cantidad <= 0) {
                const newItems = prev.items.filter(i => i.producto.id_producto !== productoId);
                const subtotal = newItems.reduce((sum, i) => sum + (i.precioUnitario * i.cantidad), 0);
                const descuento = prev.descuento ? calcularDescuento(prev.descuento, subtotal) : 0;
                const subtotalConDescuento = subtotal - descuento;
                const iva = subtotalConDescuento * 0.21;
                const total = subtotalConDescuento + iva;

                return {
                    ...prev,
                    items: newItems,
                    subtotal,
                    iva,
                    total
                };
            }

            const newItems = prev.items.map(i =>
                i.producto.id_producto === productoId
                    ? { ...i, cantidad }
                    : i
            );

            const subtotal = newItems.reduce((sum, i) => sum + (i.precioUnitario * i.cantidad), 0);
            const descuento = prev.descuento ? calcularDescuento(prev.descuento, subtotal) : 0;
            const subtotalConDescuento = subtotal - descuento;
            const iva = subtotalConDescuento * 0.21;
            const total = subtotalConDescuento + iva;

            return {
                ...prev,
                items: newItems,
                subtotal,
                iva,
                total
            };
        });
    }, []);

    // Remover item de la sesión
    const removerItem = useCallback((productoId: number) => {
        setSession(prev => {
            const newItems = prev.items.filter(i => i.producto.id_producto !== productoId);
            const subtotal = newItems.reduce((sum, i) => sum + (i.precioUnitario * i.cantidad), 0);
            const descuento = prev.descuento ? calcularDescuento(prev.descuento, subtotal) : 0;
            const subtotalConDescuento = subtotal - descuento;
            const iva = subtotalConDescuento * 0.21;
            const total = subtotalConDescuento + iva;

            return {
                ...prev,
                items: newItems,
                subtotal,
                iva,
                total
            };
        });
    }, []);

    // Establecer cliente
    const establecerCliente = useCallback((cliente: any) => {
        setSession(prev => ({ ...prev, cliente }));
    }, []);

    // Establecer descuento
    const establecerDescuento = useCallback((descuento: any) => {
        setSession(prev => {
            const subtotal = prev.items.reduce((sum, i) => sum + (i.precioUnitario * i.cantidad), 0);
            const descuentoCalculado = descuento ? calcularDescuento(descuento, subtotal) : 0;
            const subtotalConDescuento = subtotal - descuentoCalculado;
            const iva = subtotalConDescuento * 0.21;
            const total = subtotalConDescuento + iva;

            return {
                ...prev,
                descuento,
                subtotal,
                iva,
                total
            };
        });
    }, []);

    // Establecer método de pago
    const establecerMetodoPago = useCallback((metodoPago: string) => {
        setSession(prev => ({ ...prev, metodoPago }));
    }, []);

    // Limpiar sesión
    const limpiarSesion = useCallback(() => {
        setSession({
            numeroFactura: null,
            items: [],
            cliente: null,
            descuento: null,
            metodoPago: null,
            total: 0,
            subtotal: 0,
            iva: 0
        });
    }, []);

    // Obtener datos para factura
    const obtenerDatosFactura = useCallback(() => {
        return {
            productos: session.items.map(item => ({
                id_producto: item.producto.id_producto,
                cantidad: item.cantidad,
                precio_unitario: item.precioUnitario,
                subtotal: item.precioUnitario * item.cantidad
            })),
            total: session.total,
            metodo_pago: session.metodoPago || 'efectivo',
            cliente_id: session.cliente?.id_cliente || undefined,
            descuento: session.descuento ? {
                tipo: session.descuento.tipo,
                valor: session.descuento.valor,
                monto: calcularDescuento(session.descuento, session.subtotal)
            } : undefined
        };
    }, [session]);

    return {
        session,
        iniciarSesion,
        agregarItem,
        actualizarCantidad,
        removerItem,
        establecerCliente,
        establecerDescuento,
        establecerMetodoPago,
        limpiarSesion,
        obtenerDatosFactura
    };
};

// Función auxiliar para calcular descuento
const calcularDescuento = (descuento: any, subtotal: number): number => {
    if (!descuento) return 0;
    if (descuento.tipo === 'porcentaje') {
        return (subtotal * descuento.valor) / 100;
    } else {
        return Math.min(descuento.valor, subtotal);
    }
};
