import React, { useState, useEffect } from 'react'
import { 
  Search, 
  CheckCircle,
  RefreshCw,
  AlertCircle
} from 'lucide-react'
import { crearFactura } from '../services/factura'
import { FacturaRequest } from '../types/factura.types'
import { productosAPI, Producto, Categoria } from '../services/productos'


interface CartItem {
  product: Producto
  quantity: number
}

const POS: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('efectivo')
  const [processingFactura, setProcessingFactura] = useState(false)
  
  // Estados para productos y categorías
  const [productos, setProductos] = useState<Producto[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔄 Cargando productos y categorías desde la base de datos...')
      const [productosData, categoriasData] = await Promise.all([
        productosAPI.getProductos(),
        productosAPI.getCategorias()
      ])
      
      setProductos(productosData)
      setCategorias(categoriasData)
      console.log('✅ Productos y categorías cargados exitosamente:', { productos: productosData.length, categorias: categoriasData.length })
    } catch (error) {
      console.error('❌ Error cargando datos:', error)
      setError('Error al cargar los productos. Usando datos de ejemplo.')
      // Datos de ejemplo como fallback
      setProductos([
        { id_producto: 1, descripcion: 'Camiseta Básica', precio_venta: 25.99, stock: 50, id_categoria: 1, id_proveedor: 1, precio_compra: 15.99, stock_seguridad: 10, estado: 'ACTIVO' },
        { id_producto: 2, descripcion: 'Pantalón Jeans', precio_venta: 45.99, stock: 30, id_categoria: 1, id_proveedor: 1, precio_compra: 25.99, stock_seguridad: 5, estado: 'ACTIVO' },
        { id_producto: 3, descripcion: 'Zapatillas Deportivas', precio_venta: 79.99, stock: 25, id_categoria: 2, id_proveedor: 1, precio_compra: 45.99, stock_seguridad: 5, estado: 'ACTIVO' },
      ])
      setCategorias([
        { id_categoria: 1, nombre_categoria: 'Ropa', descripcion: 'Ropa para hombre y mujer' },
        { id_categoria: 2, nombre_categoria: 'Calzado', descripcion: 'Zapatos y zapatillas' },
        { id_categoria: 3, nombre_categoria: 'Accesorios', descripcion: 'Bolsos, relojes y accesorios' }
      ])
    } finally {
      setLoading(false)
    }
  }

  // Filtrar productos por búsqueda y categoría
  const filteredProducts = productos.filter(producto => {
    const matchesSearch = producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (producto.categoria?.nombre_categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === null || producto.id_categoria === selectedCategory
    return matchesSearch && matchesCategory && producto.estado === 'ACTIVO'
  })

  const addToCart = (product: Producto) => {
    // Verificar stock disponible
    const stock = Number(product.stock)
    if (stock <= 0) {
      alert('No hay stock disponible para este producto')
      return
    }

    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.product.id_producto === product.id_producto)
      if (existingItem) {
        // Verificar que no exceda el stock
        if (existingItem.quantity >= stock) {
          alert(`No hay suficiente stock. Disponible: ${stock}`)
          return prevCart
        }
        return prevCart.map(item =>
          item.product.id_producto === product.id_producto
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevCart, { product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.product.id_producto !== productId))
  }

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId)
      return
    }
    
    // Verificar stock disponible
    const product = productos.find(p => p.id_producto === productId)
    if (product && newQuantity > Number(product.stock)) {
      alert(`No hay suficiente stock. Disponible: ${Number(product.stock)}`)
      return
    }
    
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id_producto === productId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }

  const getTotal = () => {
    return cart.reduce((total, item) => total + (Number(item.product.precio_venta) * item.quantity), 0)
  }

  const getIVA = () => {
    return getTotal() * 0.21
  }

  const getTotalConIVA = () => {
    return getTotal() + getIVA()
  }

  const handleCheckout = async () => {
    if (cart.length === 0) return
    
    try {
      setProcessingFactura(true)
      
      // Preparar datos para la factura
      const facturaData: FacturaRequest = {
        productos: cart.map(item => ({
          id_producto: item.product.id_producto,
          cantidad: Number(item.quantity),
          precio_unitario: Number(item.product.precio_venta),
          subtotal: Number(item.product.precio_venta * item.quantity)
        })),
        total: Number(getTotalConIVA()),
        metodo_pago: selectedPaymentMethod,
        cliente_id: undefined
      }

      // Crear factura en el backend
      const response = await crearFactura(facturaData)
      
      if (response.success) {
        alert('Factura generada exitosamente!')
        setCart([])
      }
    } catch (error) {
      console.error('Error al crear factura:', error)
      alert('Error al generar la factura. Por favor, intente nuevamente.')
    } finally {
      setProcessingFactura(false)
    }
  }


  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando productos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Error Display */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <div className="ml-3">
              <p className="text-sm text-amber-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Factura Card - 2/3 del espacio */}
          <section className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-4">
            <div className="brand">
              <h2 className="text-lg font-bold text-gray-900">TU COMERCIO</h2>
              <p className="text-sm text-gray-500">
                CUIT 20-12345678-9 · Calle Falsa 123, Posadas · 3764-123456
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setCart([])
                }}
                className="px-3 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100"
              >
                🧹 Nueva factura
              </button>
              <button
                onClick={() => window.print()}
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              >
                🖨️ Imprimir / PDF
              </button>
            </div>
          </div>

          {/* Header Factura */}
          <div className="flex items-start justify-between mb-4">
            <div className="inline-block px-3 py-1 text-xs font-bold text-blue-600 bg-blue-100 rounded-lg">
              FACTURA
            </div>
            <div className="text-right text-sm text-gray-500">
              <div>N.º F-{Math.floor(Math.random() * 900000) + 100000}</div>
              <div>Fecha: {new Date().toLocaleString('es-AR')}</div>
              <div className="flex items-center gap-2 mt-1">
                <span>Pago:</span>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="h-7 px-2 text-xs border border-gray-300 rounded"
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="tarjeta">💳 Tarjeta</option>
                  <option value="transferencia">🏦 Transferencia</option>
                  <option value="qr">📱 QR / Pago móvil</option>
                </select>
              </div>
            </div>
          </div>


          {/* Tabla de Factura - Principal */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900">Producto</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Cant.</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">P. Unit.</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Subtotal</th>
                  <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-500">
                      <div className="flex flex-col items-center">
                        <div className="text-4xl mb-2">📄</div>
                        <p className="text-lg font-medium mb-1">Factura vacía</p>
                        <p className="text-sm">Hacé clic en "Buscar productos" para agregar ítems</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  cart.map((item) => (
                    <tr key={item.product.id_producto} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-gray-900">{item.product.descripcion}</div>
                          <div className="text-xs text-gray-500">
                            {item.product.categoria?.nombre_categoria || 'Sin categoría'}
                          </div>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => updateQuantity(item.product.id_producto, item.quantity - 1)}
                            className="w-7 h-7 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="w-10 text-center font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product.id_producto, item.quantity + 1)}
                            disabled={item.quantity >= Number(item.product.stock)}
                            className="w-7 h-7 rounded-lg border border-gray-300 text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="text-right py-3 px-4 text-sm font-medium">${Number(item.product.precio_venta).toFixed(2)}</td>
                      <td className="text-right py-3 px-4 text-sm font-semibold">${(Number(item.product.precio_venta) * item.quantity).toFixed(2)}</td>
                      <td className="text-right py-3 px-4">
                        <button
                          onClick={() => removeFromCart(item.product.id_producto)}
                          className="w-8 h-8 rounded-lg border border-red-200 text-red-500 text-sm hover:bg-red-50 flex items-center justify-center"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="text-right py-3 px-4 text-sm text-gray-600">Subtotal (sin IVA)</td>
                  <td className="text-right py-3 px-4 text-sm font-semibold">${getTotal().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr>
                  <td colSpan={3} className="text-right py-3 px-4 text-sm text-gray-600">IVA 21%</td>
                  <td className="text-right py-3 px-4 text-sm font-semibold">${getIVA().toFixed(2)}</td>
                  <td></td>
                </tr>
                <tr className="border-t-2 border-gray-300">
                  <td colSpan={3} className="text-right py-4 px-4 text-lg font-bold text-gray-900">TOTAL</td>
                  <td className="text-right py-4 px-4 text-xl font-bold text-blue-600">${getTotalConIVA().toFixed(2)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Botón Finalizar */}
          {cart.length > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handleCheckout}
                disabled={processingFactura}
                className="px-8 py-4 bg-green-600 text-white font-bold text-lg rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {processingFactura ? (
                  <>
                    <div className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                    Procesando factura...
                  </>
                ) : (
                  <>
                    <CheckCircle className="inline w-6 h-6 mr-3" />
                    💰 Finalizar Venta y Facturar
                  </>
                )}
              </button>
            </div>
          )}
          </section>

          {/* Panel Lateral de Búsqueda - 1/3 del espacio */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm sticky top-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Buscar Productos</h3>
              
              {/* Buscador */}
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="search"
                    placeholder="Buscar por nombre o categoría…"
                    className="w-full h-10 pl-9 pr-3 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full h-10 px-3 text-sm border border-gray-300 rounded-lg"
                >
                  <option value="">Todas las categorías</option>
                  {categorias.map(categoria => (
                    <option key={categoria.id_categoria} value={categoria.id_categoria}>
                      {categoria.nombre_categoria}
                    </option>
                  ))}
                </select>

                {(searchTerm || selectedCategory) && (
                  <button
                    onClick={() => {
                      setSearchTerm('')
                      setSelectedCategory(null)
                    }}
                    className="w-full text-sm text-gray-500 hover:text-gray-700 py-2"
                  >
                    ✕ Limpiar búsqueda
                  </button>
                )}
              </div>

              {/* Lista de Productos */}
              <div className="mt-6">
                {filteredProducts.length > 0 ? (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {filteredProducts.map((producto) => (
                      <div
                        key={producto.id_producto}
                        className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-gray-900 truncate">
                            {producto.descripcion}
                          </div>
                          <div className="text-xs text-gray-500">
                            {producto.categoria?.nombre_categoria || 'Sin categoría'}
                          </div>
                          <div className="text-xs text-gray-500">
                            Stock: <span className={Number(producto.stock) <= 0 ? 'text-red-500 font-semibold' : ''}>
                              {Number(producto.stock)}
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="font-bold text-blue-600 text-sm">
                            ${Number(producto.precio_venta).toFixed(2)}
                          </div>
                          <button
                            onClick={() => addToCart(producto)}
                            disabled={Number(producto.stock) <= 0}
                            className={`w-8 h-8 rounded-lg border text-xs font-medium ${
                              Number(producto.stock) <= 0
                                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                                : 'bg-white text-gray-600 border-gray-300 hover:bg-blue-50 hover:border-blue-300'
                            }`}
                          >
                            ➕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <p className="text-sm">Busca productos para agregar a la factura</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

export default POS

