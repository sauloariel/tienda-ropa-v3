/**
 * Utilidades para manejo de precios
 */

/**
 * Convierte un precio a número, manejando tanto strings como números
 * @param price - Precio que puede ser string o number
 * @returns Número válido o 0 si no se puede convertir
 */
export const parsePrice = (price: string | number | null | undefined): number => {
    if (typeof price === 'number') {
        return isNaN(price) ? 0 : price;
    }

    if (typeof price === 'string') {
        const parsed = parseFloat(price);
        return isNaN(parsed) ? 0 : parsed;
    }

    return 0;
};

/**
 * Formatea un precio como moneda argentina
 * @param price - Precio a formatear
 * @returns String formateado como moneda
 */
export const formatPrice = (price: string | number | null | undefined): string => {
    const numericPrice = parsePrice(price);
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(numericPrice);
};

/**
 * Valida que un precio sea válido
 * @param price - Precio a validar
 * @returns true si el precio es válido y mayor a 0
 */
export const isValidPrice = (price: string | number | null | undefined): boolean => {
    const numericPrice = parsePrice(price);
    return numericPrice > 0;
};













