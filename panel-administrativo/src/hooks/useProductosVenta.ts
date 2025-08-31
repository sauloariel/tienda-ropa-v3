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

            // Convertir Producto[] a ProductoVenta[]
            const productosVenta: ProductoVenta[] = productosFiltrados.map(producto => ({
                id_producto: producto.id_producto,
                descripcion: producto.descripcion,
                precio_venta: producto.precio_venta,
                stock: producto.stock || 0,
                variantes: producto.variantes?.map(v => ({
                    id_variante: v.id_variante,
                    id_color: v.id_color,
                    id_talla: v.id_talle, // Corregido: id_talle en lugar de id_talla
                    stock: v.stock,
                    precio_venta: v.precio_venta,
                    color: v.color ? { id_color: v.color.id_color, nombre: v.color.nombre } : { id_color: 0, nombre: '' },
                    talla: v.talla ? { id_talla: v.talla.id_talla, nombre: v.talla.nombre, id_tipo_talle: v.talla.id_tipo_talle } : { id_talla: 0, nombre: '', id_tipo_talle: 0 }
                })) || [],
                imagenes: producto.imagenes?.map(img => img.ruta || '') || []
            }))

            setProductos(productosVenta)
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

    // Filtrar productos por búsqueda
    const productosFiltrados = productos.filter(producto => {
        const matchesSearch = producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase())

        // Por ahora, no filtramos por categoría ya que ProductoVenta no tiene esa información
        return matchesSearch
    })

    // Por ahora, categorías vacías ya que ProductoVenta no tiene información de categoría
    const categorias: any[] = []

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
