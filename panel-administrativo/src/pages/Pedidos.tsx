import React, { useState, useEffect } from 'react'
import { 
  Search, 
  Edit, 
  Trash2,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  X,
  Check,
  RefreshCw
} from 'lucide-react'
import { pedidosService, Pedido } from '../services/pedidos'


const Pedidos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [orders, setOrders] = useState<Pedido[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error', message: string } | null>(null)
  const [anulandoId, setAnulandoId] = useState<number | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [editingOrder, setEditingOrder] = useState<Pedido | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)

  // Cargar pedidos del backend
  useEffect(() => {
    console.log('🔄 Pedidos.tsx - useEffect ejecutándose...');
    loadPedidos();
  }, [])

  // Auto-ocultar notificaciones después de 5 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [notification])

  // Log del estado actual
  useEffect(() => {
    console.log('📊 Pedidos.tsx - Estado actual:', {
      loading,
      error,
      ordersLength: orders?.length || 0,
      orders: orders,
      searchTerm,
      statusFilter
    });
  }, [loading, error, orders, searchTerm, statusFilter]);

  const loadPedidos = async () => {
    try {
      console.log('🚀 Pedidos.tsx - loadPedidos() iniciando...');
      setLoading(true);
      setError(null);
      
      console.log('📡 Pedidos.tsx - Llamando a pedidosService.getAll()...');
      const pedidos = await pedidosService.getAll();
      
      console.log('✅ Pedidos.tsx - pedidos recibidos:', pedidos);
      console.log('🔢 Pedidos.tsx - Tipo de pedidos:', typeof pedidos);
      console.log('📋 Pedidos.tsx - Es array?', Array.isArray(pedidos));
      console.log('🎯 Pedidos.tsx - Cantidad de pedidos:', pedidos?.length || 0);
      
      if (Array.isArray(pedidos) && pedidos.length > 0) {
        console.log('📊 Pedidos.tsx - Primer pedido:', pedidos[0]);
        console.log('🏷️ Pedidos.tsx - Estado del primer pedido:', pedidos[0].estado);
        console.log('💰 Pedidos.tsx - Importe del primer pedido:', pedidos[0].importe);
      }
      
      setOrders(pedidos);
      setLastUpdated(new Date());
      console.log('💾 Pedidos.tsx - Estado actualizado, orders.length:', pedidos?.length || 0);
      
    } catch (err: any) {
      console.error('❌ Pedidos.tsx - Error loading pedidos:', err);
      setError('Error al cargar los pedidos. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
      console.log('🏁 Pedidos.tsx - loadPedidos() completado');
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
  }

  const handleChangeStatus = async (newStatus: string) => {
    if (!editingOrder) return
    
    try {
      // Llamar al backend para cambiar el estado
      await pedidosService.cambiarEstado(editingOrder.id_pedido, newStatus)
      
      // Mostrar notificación de éxito
      showNotification('success', `Estado del pedido #${editingOrder.id_pedido} cambiado a: ${newStatus}`)
      
      // Actualizar el estado local
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id_pedido === editingOrder.id_pedido 
            ? { ...order, estado: newStatus }
            : order
        )
      )
      
      // Cerrar el modal
      handleCloseEditModal()
      
      // Recargar los pedidos para asegurar sincronización
      await loadPedidos()
      
    } catch (error: any) {
      console.error('Error al cambiar el estado del pedido:', error)
      showNotification('error', `Error al cambiar el estado: ${error.response?.data?.error || error.message}`)
    }
  }

  const handleAnular = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres anular este pedido?')) {
      try {
        setAnulandoId(id)
        await pedidosService.anular(id)
        showNotification('success', 'Pedido anulado correctamente')
        // Recargar pedidos después de anular
        await loadPedidos()
      } catch (err: any) {
        console.error('Error anulando pedido:', err)
        showNotification('error', 'Error al anular el pedido. Por favor, inténtalo de nuevo.')
      } finally {
        setAnulandoId(null)
      }
    }
  }

  const filteredOrders = Array.isArray(orders) ? orders.filter(order => {
    // Validar que el pedido tenga los campos necesarios
    if (!order || typeof order !== 'object') {
      console.log('❌ Pedidos.tsx - Pedido inválido filtrado:', order);
      return false;
    }
    
    const matchesSearch = 
      (order.cliente?.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.cliente?.mail || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.id_pedido?.toString() || '').includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.estado === statusFilter
    
    const shouldInclude = matchesSearch && matchesStatus;
    
    if (shouldInclude) {
      console.log('✅ Pedidos.tsx - Pedido incluido en filtro:', {
        id: order.id_pedido,
        estado: order.estado,
        cliente: order.cliente?.nombre,
        matchesSearch,
        matchesStatus
      });
    }
    
    return shouldInclude;
  }) : []

  const getStatusColor = (status: string) => {
    if (!status || typeof status !== 'string') return 'bg-gray-100 text-gray-800'
    
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
      case 'procesando':
        return 'bg-blue-100 text-blue-800 border border-blue-200'
      case 'completado':
        return 'bg-green-100 text-green-800 border border-green-200'
      case 'cancelado':
        return 'bg-red-100 text-red-800 border border-red-200'
      case 'anulado':
        return 'bg-red-100 text-red-800 border border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200'
    }
  }

  const getStatusText = (status: string) => {
    if (!status || typeof status !== 'string') return 'Desconocido'
    
    switch (status.toLowerCase()) {
      case 'pendiente':
        return 'Pendiente'
      case 'procesando':
        return 'Procesando'
      case 'completado':
        return 'Completado'
      case 'cancelado':
        return 'Cancelado'
      case 'anulado':
        return 'Anulado'
      default:
        return status || 'Desconocido'
    }
  }

  const getStatusIcon = (status: string) => {
    if (!status || typeof status !== 'string') return <Clock className="h-4 w-4" />
    
    switch (status.toLowerCase()) {
      case 'pendiente':
        return <Clock className="h-4 w-4" />
      case 'procesando':
        return <Clock className="h-4 w-4" />
      case 'completado':
        return <CheckCircle className="h-4 w-4" />
      case 'cancelado':
        return <AlertCircle className="h-4 w-4" />
      case 'anulado':
        return <Trash2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString || typeof dateString !== 'string') return 'N/A'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Fecha inválida'
      return date.toLocaleDateString('es-ES')
    } catch {
      return 'Fecha inválida'
    }
  }

  const getTotalItems = (order: Pedido) => {
    if (!order || !order.detalle || !Array.isArray(order.detalle)) return 0
    
    return order.detalle.reduce((sum, item) => {
      if (!item || typeof item.cantidad !== 'number') return sum
      return sum + item.cantidad
    }, 0)
  }

  const formatImporte = (importe: any): string => {
    const num = Number(importe)
    if (isNaN(num)) return '$0.00'
    return `$${num.toFixed(2)}`
  }

  const stats = [
    { 
      name: 'Total Pedidos', 
      value: (() => {
        const total = Array.isArray(orders) ? orders.length : 0;
        console.log('📊 Pedidos.tsx - Total Pedidos calculado:', total);
        return total;
      })(), 
      icon: ShoppingCart, 
      color: 'text-blue-600' 
    },
    { 
      name: 'Pendientes', 
      value: (() => {
        const pendientes = Array.isArray(orders) ? orders.filter(o => o && o.estado && o.estado.toLowerCase() === 'pendiente').length : 0;
        console.log('📊 Pedidos.tsx - Pendientes calculado:', pendientes);
        return pendientes;
      })(), 
      icon: Clock, 
      color: 'text-yellow-600' 
    },
    { 
      name: 'Procesando', 
      value: (() => {
        const procesando = Array.isArray(orders) ? orders.filter(o => o && o.estado && o.estado.toLowerCase() === 'procesando').length : 0;
        console.log('📊 Pedidos.tsx - Procesando calculado:', procesando);
        return procesando;
      })(), 
      icon: Clock, 
      color: 'text-blue-600' 
    },
    { 
      name: 'Completados', 
      value: (() => {
        const completados = Array.isArray(orders) ? orders.filter(o => o && o.estado && o.estado.toLowerCase() === 'completado').length : 0;
        console.log('📊 Pedidos.tsx - Completados calculado:', completados);
        return completados;
      })(), 
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      name: 'Cancelados/Anulados', 
      value: (() => {
        const canceladosAnulados = Array.isArray(orders) ? orders.filter(o => o && o.estado && (o.estado.toLowerCase() === 'cancelado' || o.estado.toLowerCase() === 'anulado')).length : 0;
        console.log('📊 Pedidos.tsx - Cancelados/Anulados calculado:', canceladosAnulados);
        return canceladosAnulados;
      })(), 
      icon: AlertCircle, 
      color: 'text-red-600' 
    },
    { 
      name: 'Valor Total', 
      value: (() => {
        const valorTotal = Array.isArray(orders) ? formatImporte(orders.reduce((sum, o) => {
          if (!o || !o.importe) return sum
          return sum + (Number(o.importe) || 0)
        }, 0)) : '$0.00';
        console.log('📊 Pedidos.tsx - Valor Total calculado:', valorTotal);
        return valorTotal;
      })(), 
      icon: DollarSign, 
      color: 'text-green-600' 
    },
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando pedidos...</p>
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
            className="btn-primary"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Notificaciones */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-500 text-white' 
            : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {notification.type === 'success' ? (
                <Check className="h-5 w-5 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 mr-2" />
              )}
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setNotification(null)}
              className="ml-4 hover:opacity-75"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Pedidos</h1>
            <p className="text-lg text-gray-600 mt-2">Administra y rastrea todos los pedidos del sistema</p>
            {lastUpdated && (
              <div className="flex items-center mt-3 text-sm text-gray-500">
                <RefreshCw className="h-4 w-4 mr-2" />
                <span>Última actualización: {lastUpdated.toLocaleTimeString('es-ES')}</span>
              </div>
            )}
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={loadPedidos}
              disabled={loading}
              className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              ) : (
                <RefreshCw className="h-5 w-5 mr-2" />
              )}
              <span>{loading ? 'Actualizando...' : 'Actualizar Pedidos'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className={`h-8 w-8 ${stat.color}`} />
              </div>
              <div className="ml-4 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {stat.value}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="card">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Filtros y Búsqueda</h3>
          <p className="text-sm text-gray-600 mt-1">Encuentra pedidos específicos</p>
        </div>
        
        <div className="p-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar Pedidos
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Buscar por cliente, email o ID del pedido..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
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
          
          {/* Resultados de búsqueda */}
          {searchTerm && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center text-sm text-blue-800">
                <Search className="h-4 w-4 mr-2" />
                <span>
                  Buscando: <strong>"{searchTerm}"</strong> • 
                  {filteredOrders.length} resultado{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Lista de Pedidos</h3>
          <p className="text-sm text-gray-600 mt-1">
            {filteredOrders.length} pedido{filteredOrders.length !== 1 ? 's' : ''} encontrado{filteredOrders.length !== 1 ? 's' : ''}
          </p>
        </div>
        
        <div className="overflow-x-auto">
          {/* Debug: filteredOrders.length = {filteredOrders.length} */}
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <div className="text-lg font-medium mb-2">No se encontraron pedidos</div>
                      <div className="text-sm">Intenta ajustar los filtros de búsqueda</div>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id_pedido} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-primary-600">#{order.id_pedido || 'N/A'}</span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            Pedido #{order.id_pedido || 'N/A'}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(order.fecha_pedido)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {order.cliente?.nombre || 'Cliente N/A'} {order.cliente?.apellido || ''}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.cliente?.mail || 'Email N/A'}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          📍 {order.cliente?.domicilio || 'Domicilio N/A'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900 text-lg">
                        {formatImporte(order.importe)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.estado)}`}>
                        {getStatusIcon(order.estado)}
                        <span className="ml-2">{getStatusText(order.estado)}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getTotalItems(order)} items
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.fecha_pedido)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(order)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors"
                          title="Editar estado"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </button>
                        {order.estado && 
                           order.estado.toLowerCase() !== 'anulado' && 
                           order.estado.toLowerCase() !== 'cancelado' && 
                           order.estado.toLowerCase() !== 'completado' && (
                            <button
                              onClick={() => handleAnular(order.id_pedido)}
                              disabled={anulandoId === order.id_pedido}
                              className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${
                                anulandoId === order.id_pedido ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              title="Anular pedido"
                            >
                              {anulandoId === order.id_pedido ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                              ) : (
                                <Trash2 className="h-4 w-4 mr-1" />
                              )}
                              Anular
                            </button>
                          )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Edición de Estado */}
      {showEditModal && editingOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                Cambiar Estado del Pedido #{editingOrder.id_pedido}
              </h2>
              <button
                onClick={handleCloseEditModal}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Estado Actual */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Estado Actual
                </label>
                <div className="flex items-center">
                  <span className={`inline-flex items-center px-4 py-2 text-sm font-semibold rounded-full ${getStatusColor(editingOrder.estado)}`}>
                    {getStatusIcon(editingOrder.estado)}
                    <span className="ml-2">{getStatusText(editingOrder.estado)}</span>
                  </span>
                </div>
              </div>

               {/* Nuevo Estado */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-3">
                   Cambiar a:
                 </label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                   <button
                     onClick={() => handleChangeStatus('pendiente')}
                     className="px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                   >
                     🟡 Pendiente
                   </button>
                   <button
                     onClick={() => handleChangeStatus('procesando')}
                     className="px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                   >
                     🔵 Procesando
                   </button>
                   <button
                     onClick={() => handleChangeStatus('completado')}
                     className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium text-sm"
                   >
                     🟢 Completado
                   </button>
                   <button
                     onClick={() => handleChangeStatus('cancelado')}
                     className="px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                   >
                     🔴 Cancelado
                   </button>
                   <button
                     onClick={() => handleChangeStatus('anulado')}
                     className="px-4 py-3 bg-red-800 text-white rounded-lg hover:bg-red-900 transition-colors font-medium text-sm"
                   >
                     ⚫ Anulado
                   </button>
                 </div>
               </div>

               {/* Información del Pedido */}
               <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                 <h3 className="text-sm font-semibold text-gray-700 mb-3">Información del Pedido</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                   <div className="flex justify-between">
                     <span className="font-medium text-gray-600">ID Pedido:</span>
                     <span className="text-gray-900">#{editingOrder.id_pedido}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-gray-600">Total:</span>
                     <span className="text-gray-900 font-semibold">{formatImporte(editingOrder.importe)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-gray-600">Fecha:</span>
                     <span className="text-gray-900">{formatDate(editingOrder.fecha_pedido)}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-gray-600">Estado:</span>
                     <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(editingOrder.estado)}`}>
                       {getStatusIcon(editingOrder.estado)}
                       <span className="ml-1">{getStatusText(editingOrder.estado)}</span>
                     </span>
                   </div>
                 </div>
               </div>

               {/* Información del Cliente */}
               <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                 <h3 className="text-sm font-semibold text-blue-700 mb-3">Información del Cliente</h3>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                   <div className="flex justify-between">
                     <span className="font-medium text-blue-600">Nombre:</span>
                     <span className="text-blue-900">{editingOrder.cliente?.nombre || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-blue-600">Apellido:</span>
                     <span className="text-blue-900">{editingOrder.cliente?.apellido || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-blue-600">Email:</span>
                     <span className="text-blue-900">{editingOrder.cliente?.mail || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-blue-600">Teléfono:</span>
                     <span className="text-blue-900">{editingOrder.cliente?.telefono || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between sm:col-span-2">
                     <span className="font-medium text-blue-600">Domicilio:</span>
                     <span className="text-blue-900 text-right">{editingOrder.cliente?.domicilio || 'N/A'}</span>
                   </div>
                   <div className="flex justify-between">
                     <span className="font-medium text-blue-600">DNI:</span>
                     <span className="text-blue-900">{editingOrder.cliente?.dni || 'N/A'}</span>
                   </div>
                 </div>
               </div>

              {/* Acciones */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleCloseEditModal}
                  className="flex-1 px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Pedidos