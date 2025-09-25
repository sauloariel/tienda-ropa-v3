import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Edit, 
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  RefreshCw,
  Eye,
  ExternalLink
} from 'lucide-react'
import { pedidosService, Pedido } from '../services/pedidos'

const currency = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', minimumFractionDigits: 2 })

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const s = (status || '').toLowerCase()
  const common = 'inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border'
  if (s === 'pendiente') return <span className={`${common} bg-yellow-50 text-yellow-800 border-yellow-200`}><Clock className="h-3.5 w-3.5 mr-1" />Pendiente</span>
  if (s === 'procesando') return <span className={`${common} bg-blue-50 text-blue-800 border-blue-200 animate-pulse`}><Clock className="h-3.5 w-3.5 mr-1" />Procesando</span>
  if (s === 'completado') return <span className={`${common} bg-green-50 text-green-800 border-green-200`}><CheckCircle className="h-3.5 w-3.5 mr-1" />Completado</span>
  if (s === 'cancelado') return <span className={`${common} bg-red-50 text-red-700 border-red-200`}><AlertCircle className="h-3.5 w-3.5 mr-1" />Cancelado</span>
  if (s === 'anulado') return <span className={`${common} bg-red-50 text-red-700 border-red-200`}><AlertCircle className="h-3.5 w-3.5 mr-1" />Anulado</span>
  return <span className={`${common} bg-gray-50 text-gray-700 border-gray-200`}><Clock className="h-3.5 w-3.5 mr-1" />{status || 'Desconocido'}</span>
}

const Pedidos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [editingOrder, setEditingOrder] = useState<Pedido | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showProductDetails, setShowProductDetails] = useState(false)
  const [showClientProducts, setShowClientProducts] = useState(false)
  const [selectedClient, setSelectedClient] = useState<{id: number, nombre: string, apellido: string} | null>(null)
  const [showSearchBar, setShowSearchBar] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  // Cargar pedidos del backend
  useEffect(() => {
    loadPedidos()
  }, [])

  // Efecto para ocultar/mostrar el buscador al hacer scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px - hide search bar
        setShowSearchBar(false)
      } else if (currentScrollY < lastScrollY || currentScrollY <= 100) {
        // Scrolling up or near top - show search bar
        setShowSearchBar(true)
      }
      
      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [lastScrollY])

  // Auto-ocultar notificaciones después de 5s
  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 5000)
      return () => clearTimeout(t)
    }
  }, [notification])

  const loadPedidos = async () => {
    try {
      setLoading(true)
      setError(null)
      const pedidos = await pedidosService.getAll()
      setOrders(Array.isArray(pedidos) ? pedidos : [])
    } catch (err: any) {
      setError('Error al cargar los pedidos. Por favor, inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
  }

  const handleEdit = (order: Pedido) => {
    setEditingOrder(order)
    setShowEditModal(true)
  }

  const handleCloseEditModal = () => {
    setShowEditModal(false)
    setEditingOrder(null)
    setShowProductDetails(false)
  }

  const handleViewClientProducts = (order: Pedido) => {
    if (order.cliente) {
      setSelectedClient({
        id: order.cliente.id_cliente,
        nombre: order.cliente.nombre,
        apellido: order.cliente.apellido
      })
      setShowClientProducts(true)
    }
  }

  const handleCloseClientProducts = () => {
    setShowClientProducts(false)
    setSelectedClient(null)
  }

  const handleChangeStatus = async (newStatus: string) => {
    if (!editingOrder) return
    try {
      await pedidosService.cambiarEstado(editingOrder.id_pedido, newStatus)
      showNotification('success', `Estado del pedido #${editingOrder.id_pedido} cambiado a: ${newStatus}`)
      setOrders(prev => prev.map(o => o.id_pedido === editingOrder.id_pedido ? { ...o, estado: newStatus } : o))
      handleCloseEditModal()
      await loadPedidos()
    } catch (error: any) {
      showNotification('error', `Error al cambiar el estado: ${error?.response?.data?.error || error.message}`)
    }
  }


  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    if (!order || typeof order !== 'object') return false
    const matchesSearch = 
      (order.cliente?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.cliente?.mail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id_pedido?.toString() || '').includes(searchTerm)
    const matchesStatus = statusFilter === 'all' || (order.estado || '').toLowerCase() === statusFilter
    return matchesSearch && matchesStatus
  }) : []

  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return 'Fecha inválida'
    return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  const getTotalItems = (order: Pedido) => {
    if (!order || !Array.isArray(order.detalle)) return 0
    return order.detalle.reduce((sum, item) => sum + (item?.cantidad || 0), 0)
  }


  const formatImporte = (importe: any): string => {
    const num = Number(importe)
    if (isNaN(num)) return '$0,00'
    return currency.format(num)
  }

  const quickFilters: Array<{label:string; value:string; emoji:string}> = [
    { label: 'Todos', value: 'all', emoji: '📊' },
    { label: 'Pendiente', value: 'pendiente', emoji: '🟡' },
    { label: 'Procesando', value: 'procesando', emoji: '🔵' },
    { label: 'Completado', value: 'completado', emoji: '🟢' },
    { label: 'Cancelado', value: 'cancelado', emoji: '🔴' },
    { label: 'Anulado', value: 'anulado', emoji: '⚫' },
  ]

  const stats = [
    { name: 'Total Pedidos', value: Array.isArray(orders) ? orders.length : 0, icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Pendientes', value: orders.filter(o => (o.estado||'').toLowerCase()==='pendiente').length, icon: Clock, color: 'text-yellow-600' },
    { name: 'Procesando', value: orders.filter(o => (o.estado||'').toLowerCase()==='procesando').length, icon: Clock, color: 'text-blue-600' },
    { name: 'Completados', value: orders.filter(o => (o.estado||'').toLowerCase()==='completado').length, icon: CheckCircle, color: 'text-green-600' },
    { name: 'Cancelados/Anulados', value: orders.filter(o => ['cancelado','anulado'].includes((o.estado||'').toLowerCase())).length, icon: AlertCircle, color: 'text-red-600' },
    { name: 'Valor Total', value: formatImporte(orders.reduce((s,o)=> s + (Number(o.importe)||0), 0)), icon: DollarSign, color: 'text-green-600' },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4" />
            <div className="h-4 bg-gray-200 rounded w-1/4" />
          </div>
        </div>
        <div className="card overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <div className="h-5 w-40 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="divide-y">
            {[...Array(6)].map((_,i)=>(
              <div key={i} className="grid grid-cols-6 gap-4 p-4">
                <div className="col-span-2 h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={loadPedidos}
            className="inline-flex items-center px-5 py-2.5 rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" />
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="w-full px-2 py-6 space-y-8">
        {/* Notificaciones */}
        {notification && (
          <div
            role="status"
            aria-live="polite"
            className={`fixed top-6 right-6 z-50 p-6 rounded-2xl shadow-2xl max-w-md transform transition-all duration-500 ${
              notification.type === 'success' 
                ? 'bg-gradient-to-r from-emerald-500 to-green-600 text-white border border-emerald-400' 
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white border border-red-400'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                {notification.type === 'success' ? (
                  <CheckCircle className="h-6 w-6 mr-4 text-emerald-100" />
                ) : (
                  <AlertCircle className="h-6 w-6 mr-4 text-red-100" />
                )}
                <span className="font-semibold text-lg">{notification.message}</span>
              </div>
              <button
                onClick={() => setNotification(null)}
                className="ml-4 hover:opacity-75 transition-opacity p-1 rounded-full hover:bg-white/20"
                aria-label="Cerrar notificación"
                title="Cerrar"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        
        {/* Botón flotante para mostrar buscador */}
        {!showSearchBar && (
          <button
            onClick={() => setShowSearchBar(true)}
            className="fixed top-4 right-4 z-40 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            title="Mostrar buscador"
          >
            <Search className="h-5 w-5" />
          </button>
        )}

        {/* Filtros y búsqueda */}
        <div className={`bg-white rounded-lg shadow-sm border border-gray-200 sticky top-6 z-30 transform transition-transform duration-300 ${showSearchBar ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="px-8 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Filtros y Búsqueda</h3>
            <p className="text-sm text-gray-600 mt-1">Encuentra pedidos específicos</p>
          </div>
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar Pedidos
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Buscar por cliente, email o ID del pedido..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar pedidos"
                  />
                </div>
              </div>
              
              <div className="lg:w-64">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Filtrar por Estado
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  aria-label="Filtrar por estado"
                >
                  <option value="all">📊 Todos los estados</option>
                  <option value="pendiente">🟡 Pendiente</option>
                  <option value="procesando">🔵 Procesando</option>
                  <option value="completado">🟢 Completado</option>
                  <option value="cancelado">🔴 Cancelado</option>
                  <option value="anulado">⚫ Anulado</option>
                </select>
              </div>
            </div>

            {/* Quick filters */}
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {quickFilters.map(f => (
                  <button
                    key={f.value}
                    onClick={() => setStatusFilter(f.value)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      statusFilter === f.value
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                    title={`Filtrar: ${f.label}`}
                  >
                    <span className="mr-1">{f.emoji}</span>{f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Resultados de búsqueda */}
            {searchTerm && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center text-sm text-blue-800">
                  <Search className="h-4 w-4 mr-2" />
                  <span>
                    Buscando: <strong>"{searchTerm}"</strong> • {filteredOrders.length} resultado{filteredOrders.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Tabla de pedidos */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 py-4 border-b border-gray-200 bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Lista de Pedidos</h3>
            <p className="text-sm text-gray-600 mt-1">
              {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
            </p>
          </div>
        
          <div className="overflow-x-auto">
            <table className="w-full divide-y divide-gray-200 min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Pedido</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cliente</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Total</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden md:table-cell">Items</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider hidden lg:table-cell">Productos</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha</th>
                  <th className="px-3 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center">
                      <div className="text-gray-500">
                        <div className="text-lg font-medium mb-2">No se encontraron pedidos</div>
                        <div className="text-sm">Intenta ajustar los filtros de búsqueda</div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id_pedido} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-primary-600">#{order.id_pedido || 'N/A'}</span>
                          </div>
                          <div className="ml-2">
                            <div className="text-sm font-medium text-gray-900">#{order.id_pedido || 'N/A'}</div>
                            <div className="text-xs text-gray-500">ID: {order.cliente?.id_cliente ?? '—'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <div className="max-w-32">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {order.cliente?.nombre || 'Cliente N/A'} {order.cliente?.apellido || ''}
                          </div>
                          <div className="text-xs text-gray-500 truncate">
                            {order.cliente?.mail || 'Email N/A'}
                          </div>
                          <div className="text-xs text-gray-400 truncate">
                            📍 {order.cliente?.domicilio || 'Domicilio N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {formatImporte(order.importe)}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <StatusPill status={order.estado as string} />
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap hidden md:table-cell">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTotalItems(order)} items
                        </span>
                      </td>
                    <td className="px-3 py-3 hidden lg:table-cell">
                      <div className="text-sm text-gray-900 max-w-48">
                        {order.detalle && order.detalle.length > 0 ? (
                          <div className="space-y-2">
                            {order.detalle.slice(0, 2).map((item, index) => (
                              <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded border">
                                {item.producto?.imagen_principal ? (
                                  <div className="flex-shrink-0">
                                    <img
                                      src={item.producto.imagen_principal}
                                      alt={item.producto.nombre}
                                      className="w-8 h-8 object-cover rounded border border-white shadow-sm"
                                    />
                                  </div>
                                ) : (
                                  <div className="w-8 h-8 rounded border border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                                    IMG
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center space-x-1 mb-1">
                                    <span className="text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-semibold">
                                      {item.cantidad}x
                                    </span>
                                    <span className="text-xs text-gray-600">
                                      {currency.format(item.precio_venta || 0)}
                                    </span>
                                  </div>
                                  <p className="text-xs font-medium text-gray-900 truncate max-w-32">
                                    {item.producto?.nombre || `Producto #${item.id_producto}`}
                                  </p>
                                  {item.producto?.descripcion && (
                                    <p className="text-xs text-gray-500 truncate max-w-32">
                                      {item.producto.descripcion}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                            {order.detalle.length > 2 && (
                              <div className="text-xs text-gray-500 text-center bg-gray-100 py-1 rounded">
                                +{order.detalle.length - 2} más...
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">Sin productos</span>
                        )}
                      </div>
                    </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.fecha_pedido as unknown as string)}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={() => handleEdit(order)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                            title="Ver información del pedido"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Información
                          </button>
                          <button
                            onClick={() => handleViewClientProducts(order)}
                            className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
                            title="Ver productos del cliente"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            Productos
                          </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

        {/* Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 2xl:grid-cols-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <div className="ml-4 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-lg font-semibold text-gray-900">
                      {typeof stat.value === 'number' ? stat.value : stat.value}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          ))}
        </div>

      {/* Modal de Edición de Estado */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex justify-center items-center p-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
              <h2 className="text-lg font-bold text-gray-900">
                Información del Pedido #{editingOrder.id_pedido}
              </h2>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {/* Sección superior: Estado actual y botones de cambio */}
              <div className="mb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Estado Actual</label>
                    <StatusPill status={editingOrder.estado as string} />
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-700 mb-2">Cambiar a:</div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleChangeStatus('pendiente')} className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-xs">🟡 Pendiente</button>
                      <button onClick={() => handleChangeStatus('procesando')} className="px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-xs">🔵 Procesando</button>
                      <button onClick={() => handleChangeStatus('completado')} className="px-3 py-1.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-xs">🟢 Completado</button>
                      <button onClick={() => handleChangeStatus('cancelado')} className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-xs">🔴 Cancelado</button>
                      <button onClick={() => handleChangeStatus('anulado')} className="px-3 py-1.5 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium text-xs">⚫ Anulado</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Información en tres columnas */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Columna izquierda: Información del Pedido */}
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                  <h3 className="text-xs font-semibold text-gray-700 mb-2">Información del Pedido</h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between"><span className="font-medium text-gray-600">ID:</span><span className="text-gray-900 font-semibold">#{editingOrder.id_pedido}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Total:</span><span className="text-gray-900 font-bold">{formatImporte(editingOrder.importe)}</span></div>
                    <div className="flex justify-between"><span className="font-medium text-gray-600">Fecha:</span><span className="text-gray-900">{formatDate(editingOrder.fecha_pedido as unknown as string)}</span></div>
                    <div className="flex justify-between items-center"><span className="font-medium text-gray-600">Estado:</span><StatusPill status={editingOrder.estado as string} /></div>
                  </div>
                </div>

                {/* Columna central: Información del Cliente */}
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                  <h3 className="text-xs font-semibold text-blue-700 mb-2">Información del Cliente</h3>
                  <div className="space-y-2 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="font-medium text-blue-600">Nombre:</span><br/><span className="text-blue-900">{editingOrder.cliente?.nombre || 'N/A'}</span></div>
                      <div><span className="font-medium text-blue-600">Apellido:</span><br/><span className="text-blue-900">{editingOrder.cliente?.apellido || 'N/A'}</span></div>
                    </div>
                    <div><span className="font-medium text-blue-600">Email:</span><br/><span className="text-blue-900 text-xs truncate">{editingOrder.cliente?.mail || 'N/A'}</span></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div><span className="font-medium text-blue-600">Teléfono:</span><br/><span className="text-blue-900">{editingOrder.cliente?.telefono || 'N/A'}</span></div>
                      <div><span className="font-medium text-blue-600">DNI:</span><br/><span className="text-blue-900">{editingOrder.cliente?.dni || 'N/A'}</span></div>
                    </div>
                    <div><span className="font-medium text-blue-600">Domicilio:</span><br/><span className="text-blue-900 text-xs truncate">{editingOrder.cliente?.domicilio || 'N/A'}</span></div>
                  </div>
                </div>

                {/* Columna derecha: Información de Entrega */}
                <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                  <h3 className="text-xs font-semibold text-orange-700 mb-2">Información de Entrega</h3>
                  <div className="space-y-2 text-xs">
                    {editingOrder.direccion_entrega && (
                      <div>
                        <span className="font-medium text-orange-600">Dirección:</span>
                        <p className="text-orange-900 text-xs truncate">{editingOrder.direccion_entrega}</p>
                      </div>
                    )}
                    {editingOrder.horario_recepcion && (
                      <div>
                        <span className="font-medium text-orange-600">Horario:</span>
                        <p className="text-orange-900 text-xs">{editingOrder.horario_recepcion}</p>
                      </div>
                    )}
                    {editingOrder.descripcion_pedido && (
                      <div>
                        <span className="font-medium text-orange-600">Descripción:</span>
                        <p className="text-orange-900 text-xs truncate">{editingOrder.descripcion_pedido}</p>
                      </div>
                    )}
                    {!editingOrder.direccion_entrega && !editingOrder.horario_recepcion && !editingOrder.descripcion_pedido && (
                      <div className="text-orange-600 text-xs">Sin información de entrega</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Productos del Pedido */}
              <div className="bg-green-50 p-3 rounded-lg border border-green-200 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-green-700">Productos del Pedido</h3>
                  <button
                    onClick={() => setShowProductDetails(!showProductDetails)}
                    className="text-xs text-green-600 hover:text-green-800 font-medium"
                  >
                    {showProductDetails ? 'Ocultar' : 'Ver detalles'}
                  </button>
                </div>
                
                {editingOrder.detalle && editingOrder.detalle.length > 0 ? (
                  <div className="space-y-3">
                    {showProductDetails ? (
                      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
                        {editingOrder.detalle.map((item, index) => (
                          <div key={index} className="bg-white p-2 rounded-lg border border-green-200">
                            <div className="flex items-start space-x-2">
                              {item.producto?.imagen_principal && (
                                <div className="flex-shrink-0">
                                  <img
                                    src={item.producto.imagen_principal}
                                    alt={item.producto.nombre}
                                    className="w-8 h-8 object-cover rounded border border-gray-200"
                                  />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-xs">
                                  {item.producto?.nombre || `Producto #${item.id_producto}`}
                                </h4>
                                <div className="flex items-center justify-between mt-1">
                                  <span className="text-xs bg-green-100 text-green-800 px-1 py-0.5 rounded">x{item.cantidad}</span>
                                  <span className="text-xs font-semibold text-green-700">{currency.format((item.cantidad || 0) * (item.precio_venta || 0))}</span>
                                </div>
                                <div className="text-xs text-gray-600">
                                  {currency.format(item.precio_venta || 0)} c/u
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-xs text-gray-600">
                        <div className="flex items-center justify-between">
                          <span>Total de productos: {editingOrder.detalle.length}</span>
                          <span className="font-semibold">
                            Total: {currency.format(
                              editingOrder.detalle.reduce((sum, item) => sum + ((item.cantidad || 0) * (item.precio_venta || 0)), 0)
                            )}
                          </span>
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Haz clic en "Ver detalles" para ver la lista completa de productos</div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No hay productos asociados a este pedido</div>
                )}
              </div>

              {/* Botones de acción */}
              <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 mt-4 flex-shrink-0">
                <div className="flex justify-end">
                  <button
                    onClick={handleCloseEditModal}
                    className="px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors font-medium flex items-center gap-2 text-sm"
                  >
                    <X className="h-4 w-4" />
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Productos del Cliente */}
      {showClientProducts && selectedClient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <ShoppingCart className="h-6 w-6 mr-3 text-blue-600" />
                  Lista de Producción - {selectedClient.nombre} {selectedClient.apellido}
                </h2>
                <p className="text-sm text-gray-600 mt-1">Información detallada para la confección de prendas</p>
              </div>
              <button
                onClick={handleCloseClientProducts}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                aria-label="Cerrar modal"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200 mb-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Información del Cliente
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <span className="font-medium text-blue-600">Nombre Completo:</span>
                    <p className="text-blue-900 font-semibold text-lg">{selectedClient.nombre} {selectedClient.apellido}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <span className="font-medium text-blue-600">ID Cliente:</span>
                    <p className="text-blue-900 font-semibold text-lg">#{selectedClient.id}</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <span className="font-medium text-blue-600">Total Pedidos:</span>
                    <p className="text-blue-900 font-semibold text-lg">
                      {orders.filter(order => order.cliente?.id_cliente === selectedClient.id).length} pedidos
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <CheckCircle className="h-6 w-6 mr-3 text-green-600" />
                  Pedidos para Producción
                </h3>
                
                {orders.filter(order => order.cliente?.id_cliente === selectedClient.id).map((order) => (
                  <div key={order.id_pedido} className="bg-white border-2 border-gray-200 rounded-xl shadow-lg overflow-hidden">
                    {/* Header del Pedido */}
                    <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="text-lg font-bold text-gray-900 flex items-center">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm mr-3">
                              #{order.id_pedido}
                            </span>
                            Pedido de {formatDate(order.fecha_pedido as unknown as string)}
                          </h4>
                          <div className="flex items-center gap-4 mt-2">
                            <StatusPill status={order.estado as string} />
                            <span className="text-sm text-gray-600">
                              {getTotalItems(order)} prendas • {formatImporte(order.importe)}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{formatImporte(order.importe)}</div>
                          <div className="text-sm text-gray-600">{getTotalItems(order)} prendas</div>
                        </div>
                      </div>
                    </div>

                    {order.detalle && order.detalle.length > 0 && (
                      <div className="mt-4">
                        <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                          <ShoppingCart className="h-5 w-5 mr-2 text-green-600" />
                          Prendas a Confeccionar ({order.detalle.length} productos)
                        </h5>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {order.detalle.map((item, index) => (
                            <div key={index} className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border-2 border-green-200 shadow-sm">
                              <div className="flex items-start space-x-4">
                                {/* Imagen del Producto */}
                                <div className="flex-shrink-0">
                                  {item.producto?.imagen_principal ? (
                                    <img
                                      src={item.producto.imagen_principal}
                                      alt={item.producto.nombre}
                                      className="w-20 h-20 object-cover rounded-lg border-2 border-white shadow-md"
                                    />
                                  ) : (
                                    <div className="w-20 h-20 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs bg-gray-100">
                                      <div className="text-center">
                                        <div className="text-2xl mb-1">👕</div>
                                        <div className="text-xs">IMG</div>
                                      </div>
                                    </div>
                                  )}
                                </div>
                                
                                {/* Información del Producto */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between mb-2">
                                    <h6 className="text-lg font-bold text-gray-900 truncate">
                                      {item.producto?.nombre || `Producto #${item.id_producto}`}
                                    </h6>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-green-700">
                                        {item.cantidad}x
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {currency.format(item.precio_venta || 0)} c/u
                                      </div>
                                    </div>
                                  </div>
                                  
                                  {item.producto?.descripcion && (
                                    <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                                      {item.producto.descripcion}
                                    </p>
                                  )}
                                  
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        Cantidad: {item.cantidad}
                                      </div>
                                      <div className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                                        Precio: {currency.format(item.precio_venta || 0)}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-lg font-bold text-green-700">
                                        Subtotal: {currency.format((item.cantidad || 0) * (item.precio_venta || 0))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                {orders.filter(order => order.cliente?.id_cliente === selectedClient.id).length === 0 && (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No se encontraron pedidos para este cliente</p>
                  </div>
                )}
              </div>

              {/* Resumen de Producción */}
              <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Resumen de Producción
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {orders.filter(order => order.cliente?.id_cliente === selectedClient.id).length}
                    </div>
                    <div className="text-sm text-green-600">Pedidos</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {orders.filter(order => order.cliente?.id_cliente === selectedClient.id)
                        .reduce((sum, order) => sum + getTotalItems(order), 0)}
                    </div>
                    <div className="text-sm text-green-600">Prendas Total</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {formatImporte(orders.filter(order => order.cliente?.id_cliente === selectedClient.id)
                        .reduce((sum, order) => sum + (Number(order.importe) || 0), 0))}
                    </div>
                    <div className="text-sm text-green-600">Valor Total</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-green-200 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {orders.filter(order => order.cliente?.id_cliente === selectedClient.id && 
                        order.estado?.toLowerCase() === 'pendiente').length}
                    </div>
                    <div className="text-sm text-green-600">Pendientes</div>
                  </div>
                </div>
              </div>

              {/* Acciones */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    <p className="font-medium">¿Necesitas ver más detalles en la página web?</p>
                    <p className="text-xs text-gray-500">Accede a la información completa del cliente</p>
                  </div>
                  <button
                    onClick={() => {
                      const clientUrl = `http://localhost:3000/cliente/${selectedClient.id}`
                      window.open(clientUrl, '_blank')
                    }}
                    className="inline-flex items-center px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-lg"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Ver en Web
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default Pedidos
