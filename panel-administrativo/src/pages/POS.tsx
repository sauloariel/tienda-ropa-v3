import React, { useState, useEffect } from 'react'
import { 
  Search, 
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Maximize2,
  Minimize2
} from 'lucide-react'
import { crearFactura } from '../services/factura'
import { FacturaRequest } from '../types/factura.types'
import { productosAPI, Producto, Categoria } from '../services/productos'
import { clientesAPI, Cliente } from '../services/clientes'
import { useStableInvoiceNumber } from '../hooks/useStableInvoiceNumber'


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
  
  // Estados para clientes
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [selectedCliente, setSelectedCliente] = useState<number | null>(null)
  const [showClienteModal, setShowClienteModal] = useState(false)
  const [clienteSearchTerm, setClienteSearchTerm] = useState('')
  const [showClienteSearch, setShowClienteSearch] = useState(false)
  const [filteredClientes, setFilteredClientes] = useState<Cliente[]>([])
  
  // Estado para modo pantalla completa
  const [isFullscreen, setIsFullscreen] = useState(false)
  
  // Estados para paginación de productos
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(5)

  // Hook para obtener número de factura estable
  const { value: numeroFactura, loading: loadingNumero, error: errorNumero, refresh: refreshNumeroFactura } = useStableInvoiceNumber()

  // Cargar productos y categorías al montar el componente
  useEffect(() => {
    cargarDatos()
  }, [])

  // Resetear paginación cuando cambien los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedCategory])

  const cargarDatos = async () => {
    setLoading(true)
    setError(null)
    try {
      console.log('🔄 Cargando productos, categorías y clientes desde la base de datos...')
      const [productosData, categoriasData, clientesData] = await Promise.all([
        productosAPI.getProductos(),
        productosAPI.getCategorias(),
        clientesAPI.getClientes()
      ])
      
      setProductos(productosData)
      setCategorias(categoriasData)
      setClientes(clientesData)
      console.log('✅ Datos cargados exitosamente:', { 
        productos: productosData.length, 
        categorias: categoriasData.length,
        clientes: clientesData.length 
      })
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
  const allFilteredProducts = productos.filter(producto => {
    const matchesSearch = producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (producto.categoria?.nombre_categoria || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === null || producto.id_categoria === selectedCategory
    // Incluir productos activos o sin estado definido (para compatibilidad)
    const isActive = !producto.estado || producto.estado === 'ACTIVO'
    
    return matchesSearch && matchesCategory && isActive
  })

  // Obtener productos paginados
  const filteredProducts = allFilteredProducts.slice(0, currentPage * productsPerPage)

  
  // Debug: mostrar información del filtrado
  console.log('🔍 POS - Filtrado:', {
    searchTerm,
    totalProductos: productos.length,
    productosFiltrados: filteredProducts.length,
    productosConZapa: productos.filter(p => p.descripcion.toLowerCase().includes('zapa'))
  })

  // Filtrar clientes por búsqueda
  useEffect(() => {
    if (clienteSearchTerm.trim().length < 2) {
      setFilteredClientes([])
      return
    }

    const filtered = clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(clienteSearchTerm.toLowerCase()) ||
      cliente.apellido.toLowerCase().includes(clienteSearchTerm.toLowerCase()) ||
      cliente.dni.includes(clienteSearchTerm) ||
      cliente.mail.toLowerCase().includes(clienteSearchTerm.toLowerCase())
    )
    setFilteredClientes(filtered.slice(0, 10)) // Mostrar solo los primeros 10 resultados
  }, [clienteSearchTerm, clientes])

  // Cerrar dropdown de clientes al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement
      if (!target.closest('.cliente-search-container')) {
        setShowClienteSearch(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

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

  const imprimirFactura = () => {
    if (cart.length === 0) {
      alert('No hay productos en la factura para imprimir')
      return
    }

    // Crear ventana de impresión
    const ventanaImpresion = window.open('', '_blank', 'width=800,height=600')
    
    if (!ventanaImpresion) {
      alert('No se pudo abrir la ventana de impresión. Verifica que los pop-ups estén habilitados.')
      return
    }

    const clienteSeleccionado = selectedCliente ? clientes.find(c => c.id_cliente === selectedCliente) : null
    const subtotal = getTotal()
    const iva = getIVA()
    const total = getTotalConIVA()

    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Factura ${numeroFactura}</title>
        <style>
          @media print {
            body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
            .no-print { display: none !important; }
            .page-break { page-break-before: always; }
          }
          
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background: white;
            color: black;
          }
          
          .factura-container {
            max-width: 800px;
            margin: 0 auto;
            border: 2px solid #000;
            padding: 30px;
            background: white;
          }
          
          .header {
            text-align: center;
            border-bottom: 3px solid #000;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .empresa-info {
            margin-bottom: 20px;
          }
          
          .empresa-info h1 {
            font-size: 32px;
            font-weight: bold;
            margin: 0 0 10px 0;
            text-transform: uppercase;
          }
          
          .empresa-info h2 {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 15px 0;
            color: #333;
          }
          
          .empresa-details {
            font-size: 14px;
            line-height: 1.4;
            color: #666;
          }
          
          .factura-info {
            display: flex;
            justify-content: space-between;
            margin-bottom: 30px;
            padding: 15px;
            background: #f8f9fa;
            border: 1px solid #ddd;
          }
          
          .factura-info div {
            text-align: left;
          }
          
          .factura-info .right {
            text-align: right;
          }
          
          .factura-info h3 {
            margin: 0 0 10px 0;
            font-size: 18px;
            color: #333;
          }
          
          .factura-info p {
            margin: 5px 0;
            font-size: 14px;
          }
          
          .cliente-info {
            margin-bottom: 30px;
            padding: 15px;
            background: #f0f8ff;
            border-left: 4px solid #007bff;
          }
          
          .cliente-info h3 {
            margin: 0 0 15px 0;
            font-size: 16px;
            color: #333;
          }
          
          .cliente-details {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            font-size: 14px;
          }
          
          .cliente-details div {
            display: flex;
            justify-content: space-between;
          }
          
          .cliente-details .label {
            font-weight: bold;
            color: #555;
          }
          
          .productos-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            border: 1px solid #000;
          }
          
          .productos-table th {
            background: #333;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #000;
          }
          
          .productos-table td {
            padding: 10px 8px;
            border: 1px solid #000;
            font-size: 14px;
          }
          
          .productos-table tr:nth-child(even) {
            background: #f8f9fa;
          }
          
          .productos-table .cantidad {
            text-align: center;
          }
          
          .productos-table .precio, .productos-table .subtotal {
            text-align: right;
          }
          
          .totales {
            margin-top: 30px;
            text-align: right;
          }
          
          .totales table {
            margin-left: auto;
            border-collapse: collapse;
            min-width: 300px;
          }
          
          .totales td {
            padding: 8px 15px;
            border: 1px solid #ddd;
            font-size: 14px;
          }
          
          .totales .label {
            background: #f8f9fa;
            font-weight: bold;
            text-align: left;
          }
          
          .totales .valor {
            text-align: right;
            background: white;
          }
          
          .total-final {
            background: #333 !important;
            color: white !important;
            font-weight: bold;
            font-size: 16px;
          }
          
          .footer {
            margin-top: 40px;
            text-align: center;
            border-top: 2px solid #000;
            padding-top: 20px;
          }
          
          .footer p {
            margin: 5px 0;
            font-size: 14px;
            color: #666;
          }
          
          .metodo-pago {
            margin-top: 20px;
            padding: 10px;
            background: #e8f5e8;
            border: 1px solid #4caf50;
            border-radius: 4px;
          }
          
          .metodo-pago strong {
            color: #2e7d32;
          }
        </style>
      </head>
      <body>
        <div class="factura-container">
          <!-- Header -->
          <div class="header">
            <div class="empresa-info">
              <h1>MARUCHI MODA</h1>
              <h2>FACTURA</h2>
              <div class="empresa-details">
                <p><strong>CUIT:</strong> 20-12345678-9</p>
                <p><strong>Dirección:</strong> Calle Falsa 123, Posadas</p>
                <p><strong>Teléfono:</strong> 3764-123456</p>
              </div>
            </div>
          </div>

          <!-- Información de la Factura -->
          <div class="factura-info">
            <div>
              <h3>Información de la Factura</h3>
              <p><strong>Número:</strong> ${numeroFactura}</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-AR')}</p>
              <p><strong>Estado:</strong> Activa</p>
            </div>
            <div class="right">
              <h3>Método de Pago</h3>
              <div class="metodo-pago">
                <p><strong>${selectedPaymentMethod.toUpperCase()}</strong></p>
              </div>
            </div>
          </div>

          <!-- Información del Cliente -->
          <div class="cliente-info">
            <h3>Datos del Cliente</h3>
            ${clienteSeleccionado ? `
              <div class="cliente-details">
                <div><span class="label">Nombre:</span> <span>${clienteSeleccionado.nombre} ${clienteSeleccionado.apellido}</span></div>
                <div><span class="label">DNI:</span> <span>${clienteSeleccionado.dni}</span></div>
                <div><span class="label">Email:</span> <span>${clienteSeleccionado.mail || 'N/A'}</span></div>
                <div><span class="label">Teléfono:</span> <span>${clienteSeleccionado.telefono}</span></div>
                <div><span class="label">Domicilio:</span> <span>${clienteSeleccionado.domicilio}</span></div>
                <div><span class="label">CUIT/CUIL:</span> <span>${clienteSeleccionado.cuit_cuil}</span></div>
              </div>
            ` : `
              <p><strong>Cliente:</strong> Consumidor Final</p>
            `}
          </div>

          <!-- Tabla de Productos -->
          <table class="productos-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th class="cantidad">Cant.</th>
                <th class="precio">P. Unit.</th>
                <th class="subtotal">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${cart.map(item => `
                <tr>
                  <td>${item.product.descripcion}</td>
                  <td class="cantidad">${item.quantity}</td>
                  <td class="precio">$${Number(item.product.precio_venta).toFixed(2)}</td>
                  <td class="subtotal">$${(Number(item.product.precio_venta) * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <!-- Totales -->
          <div class="totales">
            <table>
              <tr>
                <td class="label">Subtotal (sin IVA):</td>
                <td class="valor">$${subtotal.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label">IVA 21%:</td>
                <td class="valor">$${iva.toFixed(2)}</td>
              </tr>
              <tr>
                <td class="label total-final">TOTAL:</td>
                <td class="valor total-final">$${total.toFixed(2)}</td>
              </tr>
            </table>
          </div>

          <!-- Footer -->
          <div class="footer">
            <p><strong>¡Gracias por su compra!</strong></p>
            <p>Esta factura fue generada automáticamente por el sistema POS</p>
            <p>Para consultas, contacte al: 3764-123456</p>
          </div>
        </div>
      </body>
      </html>
    `)

    ventanaImpresion.document.close()
    
    // Esperar a que se cargue el contenido y luego imprimir
    ventanaImpresion.onload = () => {
      ventanaImpresion.focus()
      ventanaImpresion.print()
    }
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
        cliente_id: selectedCliente || undefined
      }

      // Crear factura en el backend
      const response = await crearFactura(facturaData)
      
      if (response.success) {
        alert(`Factura generada exitosamente! Número: ${response.factura.numeroFactura}`)
        setCart([])
        // Actualizar el número de factura para la próxima venta
        refreshNumeroFactura()
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
    <div className={`h-screen bg-gray-50 overflow-hidden ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Error Display */}
      {error && (
        <div className="bg-amber-50 border-l-4 border-amber-400 p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-amber-400" />
            <div className="ml-2">
              <p className="text-xs text-amber-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className={`${isFullscreen ? 'h-full' : 'h-full'} ${isFullscreen ? 'p-4' : 'p-3'}`}>
        <div className={`grid gap-4 ${isFullscreen ? 'grid-cols-1 xl:grid-cols-2 h-full' : 'grid-cols-1 lg:grid-cols-3 max-w-none h-full'}`}>
          {/* Factura Card - 2/3 del espacio */}
          <section className={`${isFullscreen ? 'xl:col-span-1' : 'lg:col-span-2'} bg-white border border-gray-200 rounded-xl p-4 shadow-sm ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <div className="brand flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">MARUCHI MODA</h2>
              <p className="text-xs text-gray-500">
                CUIT 20-12345678-9 · Calle Falsa 123, Posadas · 3764-123456
              </p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  setCart([])
                }}
                className="px-3 py-1.5 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-full hover:bg-blue-100 whitespace-nowrap transition-colors"
              >
                ✓ Nueva factura
              </button>
              <button
                onClick={() => imprimirFactura()}
                className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 whitespace-nowrap transition-colors flex items-center gap-1"
              >
                🖨️ Imprimir / PDF
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 rounded-full hover:bg-gray-100 whitespace-nowrap flex items-center gap-1 transition-colors"
                title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              >
                {isFullscreen ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
                {isFullscreen ? "Salir" : "Pantalla completa"}
              </button>
            </div>
          </div>

          {/* Header Factura */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-4">
            <div className="flex flex-col">
              <div className="inline-block px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-100 rounded-full">
                FACTURA
              </div>
              
              {/* Cliente justo debajo de FACTURA */}
              <div className="flex items-center gap-2 relative mt-2">
                <span className="text-xs font-medium text-gray-700">Cliente:</span>
                <div className="relative flex-1 max-w-xs cliente-search-container">
                  <input
                    type="text"
                    placeholder="Buscar cliente por nombre"
                    value={clienteSearchTerm}
                    onChange={(e) => {
                      setClienteSearchTerm(e.target.value)
                      setShowClienteSearch(true)
                    }}
                    onFocus={() => setShowClienteSearch(true)}
                    className="h-7 px-2 text-xs border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  {/* Mostrar cliente seleccionado */}
                  {selectedCliente && !showClienteSearch && (
                    <div className="absolute inset-0 flex items-center px-2 bg-gray-50 rounded text-xs">
                      {clientes.find(c => c.id_cliente === selectedCliente)?.nombre} {clientes.find(c => c.id_cliente === selectedCliente)?.apellido}
                      <button
                        onClick={() => {
                          setSelectedCliente(null)
                          setClienteSearchTerm('')
                        }}
                        className="ml-auto text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  {/* Dropdown de resultados */}
                  {showClienteSearch && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-48 overflow-y-auto">
                      <div className="p-2 border-b">
                        <button
                          onClick={() => {
                            setSelectedCliente(null)
                            setClienteSearchTerm('')
                            setShowClienteSearch(false)
                          }}
                          className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 rounded"
                        >
                          👤 Sin cliente
                        </button>
                      </div>
                      {filteredClientes.length > 0 ? (
                        filteredClientes.map(cliente => (
                          <button
                            key={cliente.id_cliente}
                            onClick={() => {
                              setSelectedCliente(cliente.id_cliente)
                              setClienteSearchTerm('')
                              setShowClienteSearch(false)
                            }}
                            className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 border-b last:border-b-0"
                          >
                            <div className="font-medium">{cliente.nombre} {cliente.apellido}</div>
                            <div className="text-gray-500">DNI: {cliente.dni} | {cliente.mail}</div>
                          </button>
                        ))
                      ) : clienteSearchTerm.length >= 2 ? (
                        <div className="px-2 py-1 text-xs text-gray-500">
                          No se encontraron clientes
                        </div>
                      ) : (
                        <div className="px-2 py-1 text-xs text-gray-500">
                          Escribe al menos 2 caracteres para buscar
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowClienteModal(true)}
                  className="h-7 px-2 text-xs bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  + Nuevo
                </button>
              </div>
            </div>
            
            {/* Información del lado derecho */}
            <div className="text-xs text-gray-600 lg:text-right">
              <div className="flex items-center gap-2 lg:justify-end mb-1">
                <span className="font-medium">N.° F-{loadingNumero ? (
                  <span className="inline-block w-16 h-3 bg-gray-200 rounded animate-pulse"></span>
                ) : errorNumero ? (
                  <span className="text-red-500">Error</span>
                ) : (
                  numeroFactura || Math.floor(Math.random() * 900000) + 100000
                )}</span>
                <button
                  onClick={refreshNumeroFactura}
                  disabled={loadingNumero}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Actualizar número de factura"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingNumero ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="mb-1">Fecha: {new Date().toLocaleString('es-AR')}</div>
              
              {/* Pago */}
              <div className="flex items-center gap-2 lg:justify-end">
                <span className="font-medium">Pago:</span>
                <select
                  value={selectedPaymentMethod}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="h-6 px-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="efectivo">💵 Efectivo</option>
                  <option value="cbu">🏦 CBU</option>
                </select>
              </div>
            </div>
          </div>


          {/* Tabla de Factura - Principal */}
          <div className={`bg-white border border-gray-200 rounded-xl overflow-hidden flex flex-col ${isFullscreen ? 'flex-1 min-h-0' : 'flex-1'}`}>
            {/* Tabla fija sin scroll */}
            <div className="flex-1 overflow-hidden">
              <table className="w-full border-collapse">
                <thead className="bg-gray-50 sticky top-0 z-10">
                  <tr>
                    <th className="text-left py-2 px-3 text-xs font-semibold text-gray-900">Producto</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-900">Cant.</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-900">P. Unit.</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-900">Subtotal</th>
                    <th className="text-right py-2 px-3 text-xs font-semibold text-gray-900">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-gray-500">
                        <div className="flex flex-col items-center">
                          <div className="text-2xl mb-1">📄</div>
                          <p className="text-sm font-medium mb-1">Factura vacía</p>
                          <p className="text-xs">Hacé clic en "Buscar productos" para agregar ítems</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    cart.slice(0, 5).map((item) => (
                      <tr key={item.product.id_producto} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                        <td className="py-2 px-3">
                          <div>
                            <div className="font-medium text-xs text-gray-900">{item.product.descripcion}</div>
                            <div className="text-xs text-gray-500">
                              {item.product.categoria?.nombre_categoria || 'Sin categoría'}
                            </div>
                          </div>
                        </td>
                        <td className="text-right py-2 px-3">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => updateQuantity(item.product.id_producto, item.quantity - 1)}
                              className="w-6 h-6 rounded-lg border border-gray-300 text-xs hover:bg-gray-50 flex items-center justify-center transition-colors"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-medium text-xs">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id_producto, item.quantity + 1)}
                              disabled={item.quantity >= Number(item.product.stock)}
                              className="w-6 h-6 rounded-lg border border-gray-300 text-xs hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="text-right py-2 px-3 text-xs font-medium">${Number(item.product.precio_venta).toFixed(2)}</td>
                        <td className="text-right py-2 px-3 text-xs font-semibold">${(Number(item.product.precio_venta) * item.quantity).toFixed(2)}</td>
                        <td className="text-right py-2 px-3">
                          <button
                            onClick={() => removeFromCart(item.product.id_producto)}
                            className="w-6 h-6 rounded-lg border border-red-200 text-red-500 text-xs hover:bg-red-50 flex items-center justify-center transition-colors"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                  {/* Indicador de productos adicionales */}
                  {cart.length > 5 && (
                    <tr>
                      <td colSpan={5} className="text-center py-2 px-3 bg-blue-50 text-blue-600 text-xs font-medium">
                        +{cart.length - 5} productos más en la factura
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Totales fijos en la parte inferior */}
            <div className="border-t border-gray-200 bg-gray-50">
              <table className="w-full border-collapse">
                <tbody>
                  <tr>
                    <td colSpan={3} className="text-right py-2 px-3 text-xs text-gray-600">Subtotal (sin IVA)</td>
                    <td className="text-right py-2 px-3 text-xs font-semibold">${getTotal().toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td colSpan={3} className="text-right py-2 px-3 text-xs text-gray-600">IVA 21%</td>
                    <td className="text-right py-2 px-3 text-xs font-semibold">${getIVA().toFixed(2)}</td>
                    <td></td>
                  </tr>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={3} className="text-right py-3 px-3 text-sm font-bold text-gray-900">TOTAL</td>
                    <td className="text-right py-3 px-3 text-lg font-bold text-blue-600">${getTotalConIVA().toFixed(2)}</td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Botón Finalizar */}
          {cart.length > 0 && (
            <div className={`text-center ${isFullscreen ? 'mt-2' : 'mt-3'}`}>
              <button
                onClick={handleCheckout}
                disabled={processingFactura}
                className="px-6 py-3 bg-green-600 text-white font-bold text-sm rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
              >
                {processingFactura ? (
                  <>
                    <div className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Procesando factura...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    💰 Finalizar Venta y Facturar
                  </>
                )}
              </button>
            </div>
          )}
          </section>

          {/* Panel Lateral de Búsqueda - 1/3 del espacio */}
          <aside className={`${isFullscreen ? 'xl:col-span-1' : 'lg:col-span-1'} ${isFullscreen ? 'h-full' : ''}`}>
            <div className={`bg-white border border-gray-200 rounded-xl p-4 shadow-sm ${isFullscreen ? 'h-full flex flex-col' : 'sticky top-4'}`}>
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Buscar Productos</h3>
              
              {/* Buscador */}
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3" />
                  <input
                    type="search"
                    placeholder="Buscar por nombre o categoría…"
                    className="w-full h-8 pl-7 pr-2 text-xs border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                  className="w-full h-8 px-2 text-xs border border-gray-300 rounded-lg"
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
              <div className={`mt-4 ${isFullscreen ? 'flex-1 flex flex-col' : ''}`}>
                {filteredProducts.length > 0 ? (
                  <div className={`space-y-2 overflow-hidden ${isFullscreen ? 'flex-1' : ''}`}>
                    {filteredProducts.slice(0, 6).map((producto) => (
                      <div
                        key={producto.id_producto}
                        className="flex items-center justify-between gap-2 p-3 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-xs text-gray-900 truncate">
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
                          <div className="font-bold text-blue-600 text-xs">
                            ${Number(producto.precio_venta).toFixed(2)}
                          </div>
                          <button
                            onClick={() => addToCart(producto)}
                            disabled={Number(producto.stock) <= 0}
                            className={`w-6 h-6 rounded-lg border text-xs font-medium transition-colors ${
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
                    
                    {/* Indicador de productos adicionales */}
                    {filteredProducts.length > 6 && (
                      <div className="text-center py-2 px-3 bg-blue-50 text-blue-600 text-xs font-medium rounded-lg">
                        +{filteredProducts.length - 6} productos más disponibles
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <div className="text-xl mb-1">🔍</div>
                    <p className="text-xs">Busca productos para agregar a la factura</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Modal para crear nuevo cliente */}
      {showClienteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Nuevo Cliente</h3>
            <form onSubmit={async (e) => {
              e.preventDefault()
              const formData = new FormData(e.currentTarget)
              
              const clienteData = {
                dni: formData.get('dni') as string,
                cuit_cuil: formData.get('cuit_cuil') as string,
                nombre: formData.get('nombre') as string,
                apellido: formData.get('apellido') as string,
                domicilio: formData.get('domicilio') as string,
                telefono: formData.get('telefono') as string,
                mail: formData.get('mail') as string,
                estado: 'activo'
              }
              
              console.log('🔍 Datos del cliente a crear:', clienteData)
              
              try {
                const nuevoCliente = await clientesAPI.createCliente(clienteData)
                if (nuevoCliente) {
                  setClientes([...clientes, nuevoCliente])
                  setSelectedCliente(nuevoCliente.id_cliente)
                  setShowClienteModal(false)
                }
              } catch (error: any) {
                console.error('❌ Error creando cliente:', error)
                let errorMessage = 'Error al crear cliente'
                
                if (error.response?.data?.error) {
                  const backendError = error.response.data.error
                  if (backendError.includes('duplicada') || backendError.includes('unicidad')) {
                    errorMessage = 'El DNI ya existe. Por favor, usa un DNI diferente.'
                  } else {
                    errorMessage = backendError
                  }
                } else if (error.message) {
                  errorMessage = error.message
                }
                
                alert(`Error al crear cliente: ${errorMessage}`)
              }
            }}>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <input
                  name="nombre"
                  placeholder="Nombre (máx 25)"
                  maxLength={25}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
                <input
                  name="apellido"
                  placeholder="Apellido (máx 25)"
                  maxLength={25}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
                <input
                  name="dni"
                  placeholder="DNI (máx 10)"
                  maxLength={10}
                  pattern="[0-9]{7,10}"
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
                <input
                  name="cuit_cuil"
                  placeholder="CUIT/CUIL (máx 13)"
                  maxLength={13}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
                <input
                  name="telefono"
                  placeholder="Teléfono (máx 13)"
                  maxLength={13}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                  required
                />
                <input
                  name="mail"
                  type="email"
                  placeholder="Email (máx 35)"
                  maxLength={35}
                  className="px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <input
                  name="domicilio"
                  placeholder="Domicilio (máx 30)"
                  maxLength={30}
                  className="px-3 py-2 border border-gray-300 rounded text-sm col-span-2"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 text-white py-2 px-4 rounded text-sm hover:bg-blue-600"
                >
                  Crear Cliente
                </button>
                <button
                  type="button"
                  onClick={() => setShowClienteModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded text-sm hover:bg-gray-400"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default POS

