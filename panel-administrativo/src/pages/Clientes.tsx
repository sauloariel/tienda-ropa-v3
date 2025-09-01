import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Edit, 
  Trash2, 
  Search,
  Users,
  UserPlus,
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react'

import { clientesAPI, type Cliente, type ClienteCreate, type ClienteUpdate } from '../services/clientes'

const Clientes: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar clientes al montar el componente
  useEffect(() => {
    cargarClientes()
  }, [])

  const cargarClientes = async () => {
    try {
      setLoading(true)
      const data = await clientesAPI.getClientes()
      setClientes(data)
    } catch (error) {
      setError('Error al cargar los clientes')
      console.error('Error cargando clientes:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredClientes = clientes.filter(cliente =>
    cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.mail.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cliente.dni.includes(searchTerm)
  )

  const getStatusColor = (estado: string | undefined) => {
    if (!estado) return 'bg-gray-100 text-gray-800'
    return estado === 'ACTIVO' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800'
  }

  const getStatusText = (estado: string | undefined) => {
    if (!estado) return 'Sin estado'
    return estado === 'ACTIVO' ? 'Activo' : 'Inactivo'
  }

  const handleAdd = () => {
    setShowAddModal(true)
    setError(null)
    setSuccess(null)
  }

  const handleCreate = async (clienteData: ClienteCreate) => {
    try {
      await clientesAPI.createCliente(clienteData)
      setSuccess('Cliente creado correctamente')
      setShowAddModal(false)
      cargarClientes() // Recargar la lista
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al crear el cliente')
    }
  }

  const handleEdit = (cliente: Cliente) => {
    setEditingCliente(cliente)
    setShowEditModal(true)
    setError(null)
    setSuccess(null)
  }

  const handleUpdate = async (clienteData: ClienteUpdate) => {
    if (!editingCliente) return

    try {
      await clientesAPI.updateCliente(editingCliente.id_cliente, clienteData)
      setSuccess('Cliente actualizado correctamente')
      setShowEditModal(false)
      setEditingCliente(null)
      cargarClientes() // Recargar la lista
    } catch (error: any) {
      setError(error.response?.data?.error || 'Error al actualizar el cliente')
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await clientesAPI.deleteCliente(id)
        setSuccess('Cliente eliminado correctamente')
        cargarClientes() // Recargar la lista
      } catch (error: any) {
        setError(error.response?.data?.error || 'Error al eliminar el cliente')
      }
    }
  }

  const stats = [
    { name: 'Total Clientes', value: clientes.length, icon: Users, color: 'text-blue-600' },
    { name: 'Clientes Activos', value: clientes.filter(c => c.estado === 'ACTIVO').length, icon: UserPlus, color: 'text-green-600' },
    { name: 'Clientes Inactivos', value: clientes.filter(c => c.estado !== 'ACTIVO').length, icon: Mail, color: 'text-purple-600' },
  ]

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Clientes</h1>
          <p className="text-gray-600">Administra la información de todos los clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleAdd}
            className="btn-primary"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </button>
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <XCircle className="h-5 w-5 text-red-400" />
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setError(null)}
                className="text-red-400 hover:text-red-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-md p-4">
          <div className="flex">
            <CheckCircle className="h-5 w-5 text-green-400" />
            <div className="ml-3">
              <p className="text-sm text-green-800">{success}</p>
            </div>
            <div className="ml-auto pl-3">
              <button
                onClick={() => setSuccess(null)}
                className="text-green-400 hover:text-green-600"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Search */}
      <div className="card">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Buscar clientes por nombre, apellido, email o DNI..."
                className="input-field pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Clientes Table */}
      <div className="card">
        <div className="overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cliente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Documento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Domicilio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredClientes.map((cliente) => (
                <tr key={cliente.id_cliente} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {cliente.nombre} {cliente.apellido}
                      </div>
                      <div className="text-sm text-gray-500">
                        ID: {cliente.id_cliente}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        DNI: {cliente.dni}
                      </div>
                      <div className="text-sm text-gray-500">
                        CUIT: {cliente.cuit_cuil}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm text-gray-900">
                        {cliente.mail}
                      </div>
                      <div className="text-sm text-gray-500">
                        {cliente.telefono}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {cliente.domicilio}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(cliente.estado)}`}>
                      {getStatusText(cliente.estado)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(cliente)}
                        className="text-primary-600 hover:text-primary-900"
                        title="Editar cliente"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cliente.id_cliente)}
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar cliente"
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
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nuevo Cliente</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const clienteData: ClienteCreate = {
                  dni: formData.get('dni') as string,
                  cuit_cuil: formData.get('cuit_cuil') as string,
                  nombre: formData.get('nombre') as string,
                  apellido: formData.get('apellido') as string,
                  domicilio: formData.get('domicilio') as string,
                  telefono: formData.get('telefono') as string,
                  mail: formData.get('mail') as string,
                  estado: formData.get('estado') as string || 'ACTIVO',
                  password: formData.get('password') as string || undefined
                }
                handleCreate(clienteData)
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DNI *</label>
                    <input
                      type="text"
                      name="dni"
                      className="input-field"
                      required
                      minLength={7}
                      placeholder="12345678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CUIT/CUIL *</label>
                    <input
                      type="text"
                      name="cuit_cuil"
                      className="input-field"
                      required
                      placeholder="20-12345678-9"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre *</label>
                    <input
                      type="text"
                      name="nombre"
                      className="input-field"
                      required
                      placeholder="Juan"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido *</label>
                    <input
                      type="text"
                      name="apellido"
                      className="input-field"
                      required
                      placeholder="Pérez"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Domicilio *</label>
                    <input
                      type="text"
                      name="domicilio"
                      className="input-field"
                      required
                      placeholder="Av. San Martín 123"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono *</label>
                    <input
                      type="text"
                      name="telefono"
                      className="input-field"
                      required
                      placeholder="+54 11 1234-5678"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email *</label>
                    <input
                      type="email"
                      name="mail"
                      className="input-field"
                      required
                      placeholder="juan.perez@email.com"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      name="estado"
                      defaultValue="ACTIVO"
                      className="input-field"
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="input-field"
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Opcional. Si se deja vacío, el cliente no tendrá acceso al sistema.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Crear Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCliente && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Editar Cliente</h3>
              
              <form onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.currentTarget)
                const clienteData: ClienteUpdate = {
                  dni: formData.get('dni') as string,
                  cuit_cuil: formData.get('cuit_cuil') as string,
                  nombre: formData.get('nombre') as string,
                  apellido: formData.get('apellido') as string,
                  domicilio: formData.get('domicilio') as string,
                  telefono: formData.get('telefono') as string,
                  mail: formData.get('mail') as string,
                  estado: formData.get('estado') as string
                }
                
                // Solo incluir contraseña si se proporciona una nueva
                const password = formData.get('password') as string
                if (password && password.trim() !== '') {
                  clienteData.password = password
                }
                
                handleUpdate(clienteData)
              }}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">DNI</label>
                    <input
                      type="text"
                      name="dni"
                      defaultValue={editingCliente.dni}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">CUIT/CUIL</label>
                    <input
                      type="text"
                      name="cuit_cuil"
                      defaultValue={editingCliente.cuit_cuil}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      defaultValue={editingCliente.nombre}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Apellido</label>
                    <input
                      type="text"
                      name="apellido"
                      defaultValue={editingCliente.apellido}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Domicilio</label>
                    <input
                      type="text"
                      name="domicilio"
                      defaultValue={editingCliente.domicilio}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Teléfono</label>
                    <input
                      type="text"
                      name="telefono"
                      defaultValue={editingCliente.telefono}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      name="mail"
                      defaultValue={editingCliente.mail}
                      className="input-field"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estado</label>
                    <select
                      name="estado"
                      defaultValue={editingCliente.estado || 'ACTIVO'}
                      className="input-field"
                    >
                      <option value="ACTIVO">Activo</option>
                      <option value="INACTIVO">Inactivo</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nueva Contraseña</label>
                    <input
                      type="password"
                      name="password"
                      className="input-field"
                      minLength={6}
                      placeholder="Dejar vacío para mantener la actual"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Solo completar si se desea cambiar la contraseña.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false)
                      setEditingCliente(null)
                    }}
                    className="btn-secondary"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Clientes

