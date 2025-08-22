import React, { useState } from 'react'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search,
  Users,
  UserPlus,
  Mail
} from 'lucide-react'

interface Client {
  id: number
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive'
  totalOrders: number
  totalSpent: number
  lastOrder: string
}

const Clientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  // Mock clients data
  const [clients, setClients] = useState<Client[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@email.com', phone: '+1234567890', status: 'active', totalOrders: 15, totalSpent: 1250.50, lastOrder: '2024-01-15' },
    { id: 2, name: 'María García', email: 'maria@email.com', phone: '+1234567891', status: 'active', totalOrders: 8, totalSpent: 890.25, lastOrder: '2024-01-14' },
    { id: 3, name: 'Carlos López', email: 'carlos@email.com', phone: '+1234567892', status: 'inactive', totalOrders: 3, totalSpent: 234.00, lastOrder: '2024-01-10' },
    { id: 4, name: 'Ana Martínez', email: 'ana@email.com', phone: '+1234567893', status: 'active', totalOrders: 22, totalSpent: 2100.75, lastOrder: '2024-01-13' },
    { id: 5, name: 'Luis Rodríguez', email: 'luis@email.com', phone: '+1234567894', status: 'active', totalOrders: 12, totalSpent: 1567.80, lastOrder: '2024-01-12' },
  ])

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (status: string) => {
    return status === 'active' ? 'Activo' : 'Inactivo'
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      setClients(clients.filter(client => client.id !== id))
    }
  }

  const stats = [
    { name: 'Total Clientes', value: clients.length, icon: Users, color: 'text-blue-600' },
    { name: 'Clientes Activos', value: clients.filter(c => c.status === 'active').length, icon: UserPlus, color: 'text-green-600' },
    { name: 'Valor Total', value: `$${clients.reduce((sum, c) => sum + c.totalSpent, 0).toFixed(2)}`, icon: Mail, color: 'text-purple-600' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra la base de datos de clientes</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Cliente
        </button>
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
                placeholder="Buscar clientes..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Pedidos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Gastado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Último Pedido
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {client.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {client.id}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {client.email}
                      </div>
                      <div className="text-sm text-gray-500">
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                      {getStatusText(client.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {client.totalOrders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${client.totalSpent.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {client.lastOrder}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {/* Edit functionality */}}
                        className="text-primary-600 hover:text-primary-900"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(client.id)}
                        className="text-red-600 hover:text-red-900"
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

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Cliente</h3>
              <p className="text-sm text-gray-500">Funcionalidad en desarrollo</p>
              <button
                onClick={() => setShowAddModal(false)}
                className="btn-primary mt-4"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clientes

