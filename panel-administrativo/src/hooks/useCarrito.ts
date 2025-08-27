import { useState, useCallback, useMemo } from 'react'
import { ItemCarrito, VarianteVenta } from '../types/ventas.types'

export const useCarrito = () => {
    const [items, setItems] = useState<ItemCarrito[]>([])

    // Agregar item al carrito
    const agregarItem = useCallback((item: Omit<ItemCarrito, 'subtotal'>) => {
        setItems(prevItems => {
            // Verificar si ya existe el mismo producto con la misma variante
            const existingItemIndex = prevItems.findIndex(
                existing => existing.id_producto === item.id_producto &&
                    existing.id_variante === item.id_variante
            )

            if (existingItemIndex >= 0) {
                // Actualizar cantidad existente
                const updatedItems = [...prevItems]
                const existingItem = updatedItems[existingItemIndex]
                const nuevaCantidad = existingItem.cantidad + item.cantidad

                // Validar que no supere el stock
                if (nuevaCantidad > item.stock_disponible) {
                    throw new Error(`Stock insuficiente. Disponible: ${item.stock_disponible}`)
                }

                updatedItems[existingItemIndex] = {
                    ...existingItem,
                    cantidad: nuevaCantidad,
                    subtotal: nuevaCantidad * existingItem.precio_unitario
                }

                return updatedItems
            } else {
                // Agregar nuevo item
                const nuevoItem: ItemCarrito = {
                    ...item,
                    subtotal: item.cantidad * item.precio_unitario
                }
                return [...prevItems, nuevoItem]
            }
        })
    }, [])

    // Actualizar cantidad de un item
    const actualizarCantidad = useCallback((index: number, nuevaCantidad: number) => {
        setItems(prevItems => {
            const updatedItems = [...prevItems]
            const item = updatedItems[index]

            if (nuevaCantidad > item.stock_disponible) {
                throw new Error(`Stock insuficiente. Disponible: ${item.stock_disponible}`)
            }

            if (nuevaCantidad <= 0) {
                // Remover item si cantidad es 0 o menor
                return prevItems.filter((_, i) => i !== index)
            }

            updatedItems[index] = {
                ...item,
                cantidad: nuevaCantidad,
                subtotal: nuevaCantidad * item.precio_unitario
            }

            return updatedItems
        })
    }, [])

    // Remover item del carrito
    const removerItem = useCallback((index: number) => {
        setItems(prevItems => prevItems.filter((_, i) => i !== index))
    }, [])

    // Limpiar carrito
    const limpiarCarrito = useCallback(() => {
        setItems([])
    }, [])

    // Calcular total del carrito
    const total = useMemo(() => {
        return items.reduce((sum, item) => sum + item.subtotal, 0)
    }, [items])

    // Calcular cantidad total de items
    const cantidadTotal = useMemo(() => {
        return items.reduce((sum, item) => sum + item.cantidad, 0)
    }, [items])

    // Verificar si el carrito está vacío
    const carritoVacio = useMemo(() => items.length === 0, [items])

    // Obtener item por índice
    const obtenerItem = useCallback((index: number) => {
        return items[index]
    }, [items])

    // Verificar stock disponible para una variante
    const verificarStock = useCallback((idProducto: number, idVariante: number, cantidad: number) => {
        const item = items.find(
            item => item.id_producto === idProducto && item.id_variante === idVariante
        )

        if (item) {
            return item.stock_disponible - item.cantidad >= cantidad
        }

        return true
    }, [items])

    return {
        items,
        total,
        cantidadTotal,
        carritoVacio,
        agregarItem,
        actualizarCantidad,
        removerItem,
        limpiarCarrito,
        obtenerItem,
        verificarStock
    }
}
