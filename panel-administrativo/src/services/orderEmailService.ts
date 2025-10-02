import emailjs from '@emailjs/browser';

// Configuración de EmailJS para notificaciones de pedidos
const EMAILJS_SERVICE_ID = 'service_qxnyfzk';
const EMAILJS_TEMPLATE_ID = 'template_order_status';
const EMAILJS_PUBLIC_KEY = 'CIEawmID0xf-Hl2L1';

// Inicializar EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

interface OrderNotificationParams {
    to_email: string;
    to_name: string;
    order_id: string;
    order_status: string;
    order_date: string;
    order_total: string;
    company_name: string;
    message: string;
    user_email: string;
    recipient_email: string;
    email: string;
    recipient: string;
    client_email: string;
    customer_email: string;
    from_name: string;
    from_email: string;
    reply_to: string;
    [key: string]: string;
}

/**
 * Enviar notificación de cambio de estado de pedido desde el panel administrativo
 * @param email - Email del cliente
 * @param nombre - Nombre del cliente
 * @param pedidoId - ID del pedido
 * @param estadoAnterior - Estado anterior del pedido
 * @param estadoNuevo - Nuevo estado del pedido
 * @param fechaPedido - Fecha del pedido
 * @param importe - Importe total del pedido
 * @returns Promise<boolean> - true si se envió correctamente
 */
export const sendOrderStatusNotification = async (
    email: string,
    nombre: string,
    pedidoId: number,
    estadoAnterior: string,
    estadoNuevo: string,
    fechaPedido: Date,
    importe: number
): Promise<boolean> => {
    try {
        // Mapear estados a mensajes más amigables
        const estadoMessages: { [key: string]: string } = {
            'pendiente': 'Pendiente',
            'procesando': 'En Proceso',
            'completado': 'Completado',
            'entregado': 'Entregado',
            'cancelado': 'Cancelado',
            'anulado': 'Anulado'
        };

        const estadoAnteriorMsg = estadoMessages[estadoAnterior] || estadoAnterior;
        const estadoNuevoMsg = estadoMessages[estadoNuevo] || estadoNuevo;

        // Crear mensaje personalizado según el estado
        let mensajePersonalizado = '';
        switch (estadoNuevo) {
            case 'procesando':
                mensajePersonalizado = `¡Excelente! Tu pedido #${pedidoId} ha comenzado a procesarse. Estamos preparando tu compra.`;
                break;
            case 'completado':
                mensajePersonalizado = `¡Genial! Tu pedido #${pedidoId} está listo. Pronto será enviado o estará disponible para retirar.`;
                break;
            case 'entregado':
                mensajePersonalizado = `¡Perfecto! Tu pedido #${pedidoId} ha sido entregado. ¡Esperamos que disfrutes tu compra!`;
                break;
            case 'cancelado':
            case 'anulado':
                mensajePersonalizado = `Tu pedido #${pedidoId} ha sido ${estadoNuevoMsg.toLowerCase()}. Si tienes dudas, contáctanos.`;
                break;
            default:
                mensajePersonalizado = `El estado de tu pedido #${pedidoId} ha cambiado de "${estadoAnteriorMsg}" a "${estadoNuevoMsg}".`;
        }

        // Parámetros del template Order Status Notification
        const templateParams: OrderNotificationParams = {
            // Parámetros principales
            to_email: email,
            to_name: nombre,
            order_id: pedidoId.toString(),
            order_status: estadoNuevoMsg,
            order_date: fechaPedido.toLocaleDateString('es-ES'),
            order_total: `$${Number(importe).toFixed(2)}`,
            company_name: 'Tu Tienda Online',
            message: mensajePersonalizado,

            // Parámetros alternativos para compatibilidad
            user_email: email,
            recipient_email: email,
            email: email,
            recipient: email,
            client_email: email,
            customer_email: email,

            // Parámetros adicionales del template de verificación (por si acaso)
            from_name: 'Equipo de Pedidos',
            from_email: 'noreply@tienda.com',
            reply_to: 'noreply@tienda.com'
        };

        console.log('📧 Enviando notificación de pedido desde panel administrativo...');
        console.log('📧 Destinatario:', email);
        console.log('📦 Pedido:', pedidoId);
        console.log('🔄 Estado:', `${estadoAnterior} → ${estadoNuevo}`);

        // Intentar primero con el template de pedidos
        try {
            const response = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log('✅ Notificación de pedido enviada:', response.status, response.text);
            return true;
        } catch (error) {
            console.warn('⚠️ Error con template de pedidos, probando template de verificación...');

            // Fallback: usar el template de verificación que sabemos que funciona
            const fallbackParams = {
                to_email: email,
                to_name: nombre,
                from_name: 'Equipo de Pedidos',
                from_email: 'noreply@tienda.com',
                message: mensajePersonalizado,
                reply_to: 'noreply@tienda.com'
            };

            const fallbackResponse = await emailjs.send(
                EMAILJS_SERVICE_ID,
                'template_zmw434n', // Template de verificación
                fallbackParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log('✅ Notificación enviada con template de fallback:', fallbackResponse.status, fallbackResponse.text);
            return true;
        }
    } catch (error) {
        console.error('❌ Error enviando notificación de pedido:', error);
        return false;
    }
};

/**
 * Verificar si EmailJS está configurado correctamente
 * @returns boolean - true si está configurado
 */
export const isOrderEmailConfigured = (): boolean => {
    const isConfigured = (
        EMAILJS_SERVICE_ID !== 'service_xxxxxx' &&
        EMAILJS_TEMPLATE_ID !== 'template_xxxxxx' &&
        EMAILJS_PUBLIC_KEY !== 'your_public_key'
    );

    if (!isConfigured) {
        console.warn('⚠️ EmailJS no está configurado para notificaciones de pedidos.');
    }

    return isConfigured;
};

export default {
    sendOrderStatusNotification,
    isOrderEmailConfigured,
};
