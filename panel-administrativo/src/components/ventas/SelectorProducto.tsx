import React, { useState } from 'react'
import { ProductoVenta, VarianteVenta } from '../../types/ventas.types'
import { Search, Package, Palette, Ruler, Plus } from 'lucide-react'

interface SelectorProductoProps {
  productos: ProductoVenta[]
  onAgregarAlCarrito: (item: {
    id_producto: number
    id_variante: number
    descripcion: string
    color: string
    talla: string
    precio_unitario: number
    cantidad: number
    stock_disponible: number
  }) => void
  searchTerm: string
  onSearchChange: (term: string) => void
  selectedCategoria: number
  onCategoriaChange: (categoria: number) => void
  categorias: any[]
}

export const SelectorProducto: React.FC<SelectorProductoProps> = ({
  productos,
  onAgregarAlCarrito,
  searchTerm,
  onSearchChange,
  selectedCategoria,
  onCategoriaChange,
  categorias
}) => {
  const [selectedProducto, setSelectedProducto] = useState<ProductoVenta | null>(null)
  const [selectedVariante, setSelectedVariante] = useState<VarianteVenta | null>(null)
  const [cantidad, setCantidad] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const handleProductoSelect = (producto: ProductoVenta) => {
    setSelectedProducto(producto)
    setSelectedVariante(null)
    setCantidad(1)
    setError(null)
  }

  const handleVarianteSelect = (variante: VarianteVenta) => {
    setSelectedVariante(variante)
    setCantidad(1)
    setError(null)
  }

  const handleCantidadChange = (value: number) => {
    if (selectedVariante && value > selectedVariante.stock) {
      setError(`Stock insuficiente. Disponible: ${selectedVariante.stock}`)
      return
    }
    setCantidad(value)
    setError(null)
  }

  const handleAgregarAlCarrito = () => {
    if (!selectedProducto || !selectedVariante) {
      setError('Selecciona un producto y una variante')
      return
    }

    if (cantidad <= 0) {
      setError('La cantidad debe ser mayor a 0')
      return
    }

    if (cantidad > selectedVariante.stock) {
      setError(`Stock insuficiente. Disponible: ${selectedVariante.stock}`)
      return
    }

    try {
      onAgregarAlCarrito({
        id_producto: selectedProducto.id_producto,
        id_variante: selectedVariante.id_variante,
        descripcion: selectedProducto.descripcion,
        color: selectedVariante.color.nombre,
        talla: selectedVariante.talla.nombre,
        precio_unitario: selectedVariante.precio_venta,
        cantidad,
        stock_disponible: selectedVariante.stock
      })

      // Limpiar selección
      setSelectedProducto(null)
      setSelectedVariante(null)
      setCantidad(1)
      setError(null)
    } catch (err: any) {
      setError(err.message)
    }
  }

  const getStockColor = (stock: number) => {
    if (stock <= 0) return 'bg-red-100 text-red-800'
    if (stock <= 5) return 'bg-yellow-100 text-yellow-800'
    return 'bg-green-100 text-green-800'
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Seleccionar Producto</h3>

      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Buscar Producto</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar por nombre o categoría..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Categoría</label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            value={selectedCategoria}
            onChange={(e) => onCategoriaChange(parseInt(e.target.value))}
          >
            <option value={0}>Todas las categorías</option>
            {categorias.map((categoria) => (
              <option key={categoria.id_categoria} value={categoria.id_categoria}>
                {categoria.nombre_categoria}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6 max-h-96 overflow-y-auto">
        {productos.map((producto) => (
          <div
            key={producto.id_producto}
            className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedProducto?.id_producto === producto.id_producto
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleProductoSelect(producto)}
          >
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
                {producto.descripcion}
              </h4>
              <Package className="h-4 w-4 text-gray-400 flex-shrink-0 ml-2" />
            </div>
            
            <div className="text-sm text-gray-600 mb-2">
              ${producto.precio_venta.toFixed(2)}
            </div>
            
            <div className="text-xs text-gray-500">
              {producto.variantes.length} variantes disponibles
            </div>
          </div>
        ))}
      </div>

      {/* Selección de Variante */}
      {selectedProducto && (
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-900 mb-3">Variantes de {selectedProducto.descripcion}</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {selectedProducto.variantes.map((variante) => (
              <div
                key={variante.id_variante}
                className={`border rounded-lg p-3 cursor-pointer transition-all ${
                  selectedVariante?.id_variante === variante.id_variante
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleVarianteSelect(variante)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{variante.color.nombre}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Ruler className="h-4 w-4 text-gray-400" />
                    <span className="text-sm font-medium">{variante.talla.nombre}</span>
                  </div>
                </div>
                
                <div className="text-sm text-gray-600 mb-2">
                  ${variante.precio_venta.toFixed(2)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStockColor(variante.stock)}`}>
                    Stock: {variante.stock}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Selección de Cantidad y Agregar al Carrito */}
          {selectedVariante && (
            <div className="border-t pt-4">
              <div className="flex items-center space-x-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    max={selectedVariante.stock}
                    value={cantidad}
                    onChange={(e) => handleCantidadChange(parseInt(e.target.value) || 1)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
                
                <div className="text-sm text-gray-600">
                  <div>Precio unitario: ${selectedVariante.precio_venta.toFixed(2)}</div>
                  <div>Subtotal: ${(selectedVariante.precio_venta * cantidad).toFixed(2)}</div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <button
                onClick={handleAgregarAlCarrito}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Agregar al Carrito</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
