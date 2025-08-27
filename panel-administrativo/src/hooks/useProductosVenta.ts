import { useState, useEffect, useCallback } from 'react'
import { ProductoVenta } from '../types/ventas.types'
import { productosAPI } from '../services/productos'

export const useProductosVenta = () => {
    const [productos, setProductos] = useState<ProductoVenta[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [selectedCategoria, setSelectedCategoria] = useState<number>(0)

    // Cargar productos
    const cargarProductos = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const productosData = await productosAPI.getProductos()

            // Filtrar solo productos activos y con variantes
            const productosFiltrados = productosData.filter(producto =>
                producto.estado === 'ACTIVO' &&
                producto.variantes &&
                producto.variantes.length > 0
            )

            setProductos(productosFiltrados)
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al cargar productos')
            console.error('Error cargando productos:', err)
        } finally {
            setLoading(false)
        }
    }, [])

    // Cargar productos al montar el componente
    useEffect(() => {
        cargarProductos()
    }, [cargarProductos])

    // Filtrar productos por búsqueda y categoría
    const productosFiltrados = productos.filter(producto => {
        const matchesSearch = producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (producto.categoria?.nombre_categoria || '').toLowerCase().includes(searchTerm.toLowerCase())

        const matchesCategoria = selectedCategoria === 0 || producto.id_categoria === selectedCategoria

        return matchesSearch && matchesCategoria
    })

    // Obtener categorías únicas
    const categorias = Array.from(new Set(productos.map(p => p.id_categoria)))
        .map(id => productos.find(p => p.id_categoria === id)?.categoria)
        .filter(Boolean)

    // Obtener producto por ID
    const obtenerProducto = useCallback((id: number) => {
        return productos.find(p => p.id_producto === id)
    }, [productos])

    // Obtener variante por ID
    const obtenerVariante = useCallback((idProducto: number, idVariante: number) => {
        const producto = obtenerProducto(idProducto)
        return producto?.variantes.find(v => v.id_variante === idVariante)
    }, [obtenerProducto])

    // Verificar stock disponible para una variante
    const verificarStockDisponible = useCallback((idProducto: number, idVariante: number) => {
        const variante = obtenerVariante(idProducto, idVariante)
        return variante?.stock || 0
    }, [obtenerVariante])

    return {
        productos: productosFiltrados,
        categorias,
        loading,
        error,
        searchTerm,
        setSearchTerm,
        selectedCategoria,
        setSelectedCategoria,
        cargarProductos,
        obtenerProducto,
        obtenerVariante,
        verificarStockDisponible
    }
}
