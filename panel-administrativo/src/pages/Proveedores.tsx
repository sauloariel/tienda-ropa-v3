import React, { useState, useEffect } from 'react'
import { 
  Plus,
  Edit, 
  Trash2, 
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle,
  XCircle,
  X
} from 'lucide-react'
import { proveedoresAPI, type Proveedor, type ProveedorCreate, type ProveedorUpdate } from '../services/proveedores'

const Proveedores: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [proveedores, setProveedores] = useState<Proveedor[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProveedor, setEditingProveedor] = useState<Proveedor | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Cargar proveedores al montar el componente
  useEffect(() => {
    cargarProveedores()
  }, [])

  const cargarProveedores = async () => {
    try {
      setLoading(true)
      const data = await proveedoresAPI.getProveedores()
      setProveedores(data)
    } catch (error) {
      setError('Error al cargar los proveedores')
      console.error('Error cargando proveedores:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredProveedores = proveedores.filter(proveedor =>
    proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proveedor.telefono.includes(searchTerm)
  )

  const handleAdd = () => {
    setShowAddModal(true)
    setError(null)
  }

  const handleEdit = (proveedor: Proveedor) => {
    setEditingProveedor(proveedor)
    setShowEditModal(true)
    setError(null)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      try {
        await proveedoresAPI.deleteProveedor(id)
        setSuccess('Proveedor eliminado correctamente')
        cargarProveedores()
      } catch (error) {
        setError('Error al eliminar el proveedor')
        console.error('Error eliminando proveedor:', error)
      }
    }
  }

  const handleSubmit = async (proveedorData: ProveedorCreate | ProveedorUpdate) => {
    try {
      if (editingProveedor) {
        await proveedoresAPI.updateProveedor(editingProveedor.id_proveedor, proveedorData as ProveedorUpdate)
        setSuccess('Proveedor actualizado correctamente')
      } else {
        await proveedoresAPI.createProveedor(proveedorData as ProveedorCreate)
        setSuccess('Proveedor creado correctamente')
      }
      setShowAddModal(false)
      setShowEditModal(false)
      setEditingProveedor(null)
      cargarProveedores()
    } catch (error) {
      setError('Error al guardar el proveedor')
      console.error('Error guardando proveedor:', error)
    }
  }

  const closeModals = () => {
    setShowAddModal(false)
    setShowEditModal(false)
    setEditingProveedor(null)
    setError(null)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <Building2 className="h-8 w-8 text-blue-600" />
          Gestión de Proveedores
        </h1>
        <button
          onClick={handleAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Agregar Proveedor
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Buscar proveedores por nombre, contacto o teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Alertas */}
      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          {success}
        </div>
      )}

      {/* Tabla de proveedores */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proveedor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProveedores.map((proveedor) => (
                <tr key={proveedor.id_proveedor} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {proveedor.nombre}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{proveedor.contacto}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Phone className="h-4 w-4 mr-2 text-gray-400" />
                      {proveedor.telefono}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {proveedor.direccion}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(proveedor)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="Editar"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(proveedor.id_proveedor)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
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

        {filteredProveedores.length === 0 && (
          <div className="text-center py-12">
            <Building2 className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No hay proveedores</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm ? 'No se encontraron proveedores con ese criterio de búsqueda.' : 'Comienza agregando un nuevo proveedor.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal para agregar/editar proveedor */}
      {(showAddModal || showEditModal) && (
        <ProveedorModal
          proveedor={editingProveedor}
          onSubmit={handleSubmit}
          onClose={closeModals}
          isEdit={!!editingProveedor}
        />
      )}
    </div>
  )
}

// Modal para agregar/editar proveedor
interface ProveedorModalProps {
  proveedor: Proveedor | null
  onSubmit: (data: ProveedorCreate | ProveedorUpdate) => void
  onClose: () => void
  isEdit: boolean
}

const ProveedorModal: React.FC<ProveedorModalProps> = ({ proveedor, onSubmit, onClose, isEdit }) => {
  const [formData, setFormData] = useState({
    nombre: proveedor?.nombre || '',
    contacto: proveedor?.contacto || '',
    direccion: proveedor?.direccion || '',
    telefono: proveedor?.telefono || ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">
            {isEdit ? 'Editar Proveedor' : 'Agregar Proveedor'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Proveedor
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contacto
            </label>
            <input
              type="text"
              name="contacto"
              value={formData.contacto}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Teléfono
            </label>
            <input
              type="text"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              {isEdit ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Proveedores


