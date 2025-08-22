import React, { useState } from 'react'
import { 
  Search, 
  Eye, 
  Edit, 
  Trash2,
  ShoppingCart,
  DollarSign,
  Clock,
  CheckCircle
} from 'lucide-react'

interface Order {
  id: number
  customerName: string
  customerEmail: string
  total: number
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
  items: number
  createdAt: string
  updatedAt: string
}

const Pedidos: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Mock orders data
  const [orders, setOrders] = useState<Order[]>([
    { id: 1, customerName: 'Juan Pérez', customerEmail: 'juan@email.com', total: 150.99, status: 'completed', items: 3, createdAt: '2024-01-15', updatedAt: '2024-01-15' },
    { id: 2, customerName: 'María García', customerEmail: 'maria@email.com', total: 89.50, status: 'processing', items: 2, createdAt: '2024-01-14', updatedAt: '2024-01-14' },
    { id: 3, customerName: 'Carlos López', customerEmail: 'carlos@email.com', total: 234.75, status: 'pending', items: 4, createdAt: '2024-01-13', updatedAt: '2024-01-13' },
    { id: 4, customerName: 'Ana Martínez', customerEmail: 'ana@email.com', total: 67.25, status: 'cancelled', items: 1, createdAt: '2024-01-12', updatedAt: '2024-01-12' },
    { id: 5, customerName: 'Luis Rodríguez', customerEmail: 'luis@email.com', total: 189.99, status: 'completed', items: 2, createdAt: '2024-01-11', updatedAt: '2024-01-11' },
  ])

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toString().includes(searchTerm)
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'processing':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completado'
      case 'processing':
        return 'Procesando'
      case 'pending':
        return 'Pendiente'
      case 'cancelled':
        return 'Cancelado'
      default:
        return 'Desconocido'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />
      case 'processing':
        return <Clock className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'cancelled':
        return <Trash2 className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este pedido?')) {
      setOrders(orders.filter(order => order.id !== id))
    }
  }

  const stats = [
    { name: 'Total Pedidos', value: orders.length, icon: ShoppingCart, color: 'text-blue-600' },
    { name: 'Pedidos Pendientes', value: orders.filter(o => o.status === 'pending').length, icon: Clock, color: 'text-yellow-600' },
    { name: 'Valor Total', value: `$${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}`, icon: DollarSign, color: 'text-green-600' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Gestión de Pedidos</h1>
        <p className="text-gray-600">Administra y rastrea todos los pedidos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
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
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar pedidos..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input-field"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">Procesando</option>
              <option value="completed">Completado</option>
              <option value="cancelled">Cancelado</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        #{order.id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.createdAt}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {order.customerName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.customerEmail}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{getStatusText(order.status)}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.updatedAt}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* View order details */}}
                        className="text-blue-600 hover:text-blue-900"
                        title="Ver detalles"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {/* Edit order */}}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(order.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Pedidos

